from flask import Blueprint, render_template

from .forms import LoginForm, RegisterForm

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
    form = LoginForm()
    return render_template("login.html", form=form)


@logout_bp.route("/")
def logout():
    return render_template("logout.html")


@register_bp.route("/")
def register():
    form = RegisterForm()
    return render_template("register.html", form=form)
