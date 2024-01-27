from flask import Blueprint, render_template, current_app
import os
import time
from datetime import datetime

resume_bp = Blueprint(
    "resume", __name__, template_folder="templates", static_folder="static"
)


@resume_bp.route("/")
def resume():
    file_path = str(resume_bp.static_folder) + "/pdf/"
    files = os.listdir(file_path)
    file = None
    date_created = None

    # Gather all files in the pdf folder, sort by creation time, and get the most recent one
    if files is not None:
        create_times = [
            (file, os.path.getctime(file_path + "/" + file))
            for file in files
            if file.endswith(".pdf")
        ]
        files = sorted(create_times, key=lambda x: x[1], reverse=True)
        file, ctime_epoch = files[0]

        # Get string version of time so we can display in html
        ctime_datetime = datetime.fromtimestamp(ctime_epoch)
        date_created = ctime_datetime.strftime("%Y-%m-%d")

    return render_template("resume.html", pdf_file=file, pdf_date_created=date_created)
