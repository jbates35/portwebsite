from flask import Flask, url_for, redirect
from flask_session import Session

import json

from .extensions import db, bcrypt, login_manager

from .projects.projects import projects_bp
from .resume.resume import resume_bp
from .about.about import about_bp
from .project_management.project_management import upload_project_bp, edit_project_bp
from .session.session import login_bp, logout_bp, check_user_bp  # , register_bp
from .sql.sql_get import sql_single_project_bp, sql_project_list_bp, get_user
from .sql.sql_post import sql_update_project_param_bp

# from .sql_merge.sql_merge import sql_merge_bp


def get_sql_config(file):
    """
    Get the SQL config from a JSON file.

    :param file: The JSON file to read from.
    """
    with open(file) as f:
        config = json.load(f)["sql_config"]
    user = config["user"]
    pw = config["password"]
    host = config["host"]
    db = config["db"]

    return f"postgresql://{user}:{pw}@{host}/{db}"


def create_app():
    app = Flask(__name__)

    file = "web_config.json"

    with open(file) as f:
        config = json.load(f)["web_config"]

    # Instantiate SQL and link it to app
    app.config["SQLALCHEMY_DATABASE_URI"] = get_sql_config(file)
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = config["SECRET_KEY"]
    app.config["SESSION_TYPE"] = "filesystem"
    Session(app)

    # Initialize the extensions
    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return get_user(user_id)

    # TEST DELETE LATER
    # app.register_blueprint(sql_merge_bp, url_prefix="/sql_merge")

    # Register pages - blueprints
    app.register_blueprint(projects_bp, url_prefix="/projects")
    app.register_blueprint(resume_bp, url_prefix="/resume")
    app.register_blueprint(about_bp, url_prefix="/about")
    app.register_blueprint(login_bp, url_prefix="/session")
    app.register_blueprint(logout_bp, url_prefix="/session")
    app.register_blueprint(edit_project_bp, url_prefix="/project")
    app.register_blueprint(upload_project_bp, url_prefix="/project")

    # Don't use - most likely
    # app.register_blueprint(register_bp, url_prefix="/register")

    # Register SQL blueprint
    app.register_blueprint(sql_single_project_bp, url_prefix="/data")
    app.register_blueprint(sql_project_list_bp, url_prefix="/data")

    # Helper blueprints
    app.register_blueprint(check_user_bp, url_prefix="/session")
    app.register_blueprint(sql_update_project_param_bp)

    @app.route("/")
    def index():
        return redirect(url_for("projects.projects"))

    return app
