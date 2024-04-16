from flask_wtf import FlaskForm
from flask_wtf.file import FileField
from flask_uploads import UploadSet, IMAGES

from wtforms import DateField, StringField, SubmitField, TextAreaField, SelectField, validators
from werkzeug.utils import secure_filename


class ProjectForm(FlaskForm):
    file_fields = [
        (StringField(f"File {i} Name", [validators.Length(max=25)]),
         FileField(f"File {i} Upload")
         ) for i in range(3)
    ]

    def __init__(self, project_id=None):
        if project_id is not None:
            raise NotImplementedError

    # date = db.Column(db.Date)
    # description = db.Column(db.Text)
    # title = db.Column(db.String(120), nullable=False)
    # ylink = db.Column(db.String(80))
    # creator = db.Column(db.String(120))
    # planguage = db.Column(db.String(120))
    # author = db.Column(db.Integer)
    # uploaddate = db.Column(db.DateTime)
    # id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # imgfilesuploaded = db.Column(db.Integer)
    # imgdesc = db.Column(db.ARRAY(db.String(200)))
    # files = db.Column(JSONB)
    # show = db.Column(db.Boolean, nullable=False, default=True)
    #
