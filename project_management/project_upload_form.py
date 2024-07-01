from wtforms import (
    DateField,
    FieldList,
    Form,
    FormField,
    StringField,
    TextAreaField,
    BooleanField,
    validators,
    SubmitField
)
from flask import current_app
from flask_wtf.file import FileField
from flask_wtf import FlaskForm
from flask_uploads import UploadSet, configure_uploads, IMAGES

# For parsing dates
from datetime import datetime

# TAken from: https://gist.github.com/greyli/81d7e5ae6c9baf7f6cdfbf64e8a7c037
photos = UploadSet('photos', IMAGES)
# configure_uploads(current_app, photos)


class FileUpload(Form):
    description = StringField()
    file = FileField()


class ImageForm(Form):
    description = TextAreaField(render_kw={'class': 'img-file-desc'})
    file = FileField(render_kw={'class': 'iup file-c'})


class ProjectForm(FlaskForm):
    id = ""
    files = FieldList(FormField(FileUpload),
                      min_entries=3, max_entries=3)
    images = FieldList(FormField(ImageForm),
                       min_entries=6, max_entries=6)

    title = StringField("Project Title", [validators.Length(max=25)])
    date = DateField("Project Date")
    display_image = FileField("Display Image", render_kw={
                              'class': 'filec', 'id': 'img-file-id'})
    description = TextAreaField("Project Description", render_kw={
                                'id': 'proj-description'})
    youtube_link = StringField("Youtube Link")
    siphon_youtube_link = BooleanField("Siphon Youtube Link")
    creator = StringField("Creator(s)")
    programming_language = StringField("Programming Language(s)")
    submit = SubmitField("Submit")

    def set_default_values(self, project_info):
        # Easy stuff
        self.title.data = project_info['title']
        self.description.data = project_info['description']
        self.creator.data = project_info['creator']
        self.programming_language.data = project_info['planguage']
        self.youtube_link.data = project_info['ylink']

        # Parse date from string format to date format
        date_str = project_info['date']
        date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
        self.date.data = date_obj
