import json
from typing import Optional
from flask import Blueprint, render_template
from flask_login import current_user, login_required
from werkzeug.utils import secure_filename
from pathlib import Path

from .project_upload_form import ProjectForm
from ..sql.sql_get import get_single_project
from ..extensions import db
from ..models.projects import Project

upload_project_bp = Blueprint(
    "upload_project", __name__, template_folder="templates", static_folder="static", static_url_path="/upload",
)

edit_project_bp = Blueprint(
    "edit_project", __name__, template_folder="templates", static_folder="static", static_url_path="/upload",
)

delete_project_bp = Blueprint(
    "delete_project", __name__, template_folder="templates", static_folder="static", static_url_path="/delete"
)


# @login_required
@upload_project_bp.route("/upload", methods=["GET", "POST"])
@edit_project_bp.route("/edit/<int:project_id>", methods=["GET", "POST"])
def post_project(project_id=None):
    # if not current_user.__dict__ or current_user.id != 1:
    #     abort(403)

    form = ProjectForm()
    success = False

    # BUG: The following overwrites any data being input from the form.

    # If project_is it not None, that means we are editing a project
    if project_id is not None:
        project_info = get_single_project(project_id)

        # Create empty lists in place of null values to prevent errors in HTML
        project_info['files'] = project_info['files'] or []
        project_info['project_images'] = project_info['project_images'] or []

        # If we are editing the project, we want to change the wtforms to add default values from the sql entry
        form.set_default_values(project_info=project_info)
    else:
        # When uploading a new project . . .
        # We will check project_info against None in jinja to see if we need to alter fields in jinja
        project_info = None

    if form.validate_on_submit():

        # Need an SQL object to start off with
        if project_id is None:
            project = Project()
            db.session.add(project)
            # Flush will tell sqlalchemy to generate an ID without writing to database yet
            db.session.flush()
        else:
            project: Optional[Project] = Project.query.get(project_id)

            # This should never happen, but in case project_id fails.
            if project is None:
                project = Project()
                project.id = project_id

        # Get OS information for project upload information
        cfg_file = "web_config.json"
        with open(cfg_file) as f:
            cfg = json.load(f)["os"]
        upload_folder = Path(cfg["uploads_folder"])

        # Make the folder that will be related to this project, if it's a new project
        base_id_folder = upload_folder / str(project.id)
        large_img_folder = base_id_folder / "img" / "large"
        small_img_folder = base_id_folder / "img" / "small"

        base_id_folder.mkdir(parents=True, exist_ok=True)
        large_img_folder.mkdir(parents=True, exist_ok=True)
        small_img_folder.mkdir(parents=True, exist_ok=True)

        # First parse any file data
        files = []
        for file_form in form.files:
            _form = file_form.form

            # Delete old file logic (if new file or delete checkbox)
            delete_file = _form.file.data or _form.delete.data
            if _form.old_file and delete_file:
                (base_id_folder / _form.old_file).unlink(missing_ok=True)

            # Take care of SQL and upload
            file_name = None
            if _form.file.data:
                file_name = secure_filename(_form.file.data.filename)
                _form.file.data.save(
                    base_id_folder / file_name
                )
            elif _form.old_file and not _form.delete.data:
                file_name = _form.old_file

            # Prepare SQL entry
            if file_name:
                file_dict = {
                    "file": file_name,
                    "description": _form.description.data or ""
                }
                files.append(file_dict)

            project_images = []
            for image_form in form.images:
                _form = image_form.form
                if _form.file.data:
                    # TODO: Need to process the image here too
                    # TODO: Resize and create two versions of the file
                    # TODO: Check if any old file is uploaded and delete

                    image_dict = {
                        "file": _form.file.data.filename,
                        "description": _form.description.data or ""
                    }
                    project_images.append(image_dict)
                elif _form.old_image and not _form.delete.data:
                    image_dict = {
                        "file": _form.old_image,
                        "description": _form.description.data or ""
                    }
                    project_images.append(image_dict)
                elif _form.old_image:
                    pass
                    # TODO: Delete the file that's currently uploaded

        if not form.siphon_youtube_link.data and form.display_image.data:
            # Grab the image from the file field
            pass
        else:
            # Grab the image from the youtube preview
            pass

        # Easy data to fill in tifrst
        project.date = form.date.data
        project.description = form.description.data
        project.title = form.title.data
        project.ylink = form.youtube_link.data
        project.creator = form.creator.data
        project.planguage = form.programming_language.data
        project.github_repo = form.github_repo.data
        project.author = current_user.id
        project.files = files

        db.session.commit()

        # for file_field in form.images:
        #     file = file_field.form.file.data
        # First upload PSQL Information

        # Now create folder

        # Upload files

        # Process images, make small and large files

        # Upload files

        # Process display image

        # Upload display picture

        # TODO: Show some type of information if successj
        success = True

    return render_template(
        "post_project.html",
        form=form,
        project=project_info,
        success=success,
        errors=form.errors
    )


@login_required
@delete_project_bp.route("/delete/<int:project_id>", methods=["GET", "POST"])
def delete_project(project_id: int):
    error = None
    project = Project.query.get(project_id)

    try:
        # TODO: Delete folder and files associated witht he project_id

        # Delete the entry from the SQL table
        db.session.delete(project)
        db.session.commit()

    except Exception as e:
        error = e

    return render_template(
        "delete_project.html",
        project_id=project_id,
        error=error
    )
