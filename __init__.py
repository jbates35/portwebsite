from flask import Flask, url_for, redirect

from .extensions import db
import json

from .projects.projects import projects_bp
from .sql.sql_get import sql_single_project_bp

from .func_test.func_test import test_func_bp


def get_sql_config(file):
    """
    Get the SQL config from a JSON file.

    :param file: The JSON file to read from.
    """
    with open(file) as f:
        data = json.load(f)
    user = data["user"]
    pw = data["password"]
    host = data["host"]
    db = data["db"]

    return f"postgresql://{user}:{pw}@{host}/{db}"


def create_app():
    app = Flask(__name__)

    # Instantiate SQL and link it to app
    app.config["SQLALCHEMY_DATABASE_URI"] = get_sql_config("sql_config.json")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    # TEST DELETE LATER
    app.register_blueprint(test_func_bp)

    # Register pages - blueprints
    app.register_blueprint(projects_bp, url_prefix="/projects")

    # Register SQL blueprint
    app.register_blueprint(sql_single_project_bp)

    @app.route("/")
    def index():
        return redirect(url_for("projects.projects"))

    return app
