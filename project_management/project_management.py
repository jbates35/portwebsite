import json
from typing import Optional
from flask import Blueprint, render_template
from flask_login import current_user, login_required
from werkzeug.utils import secure_filename
from pathlib import Path
from PIL import Image

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
    errors = form.errors or {}

    if project_id is not None:
        project_info = get_single_project(project_id)
    else:
        project_info = None

    if form.validate_on_submit():
        # try:
        # Need an SQL object to start off with
        if project_id is None:
            new_project = True
            project = Project()
            db.session.add(project)
            # Flush will tell sqlalchemy to generate an ID without writing to database yet
            db.session.flush()
        else:
            new_project = False
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
        for i, file_form in enumerate(form.files):
            current_form = file_form.form

            current_file = None
            if project_info and i < len(project_info["files"]):
                current_file = project_info["files"][i]["file"]

            # Delete old file logic (if new file or delete checkbox)
            delete_file = current_form.file.data or current_form.delete.data
            if current_file and delete_file:
                (base_id_folder / current_file).unlink(missing_ok=True)

            # Take care of SQL and upload
            file_name = None
            if current_form.file.data:
                file_name = secure_filename(
                    current_form.file.data.filename)
                current_form.file.data.save(
                    base_id_folder / file_name
                )
            elif current_file and not current_form.delete.data:
                file_name = current_file

            # Prepare SQL entry
            if file_name:
                file_dict = {
                    "file": file_name,
                    "description": current_form.description.data or ""
                }
                files.append(file_dict)

        # Second, take care of any uploaded project images
        images = []
        for i, image_form in enumerate(form.images):
            current_form = image_form.form

            # Store image that was there beforehand
            current_image = None
            if project_info and i < len(project_info["project_images"]):
                current_image = project_info["project_images"][i]["file"]

            # Delete old image if need be
            delete_image = current_form.file.data or current_form.delete.data
            if current_image and delete_image:
                (large_img_folder / current_image).unlink(missing_ok=True)
                (small_img_folder / current_image).unlink(missing_ok=True)

            # Take care of SQL and image resizing/upload
            image_name = None
            if current_form.file.data:
                image_name = secure_filename(
                    current_form.file.data.filename)

                # Image processing area
                im = Image.open(current_form.file.data)
                w, h = im.size

                # Create large image
                if w > 1200:
                    ratio = 1200/w
                    large_size = (int(w*ratio), int(h*ratio))
                else:
                    large_size = (w, h)
                large_img = im.resize(large_size)

                # Create small image (square)
                # First make square, then resize
                if w > h:
                    small_crop = (int((w-h)/2), 0, int((w+h)/2), h)
                else:
                    small_crop = (0, int((h-w)/2), w, int((h+w)/2))
                small_size = (135, 135)
                small_img = im.crop(small_crop)
                small_img = small_img.resize(small_size)

                # Save images
                large_img.save(large_img_folder / image_name)
                small_img.save(small_img_folder / image_name)

            elif current_image and not current_form.delete.data:
                file_name = current_image

            # Prepare SQL entry
            if image_name:
                image_dict = {
                    "file": image_name,
                    "description": current_form.description.data or ""
                }
                images.append(image_dict)

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
        project.project_images = images

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
            new_project=new_project,
            project=project
        )
        # except Exception as e:
        #     errors["Custom"] = [e]

    # If project_is it not None, that means we are editing a project
    if project_info is not None:
        project_info["files"] = project_info["files"] or []
        project_info["project_images"] = project_info["project_images"] or []
        # If we are editing the project, we want to change the wtforms to add default values from the sql entry
        form.set_default_values(project_info=project_info)

    return render_template(
        "project.html",
        form=form,
        project=project_info,
        errors=errors
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
