from wtforms import (
    DateField,
    FieldList,
    Form,
    FormField,
    StringField,
    TextAreaField,
    validators,
    SubmitField
)
from flask import current_app
from flask_wtf.file import FileField
from flask_wtf import FlaskForm
from flask_uploads import UploadSet, configure_uploads, IMAGES, patch_request_class

# TAken from: https://gist.github.com/greyli/81d7e5ae6c9baf7f6cdfbf64e8a7c037
photos = UploadSet('photos', IMAGES)
configure_uploads(current_app, photos)
patch_request_class(current_app)  # Set maximum file size, default is 16MB


class FileUpload(Form):
    file_name = StringField()
    file_field = FileField()


class ImageForm(Form):
    image_file = FileField()
    image_description = TextAreaField()


class ProjectForm(FlaskForm):
    file_fields = FieldList(FormField(FileUpload),
                            min_entries=3, max_entries=3)
    image_fields = FieldList(FormField(ImageForm),
                             min_entries=6, max_entries=6)

    title_field = StringField("Project Title", [validators.Length(max=25)])
    date_field = DateField("Project Date")
    description_field = TextAreaField("Project Description")
    youtube_link_field = StringField("Youtube link")
    creator_field = StringField("Creator(s)")
    programming_language_field = StringField("Programming Lanuage(s)")
    submit = SubmitField("Submit")
