from flask import Blueprint, jsonify, request

from ..extensions import db
from ..models.projects import Project

sql_update_project = Blueprint("sql_update_project", __name__)


# NOTE - likely we need these endpoints to be protected by user login
@sql_update_project.route("data/update_project/", methods=("POST"))
def update_project():
    data = request.get_json()
    # TO BE COMPLETED
    return jsonify(data)


def update_project_param(project_id, param, value):
    project = Project.query.filter_by(id=project_id).first()

    if not hasattr(project, param):
        raise ValueError(f"Project does not have attribute: {param}")

    setattr(project, param, value)
    db.session.commit()
