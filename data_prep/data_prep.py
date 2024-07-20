from flask import Blueprint, render_template, jsonify
from ..sql.sql_get import get_projects, get_single_project
from ..sql.sql_post import update_project_param

from html import unescape

html_decode_bp = Blueprint("html_decode", __name__)

# TODO: DELETE THIS LATER


@html_decode_bp.route("/html_decode/")
def html_decode():
    return jsonify(replace_html_chars_with_markdown())


def replace_html_chars_with_markdown():
    for project in get_projects():
        project_data = get_single_project(project["id"])

        update_project_param(
            project_data["id"],
            "description",
            unescape(project_data["description"])
        )
        update_project_param(
            project_data["id"],
            "title",
            unescape(project_data["title"])
        )
    return {}


def merge_img_desc():
    """
    DEPRECATED - imgfilesuploaded and imgdesc are no longer a thing
    """
    ret_list = []

    for project in get_projects():
        project_data = get_single_project(project["id"])
        image_count = project_data["imgfilesuploaded"]

        project_images = []

        for image_name, image_desc in zip(range(1, image_count+1), project_data["imgdesc"]):
            project_images.append({
                "file": f"{image_name}.jpg",
                "description": image_desc
            })

        update_project_param(
            project_data["id"], "project_images", project_images)
        ret_list.append(project_images)
        print(
            f"Updating project {project_data['id']} with project images: {project_images}")
    return ret_list


def merge_files_sql():
    files = None

    projects = get_projects()
    for project in projects:
        data = get_single_project(project["id"])

        files = []

        if data["olink1"] is not None:
            files.append(
                {"file": data["olink1"], "description": data["olinkdesc1"]})
        if data["olink2"] is not None:
            files.append(
                {"file": data["olink2"], "description": data["olinkdesc2"]})
        if data["olink3"] is not None:
            files.append(
                {"file": data["olink3"], "description": data["olinkdesc3"]})

        print(f"Updating project {data['id']} with files: {files}")

        update_project_param(data["id"], "files", files)

    return files
