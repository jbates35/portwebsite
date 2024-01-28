from flask import Flask, url_for, redirect

from .extensions import db
import json

from .projects.projects import projects_bp
from .resume.resume import resume_bp
from .about.about import about_bp
from .sql.sql_get import sql_single_project_bp, sql_project_list_bp

# from .func_test.func_test import test_func_bp


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

    db.init_app(app)

    # TEST DELETE LATER
    # app.register_blueprint(test_func_bp)

    # Register pages - blueprints
    app.register_blueprint(projects_bp, url_prefix="/projects")
    app.register_blueprint(resume_bp, url_prefix="/resume")
    app.register_blueprint(about_bp, url_prefix="/about")

    # Register SQL blueprint
    app.register_blueprint(sql_single_project_bp)
    app.register_blueprint(sql_project_list_bp)

    @app.route("/")
    def index():
        return redirect(url_for("projects.projects"))

    return app
