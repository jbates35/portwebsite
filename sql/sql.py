from flask import Blueprint, jsonify

from ..extensions import db
from ..models.projects import Project

sql_all_projects_bp = Blueprint("sql_all_projects", __name__)


@sql_all_projects_bp.route("/data/all_projects")
def get_projects():
    project_data = (
        Project.query.with_entities(Project.id, Project.date, Project.title)
        .filter(Project.show == True)
        .order_by(Project.id.desc())
        .all()
    )

    projects = [
        {
            "id": project.id,
            "date": project.date.strftime("%Y-%m-%d"),
            "title": project.title,
        }
        for project in project_data
    ]

    return jsonify(projects)
