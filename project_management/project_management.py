
from flask import Blueprint, render_template
from ..sql.sql_get import get_single_project
from .project_upload_form import ProjectForm
upload_project_bp = Blueprint(
    "upload_project", __name__, template_folder="templates", static_folder="static"
)

edit_project_bp = Blueprint(
    "edit_project", __name__, template_folder="templates", static_folder="static"
)

# TODO: Make sure to encapsulate these in admin privileges


@upload_project_bp.route("/upload", methods=["GET", "POST"])
@edit_project_bp.route("/edit/<int:project_id>", methods=["GET", "POST"])
def manage_project(project_id=None):
    form = ProjectForm()

    # If project_is it not None, that means we are editing a project
    if project_id is not None:
        project_info = get_single_project(project_id)

        # Editing project fields now
        form.set_default_values(project_info=project_info)
    else:
        # When uploading a new project . . .
        # We will check project_info against None in jinja to see if we need to alter fields in jinja
        project_info = None

    if form.validate_on_submit():
        # First upload PSQL Information

        # Get OS information for project upload information
        file = "web_config.json"
        with open(file) as f:
            config = json.load(f)["os"]

        # Now create folder

        # Upload files

        # Process images, make small and large files

        # Upload files

        # Process display image

        # Upload display picture

    return render_template(
        "proj_management.html",
        form=form,
        project=project_info,
    )
