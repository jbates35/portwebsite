from os import walk
from flask import Blueprint, jsonify, request

from ..extensions import db
from ..models.projects import Project
from ..models.users import User

sql_single_project_bp = Blueprint("sql_single_project", __name__)
sql_project_list_bp = Blueprint("sql_project_list", __name__)
sql_user_bp = Blueprint("sql_user", __name__)


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
    project_data = db.session.query(Project).filter(
        Project.id == project_id).all()
    project = project_data[0].serialize()
    return jsonify(project)


@sql_project_list_bp.route("/data/project_list/")
def get_project_list():
    """Just get a simple array of project titles and ids"""
    project_list = []

    project_data = (
        Project.query
        .filter(Project.show)
        .order_by(Project.id.desc())
        .all()
    )

    for project in project_data:
        project_list.append(project.id)

    return jsonify(project_list)


def get_user(id: int = None, username: str = None, email: str = None) -> User:
    """Get user from the sql database by any set parameter
    Args:
        id (int): User id
        username (str): Username
        email (str): Email
    """
    params = {
        "id": id,
        "username": username,
        "email": email,
    }
    params = {k: v for k, v in params.items() if v is not None}
    user = User.query.filter_by(**params).first()
    return user


def user_dict(user: User) -> dict:
    """
    Convert user object to dictionary
    Args:
        user (User): User object
    """
    return user.serialize()
