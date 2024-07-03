from ..extensions import db

from sqlalchemy.dialects.postgresql import JSONB


class Project(db.Model):
    __tablename__ = "projects"

    date = db.Column(db.Date)
    description = db.Column(db.Text)
    title = db.Column(db.String(120), nullable=False)
    ylink = db.Column(db.String(80))
    creator = db.Column(db.String(120))
    planguage = db.Column(db.String(120))
    github_repo = db.Column(db.String(255))
    author = db.Column(db.Integer)
    uploaddate = db.Column(db.DateTime)
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    files = db.Column(JSONB)
    show = db.Column(db.Boolean, nullable=False, default=True)
    project_images = db.Column(JSONB)

    def serialize(self):
        serialized_data = {}

        for column in self.__table__.columns:
            name = column.name
            val = getattr(self, name)

            if name == "date":
                serialized_data[name] = val.strftime(
                    "%Y-%m-%d") if val else None
            else:
                serialized_data[name] = val

        return serialized_data
