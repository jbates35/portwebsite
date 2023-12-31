from flask import Flask, url_for, redirect
from projects.projects import projects_bp

app = Flask(__name__)


app.register_blueprint(projects_bp, url_prefix="/projects")


@app.route("/")
def index():
    return redirect(url_for("projects.projects"))


if __name__ == "__main__":
    app.run(debug=True)
