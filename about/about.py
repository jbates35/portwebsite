from flask import Blueprint, render_template
import yaml
import os

about_bp = Blueprint(
    "about", __name__, template_folder="templates", static_folder="static"
)


@about_bp.route("/")
def about():
    file_path = os.path.join(os.path.dirname(__file__), "yaml", "about.yaml")
    entries = None
    with open(file_path, "r") as file:
        entries = yaml.safe_load(file)
    return render_template("about.html", entries=enumerate(entries))
