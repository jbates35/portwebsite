from typing import List
from PIL import Image
from io import BytesIO
from wtforms import (
    DateField,
    FieldList,
    Form,
    FormField,
    StringField,
    TextAreaField,
    BooleanField,
    validators,
    ValidationError,
    SubmitField
)
from flask_pagedown.fields import PageDownField
from flask_wtf.file import FileField, FileAllowed
from flask_wtf import FlaskForm

# For parsing dates
from datetime import datetime

# TODO: Add validators for all the fields


class FileUpload(Form):
    description = StringField(render_kw={'class': 'file-desc'})
    file = FileField(render_kw={'class': 'file-upload'})
    delete = BooleanField(render_kw={'class': 'no-show file-delete-box'})


class ImageForm(Form):
    file = FileField(render_kw={'class': 'iup file-c'})
    description = TextAreaField(render_kw={'class': 'img-desc'})
    delete = BooleanField(render_kw={'class': 'no-show image-delete-box'})

    def validate_file(form, field):
        """ Use Pillow to verify images """
        if field.data is not None:
            try:
                Image.open(BytesIO(field.data.read()))
                field.data.seek(0)
            except Exception as e:
                raise ValidationError(f"Invalid image: {e}")


class ProjectForm(FlaskForm):
    id = ""
    files = FieldList(FormField(FileUpload),
                      min_entries=3, max_entries=3)
    images = FieldList(FormField(ImageForm),
                       min_entries=6, max_entries=6)

    title = StringField("Project Title", [validators.Length(max=120)])
    date = DateField("Project Date")
    display_image = FileField("Display Image", render_kw={
                              'class': 'filec', 'id': 'img-file-id'})
    description = PageDownField("Project Description")
    github_repo = StringField("Github Repo", [validators.Length(max=255)])
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
        self.github_repo.data = project_info['github_repo']

        # Parse date from string format to date format
        date_str = project_info['date']
        date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
        self.date.data = date_obj

        # Update any image description
        for current_img, form_img in zip(project_info['project_images'], self.images):
            form_img.form.description.data = current_img.get('description', "")

        # Update any file description
        for current_file, form_file in zip(project_info['files'], self.files):
            form_file.form.description.data = current_file.get(
                'description', "")
