from flask import Blueprint, render_template, jsonify
from ..sql.sql_get import get_projects, get_single_project
from ..sql.sql_post import update_project_param

test_func_bp = Blueprint("test_func", __name__)

# NOTE PLEASE DELETE THIS LATER
# TODO DELETE THIS LATER


@test_func_bp.route("/func_test")
def test_func():
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
