from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_login import LoginManager
from flask_pagedown import PageDown

db = SQLAlchemy()
bcrypt = Bcrypt()
session = Session()
login_manager = LoginManager()
pagedown = PageDown()
