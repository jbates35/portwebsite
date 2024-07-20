import json
from typing import Optional
from flask import Blueprint, render_template, abort
from flask_login import current_user, login_required
from werkzeug.utils import secure_filename
from pathlib import Path
from PIL import Image
import requests
from io import BytesIO
import shutil
from markdown import markdown

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

    if project_id is not None:
        project_info = get_single_project(project_id)
    else:
        project_info = None

    if form.validate_on_submit():
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
                ratio = 1
                if w > 1200:
                    ratio = 1200/w
                large_size = (int(w*ratio), int(h*ratio))
                large_img = im.resize(large_size)
                large_img.save(large_img_folder / image_name)

                # Create small image (square)
                # First make square, then resize
                if w > h:
                    small_crop = (int((w-h)/2), 0, int((w+h)/2), h)
                else:
                    small_crop = (0, int((h-w)/2), w, int((h+w)/2))
                small_size = (135, 135)
                small_img = im.crop(small_crop)
                small_img = small_img.resize(small_size)
                small_img.save(small_img_folder / image_name)

            elif current_image and not current_form.delete.data:
                image_name = current_image

            # Prepare SQL entry
            if image_name:
                image_dict = {
                    "file": image_name,
                    "description": current_form.description.data or ""
                }
                images.append(image_dict)

        # Display and header pic logic for profile pic
        im = None
        if not form.siphon_youtube_link.data and form.display_image.data:
            # Grab the image from the file field
            im = Image.open(form.display_image.data)
        elif form.siphon_youtube_link.data and form.youtube_link.data:
            # Grab the image from the youtube preview
            youtube_link = f"http://img.youtube.com/vi/{form.youtube_link.data}/maxresdefault.jpg"
            youtube_request = requests.get(youtube_link)
            im = Image.open(BytesIO(youtube_request.content))

        if im:
            # Delete the current file
            (base_id_folder / "headerpic.jpg").unlink(missing_ok=True)
            (base_id_folder / "displaypic.jpg").unlink(missing_ok=True)

            w, h = im.size

            # Header pic is a pic in lieue of having a youtube video
            ratio = 1
            if w > 1200:
                ratio = 1200/w
            header_size = (int(ratio*w), int(ratio*h))
            header_img = im.resize(header_size)
            header_img.save(base_id_folder / "headerpic.jpg")

            # Display pic is a square 300x300 pic shown in the projects page
            if w > h:
                display_crop = (int((w-h)/2), 0, int((w+h)/2), h)
            else:
                display_crop = (0, int((h-w)/2), w, int((h+w)/2))
            display_size = (300, 300)
            display_img = im.crop(display_crop)
            display_img = display_img.resize(display_size)
            display_img.save(base_id_folder / "displaypic.jpg")

        # Check if displaypic exists - easier way of accommodatiylinkng both editing and uploading
        if not (base_id_folder / "displaypic.jpg").exists():
            project.show = False

        # TODO: TEST REMOVE THIS
        print(f"\n\n{markdown(form.description.data)}\n\n")

        # Easy data to fill in tifrst
        project.date = form.date.data
        project.description = markdown(form.description.data)
        project.title = form.title.data
        project.ylink = form.youtube_link.data
        project.creator = form.creator.data
        project.planguage = form.programming_language.data
        project.github_repo = form.github_repo.data
        project.author = current_user.id
        project.files = files
        project.project_images = images

        db.session.commit()

        return render_template(
            "post_project.html",
            new_project=new_project,
            project=project
        )

    # If we are here, the form has not been submitted or there is an error
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
        errors=form.errors
    )


@login_required
@delete_project_bp.route("/delete/<int:project_id>", methods=["GET", "POST"])
def delete_project(project_id: int):
    error = None
    project = Project.query.get(project_id)

    # Get OS information for project upload information
    cfg_file = "web_config.json"
    with open(cfg_file) as f:
        cfg = json.load(f)["os"]
    upload_folder = Path(cfg["uploads_folder"])
    base_id_folder = upload_folder / str(project_id)

    try:
        # Delete the folder and its contents
        shutil.rmtree(base_id_folder)

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
