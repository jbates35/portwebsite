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

# TAken from: https://gist.github.com/greyli/81d7e5ae6c9baf7f6cdfbf64e8a7c037
photos = UploadSet('photos', IMAGES)
# configure_uploads(current_app, photos)


class FileUpload(Form):
    description = StringField()
    name = StringField()
    file = FileField()


class ImageForm(Form):
    image_file = FileField()
    image_description = TextAreaField()


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
    description = TextAreaField("Project Description")
    youtube_link = StringField("Youtube Link")
    siphon_youtube_link = BooleanField("Siphon Youtube Link")
    creator = StringField("Creator(s)")
    programming_language = StringField("Programming Lanuage(s)")
    submit = SubmitField("Submit")
