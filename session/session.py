from os import walk
from flask import Blueprint, render_template, redirect, url_for
from flask_login import login_user


from .forms import LoginForm, RegisterForm

from ..sql.sql_get import get_user, get_user_by_username
from ..extensions import bcrypt

login_bp = Blueprint(
    "login", __name__, template_folder="templates", static_folder="static"
)

logout_bp = Blueprint(
    "logout", __name__, template_folder="templates", static_folder="static"
)

register_bp = Blueprint(
    "register", __name__, template_folder="templates", static_folder="static"
)


@login_bp.route("/", methods=["GET", "POST"])
def login():
    form = LoginForm()
    msg = ""

    if form.validate_on_submit():
        try:
            user_from_db = get_user_by_username(form.username.data) or {}
            password = user_from_db.get("password", None)
            result = bcrypt.check_password_hash(password, form.password.data)
            if result:
                login_user(, remember=False)
                redirect(url_for("projects"))
        except Exception as e:
            msg = e
        else:
            msg = "User not found."

    return render_template("login.html", form=form, msg=msg)


@ logout_bp.route("/")
def logout():
    return render_template("logout.html")


@ register_bp.route("/")
def register():
    form = RegisterForm()
    return render_template("register.html", form=form)
