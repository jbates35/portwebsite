from flask import Blueprint, render_template
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField

from ..sql.sql_get import get_user

login_bp = Blueprint(
    "login", __name__, template_folder="templates", static_folder="static"
)

logout_bp = Blueprint(
    "logout", __name__, template_folder="templates", static_folder="static"
)

register_bp = Blueprint(
    "register", __name__, template_folder="templates", static_folder="static"
)


@login_bp.route("/")
def login():
    return render_template("login.html")


@logout_bp.route("/")
def logout():
    return render_template("logout.html")


@register_bp.route("/")
def register():
    return render_template("register.html")
