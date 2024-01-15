from flask import Blueprint, render_template
from ..sql.sql_get import get_projects
from ..sql.sql_post import update_project

projects_bp = Blueprint(
    "projects", __name__, template_folder="templates", static_folder="static"
)


@projects_bp.route("/")
def projects():
    # Create list of projects
    projects = get_projects()
    empty_boxes = 3 - len(projects) % 3
    if empty_boxes == 3:
        empty_boxes = 0
    return render_template("projects.html", projects=projects, empty_boxes=empty_boxes)
