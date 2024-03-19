from ..sql.sql_get import get_user_by_email, get_user_by_username
from flask_wtf import FlaskForm
from wtforms import StringField, EmailField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, Email, ValidationError


class LoginForm(FlaskForm):
    username = StringField(
        validators=[InputRequired(), Length(min=2, max=25)],
        description="Username, must be between 2 and 25 characters long",
        render_kw={"placeholder": "Username"},
    )
    password = PasswordField(
        validators=[InputRequired(), Length(min=6, max=25)],
        description="Password must be between 6 and 25 characters long",
        render_kw={"placeholder": "Password"},
    )
    submit = SubmitField(
        "Login",
        render_kw={"id": "form-submit"}
    )


class RegisterForm(LoginForm):
    email = EmailField(
        validators=[InputRequired(), Email()],
        description="Your email",
        render_kw={"placeholder": "Email"},
    )
    submit = SubmitField("Register")

    def validate_user(self, username):
        existing_username = get_user_by_username(username.data)
        if existing_username:
            raise ValidationError("Username already exists")

    def validate_email(self, email):
        existing_email = get_user_by_email(email.data)
        if existing_email:
            raise ValidationError("Email already exists")
