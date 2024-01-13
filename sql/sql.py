from flask import Blueprint, jsonify

from ..extensions import db
from ..models.projects import Project

sql_all_projects_bp = Blueprint("sql_all_projects", __name__)
sql_single_project_bp = Blueprint("sql_single_project", __name__)


@sql_all_projects_bp.route("/data/all_projects")
def get_projects():
    project_data = (
        db.session.query(Project)
        .filter(Project.show == True)
        .order_by(Project.id.desc())
        .all()
    )

    project_keys = ["id", "date", "title"]
    projects = [
        {key: project.serialize()[key] for key in project_keys}
        for project in project_data
    ]

    return jsonify(projects)


@sql_single_project_bp.route("/data/project/<int:project_id>")
def get_single_project(project_id):
    project_data = db.session.query(Project).filter(Project.id == project_id).all()
    project = project_data[0].serialize()
    return jsonify(project)
