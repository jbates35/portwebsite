
from flask import Blueprint, render_template
from ..sql.sql_get import get_single_project
from .project_upload_form import ProjectForm
upload_project_bp = Blueprint(
    "upload_project", __name__, template_folder="templates", static_folder="static"
)


@upload_project_bp.route("/")
def upload_project():
    project_form = ProjectForm()

    return render_template(
        "proj_management.html",
        form=project_form
    )
