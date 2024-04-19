from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_login import LoginManager

db = SQLAlchemy()
bcrypt = Bcrypt()
session = Session()
login_manager = LoginManager()
