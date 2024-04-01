from flask import Blueprint, render_template, redirect, url_for, jsonify
from flask_login import login_user, login_required, logout_user, current_user


from .forms import LoginForm, RegisterForm

from ..sql.sql_get import get_user, user_dict
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

check_user_bp = Blueprint("check_user", __name__)


@login_bp.route("/", methods=["GET", "POST"])
def login():
    form = LoginForm()
    msg = ""

    if form.validate_on_submit():
        try:
            user = get_user(username=str(form.username.data)) or {}
            password = user_dict(user).get("password", None)
            result = bcrypt.check_password_hash(
                password, str(form.password.data))
            if result:
                login_user(user, remember=False)
                return redirect(url_for("projects.projects"))
        except Exception as e:
            msg = e
        else:
            msg = "User not found."

    return render_template("login.html", form=form, msg=msg)


@ logout_bp.route("/")
@ login_required
def logout():
    logout_user()
    return render_template("logout.html")


@ register_bp.route("/")
def register():
    form = RegisterForm()
    return render_template("register.html", form=form)


def check_user():
    try:
        return current_user.id == 1
    except Exception:
        return False


@ check_user_bp.route("/")
def check_user_bp_func():
    try:
        logged_in = check_user()
        return jsonify({"success": True, "logged_in": logged_in})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
