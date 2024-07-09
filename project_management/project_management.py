import datetime
import json
from flask import Blueprint, render_template, abort
from flask_login import current_user, login_required

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
            project = Project.query.get(project_id)

        # Get OS information for project upload information
        cfg_file = "web_config.json"
        with open(cfg_file) as f:
            cfg = json.load(f)["os"]
            upload_folder = cfg["uploads_folder"]

        # Make the folder that will be related to this project, if it's a new project

        # First parse any file data
        files = []
        for file_form in form.files:
            _form = file_form.form
            if _form.file.data:
                # TODO: Check if any old file is uploaded and delete
                # TODO: Upload the new file

                file_dict = {
                    "file": _form.file.data.filename,
                    "description": _form.description.data or ""
                }
                files.append(file_dict)
            elif _form.old_file.data and not _form.delete.data:
                file_dict = {
                    "file": _form.old_file.data,
                    "description": _form.description.data or ""
                }
                files.append(file_dict)
            elif _form.old_file.data:
                pass
                # TODO: Delete the file that's currently uploaded

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
                    files.append(image_dict)
                elif _form.old_image.data and not _form.delete.data:
                    image_dict = {
                        "file": _form.old_image.data,
                        "description": _form.description.data or ""
                    }
                    files.append(image_dict)
                elif _form.old_image.data:
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

    return render_template(
        "post_project.html",
        form=form,
        project=project_info,
        errors=form.errors
    )


@login_required
@delete_project_bp.route("/delete/<int:project_id>", methods=["GET", "POST"])
def delete_project(project_id: int):
    error = None
    project = Project.query.get(project_id)

    try:
        # Delete folder and files associated witht he project_id

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
