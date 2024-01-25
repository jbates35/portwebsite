from flask import Blueprint, render_template
import yaml

about_bp = Blueprint(
    "about", __name__, template_folder="templates", static_folder="static"
)


@about_bp.route("/")
def about():
    entries = None
    with open("yaml/about.yaml", "r") as file:
        entries = yaml.safe_load(file)
    return render_template("about.html", entries=entries)
