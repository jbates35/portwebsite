from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required

from ..extensions import db
from ..models.projects import Project

sql_update_project_param_bp = Blueprint("update_project_param", __name__)


def update_project_param(project_id, param, value):
    project = Project.query.filter_by(id=project_id).first()

    if not hasattr(project, param):
        raise ValueError(f"Project does not have attribute: {param}")

    setattr(project, param, value)
    db.session.commit()


@login_required
@sql_update_project_param_bp.route("/data/update_project_param/", methods=["GET", "POST"])
def update_project_param_bp():
    if not current_user.__dict__ or current_user.id != 1:
        return jsonify({"success": False, "error": "User not logged in"}, 500)

    try:
        data = request.get_json(silent=True)

        if not data:
            return jsonify({"success": False, "error": "Request not valid"}, 400)

        project_id = data["id"]
        param = data["param"]
        value = data["value"]

        update_project_param(
            project_id=project_id,
            param=param,
            value=value
        )
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "error": e}, 500)
