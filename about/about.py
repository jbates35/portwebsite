from flask import Blueprint, render_template


about_bp = Blueprint(
    "about", __name__, template_folder="templates", static_folder="static"
)


@about_bp.route("/")
def about():
    lines = ["Hello", "World", "How", "Are", "You"]
    return render_template("about.html", lines=lines)
