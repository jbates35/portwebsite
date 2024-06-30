
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
def upload_project():
    form = ProjectForm()

    if form.validate_on_submit():
        print(f"\n {form.date.data} \n {type(form.date.data)} \n")

    return render_template(
        "proj_management.html",
        form=form,
        edit=False
    )


@edit_project_bp.route("/edit/<int:project_id>", methods=["GET", "POST"])
def edit_project(project_id):
    form = ProjectForm()

    project_info = get_single_project(project_id)

    form.set_default_values(project_info=project_info)

    if form.validate_on_submit():
        pass

    return render_template(
        "proj_management.html",
        form=form,
        edit=True,
        project_id=project_id
    )
