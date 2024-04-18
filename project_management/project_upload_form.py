from flask_wtf import FlaskForm
from flask_wtf.file import FileField
from flask_uploads import UploadSet, IMAGES

from wtforms import DateField, StringField, SubmitField, TextAreaField, SelectField, validators, FieldList, FormField
from werkzeug.utils import secure_filename


class FileField(FlaskForm):
    file_name = StringField()
    file_field = FileField()


class ProjectForm(FlaskForm):
    # file_fields = [(
    #     StringField(f"File {i} Name", [validators.Length(max=25)]),
    #     FileField(f"File {i} Upload")
    # ) for i in range(3)]

    file_fields = FieldList(FormField(FileField), min_entries=3, max_entries=3)

    title_field = StringField("Project Title", [validators.Length(max=25)])
    date_field = DateField("Project Date")

    image_fields = []

    # def __init__(self, project_id=None):
    #     if project_id is not None:
    #         raise NotImplementedError
    #
    #     super().__init__()

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
