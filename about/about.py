from flask import Blueprint, render_template
from markdown import markdown
import yaml
import os

about_bp = Blueprint(
    "about", __name__, template_folder="templates", static_folder="static"
)


@about_bp.route("/")
def about():
    file_path = os.path.join(os.path.dirname(__file__), "yaml", "about.yaml")

    # All the about entries are stored in a YAML file.
    with open(file_path, "r") as file:
        entries = yaml.safe_load(file)

    # And there's github style markdown in it
    for entry in entries:
        if "text" in entry:
            entry["text"] = markdown(entry["text"])
    return render_template("about.html", entries=enumerate(entries))
