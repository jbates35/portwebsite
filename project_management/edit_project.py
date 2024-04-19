from flask import Blueprint, render_template
from ..sql.sql_get import get_single_project

edit_project_bp = Blueprint(
    "edit_project", __name__, template_folder="templates", static_folder="static"
)


@edit_project_bp.route("/<int:project_id>")
def edit_project(project_id: int):
    project = get_single_project(project_id=project_id)
    return render_template("edit_project.html", project=project)
