from flask import Blueprint, jsonify, request

from ..extensions import db
from ..models.projects import Project

sql_single_project_bp = Blueprint("sql_single_project", __name__)


def get_projects():
    """Get all projects from database. Only return id, title, date"""
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

    return projects


@sql_single_project_bp.route("/data/project/<int:project_id>")
def get_single_project(project_id):
    """Get single project from database""" ""
    project_data = db.session.query(Project).filter(Project.id == project_id).all()
    project = project_data[0].serialize()
    return project
    return jsonify(project)
