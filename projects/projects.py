from flask import Blueprint, render_template

projects_bp = Blueprint(
    "projects", __name__, template_folder="templates", static_folder="static"
)


@projects_bp.route("/")
def projects():
    project_list = ["asdf", "asdf2"]
    return render_template("projects.html", project_list=project_list)
