var m = 0;
var fileDownB = false;
var imageDownB = false;
var descArray = [];

function listVideo(this_id) {
  $.getJSON("vid_json_admin.php", function (json) {
    if (json != "Nothing found.") {
      var vidCount = json.length;
      for (var i = 0; i <= vidCount; i++) {
        if (json[i].id == this_id) {
          writeVideo(
            json[i].id,
            json[i].title,
            json[i].ylink,
            json[i].description,
            json[i].subject,
            json[i].course,
            json[i].chapter,
            json[i].question,
            json[i].show,
          );
        }
      }
    }
  });
}

function listProject(this_id) {
  $.getJSON("proj_json_admin.php", function (json) {
    if (json != "Nothing found.") {
      var projCount = json.length;
      for (var m = 0; m <= projCount; m++) {
        if (json[m].id == this_id) {
          writeProjectHTML();
          writeProject(
            json[m].date,
            json[m].description,
            json[m].title,
            json[m].ylink,
            json[m].creator,
            json[m].planguage,
            json[m].id,
            json[m].olink1,
            json[m].olink2,
            json[m].olink3,
            json[m].olinkdesc1,
            json[m].olinkdesc2,
            json[m].olinkdesc3,
            json[m].imgfilesuploaded,
            json[m].imgdesc_1,
            json[m].imgdesc_2,
            json[m].imgdesc_3,
            json[m].imgdesc_4,
            json[m].imgdesc_5,
            json[m].imgdesc_6,
            json[m].filecount,
            json[m].show,
          );
        }
      }
    }
  });
}

function writeProjectHTML() {
  $("#projContentContainer_id").html(`
	
	<div class="project-container-inner" id="project-container-inner_id">
	<div class="project-whole project-container-overlay" id="project-container-overlay_id">
		<div class="project-container-title" id="projContTitle_id"></div>
		<div class="project-container-ylink" id="projContYou_id"></div>
		<div class="project-container-imggal">
			<a href="#" id="filesLinkDown_id" title="Click to expand files" onclick="fileDown()"><h3 id="filesarrow">Files &#9654;</h3></a>
			<div id="fileContainer_id" class="file-container"></div>
			<hr class="linebreak">
			<a href="#" title="Click to expand images" id="imgLinkDown" onclick="imageDown()"><h3 id="imagesarrow">Images &#9654;</h3></a>
			<div class="imgPanel">
				<div id="imgError"></div>
				<div id="image-container-id" class="image-container">
					<div class="image-preview-bar">
						<div class="image-preview-div" onclick="changeImage(1)" id="img-prev-div_1"><img src="" class="image-preview-img" id="img-prev-src_1"></div>
						<div class="image-preview-div" onclick="changeImage(2)" id="img-prev-div_2"><img src="" class="image-preview-img" id="img-prev-src_2"></div>
						<div class="image-preview-div" onclick="changeImage(3)" id="img-prev-div_3"><img src="" class="image-preview-img" id="img-prev-src_3"></div>
						<div class="image-preview-div" onclick="changeImage(4)" id="img-prev-div_4"><img src="" class="image-preview-img" id="img-prev-src_4"></div>
						<div class="image-preview-div" onclick="changeImage(5)" id="img-prev-div_5"><img src="" class="image-preview-img" id="img-prev-src_5"></div>
						<div class="image-preview-div" onclick="changeImage(6)" id="img-prev-div_6"><img src="" class="image-preview-img" id="img-prev-src_6"></div>
					</div>
					<div class="image-holder-div" id="image-holder-div-id">
						<img class="image-holder-img" id="image-holder-img-id" src="">
					</div>
					<div class="image-left" onclick="prevImage()">&#8678;</div>
					<div class="image-right" onclick="nextImage()">&#8680;</div>
					<div class="img-desc" id="img-desc_id"></div>
				</div>
			</div>
		</div>
		<div class="project-container-content" id="prj-cont-desc_id"></div>
	</div>	
</div>
	
	`);
}

function writeVideo(
  id,
  title,
  ylink,
  description,
  subjectid,
  course,
  chapter,
  question,
  show,
) {
  var subject;
  switch (subjectid) {
    case 1:
      subject = "Physics";
      break;
    case 2:
      subject = "Math/Calculus";
      break;
    case 3:
      subject = "Circuit Analysis";
      break;
    case 4:
      subject = "Digital Techniques";
      break;
  }

  $("#vidContentContainer_id").html(``);

  $("#vidContentContainer_id").append(
    `
			<div class="vidTitleDiv" id="vidTitleDiv_id` +
      id +
      `">
				<h3>(` +
      subject +
      `) ` +
      title +
      `</h3>
			</div>
			<div class="vidYoutubeDiv" id="vidYoutubeDiv_id` +
      id +
      `">
				<iframe id="ytframe_id" class="vidYtframe" src="https://www.youtube.com/embed/` +
      ylink +
      `" allowfullscreen>
				</iframe>
			</div>
			<div class="vidCourseDiv" id="vidCourseDiv_id` +
      id +
      `">
				<b>Course:</b> ` +
      course +
      `<br>
				<b>Chapter:</b> ` +
      chapter +
      `<br>
				<b>Question:</b> ` +
      question +
      `<br>
			</div>
			<div class="vidDescriptionDiv" id="vidDescriptionDiv_id` +
      id +
      `">
			` +
      htmlSCReplace(description) +
      `
			</div>
	`,
  );

  if (show == false) {
    $("#vidContentContainer_id").addClass("showFalse");
    $("#vidTitleDiv_id" + id).addClass("titleFalse");
    $("#vidTitleDiv_id" + id).append(`(Hidden)`);
  }
}

function submitClick(e, title) {
  if (!confirm('Are you sure you want to delete "' + title + "?")) {
    e.preventDefault();
  }
}

function writeProject(
  date,
  description,
  title,
  ylink,
  creator,
  planguage,
  id,
  olink1,
  olink2,
  olink3,
  olinkdesc1,
  olinkdesc2,
  olinkdesc3,
  imgfilesuploaded,
  imgdesc_1,
  imgdesc_2,
  imgdesc_3,
  imgdesc_4,
  imgdesc_5,
  imgdesc_6,
  filecount,
  show,
) {
  if (fileDownB == true) {
    fileDown();
    fdelay = 300;
  } else {
    fdelay = 0;
  }

  if (imageDownB == true) {
    imageDown();
    idelay = 400;
  } else {
    idelay = 0;
  }

  setTimeout(
    function () {
      window.currentId = id;
    },
    Math.max(idelay, fdelay),
  );

  //Script to decide if a youtube video is needed or a title picture is needed (ytString)
  var ytString = "";
  if (ylink == "") {
    ytString =
      '<img src="uploads/project/' + id + '/headerpic.jpg" class="ytImage">';
  } else {
    ytString =
      '<iframe id="ytframe_id" class="ytframe" src="https://www.youtube.com/embed/' +
      ylink +
      '" allowfullscreen></iframe>';
  }

  //Content box description string (dString)
  var dString = ``;
  dString += `<label>Date created:</label> ` + date + `<br>`;
  dString += `<label>Creator:</label> ` + creator + ` <br>`;
  dString +=
    `<label>Programming languages used:</label> ` + planguage + ` <br><br>`;
  dString += htmlSCReplace(description);

  //Filebox code string (fString)
  var fString = "";
  if (filecount == 0) {
    fString += "<i>No files were uploaded for this project</i>";
  } else {
    fString = "<ul class='nodots'>";
    if (olink1)
      fString +=
        '<li><a href="uploads/project/' +
        window.currentId +
        "/" +
        olink1 +
        '">' +
        olinkdesc1 +
        "</a></li>";
    if (olink2)
      fString +=
        '<li><a href="uploads/project/' +
        window.currentId +
        "/" +
        olink2 +
        '">' +
        olinkdesc2 +
        "</a></li>";
    if (olink3)
      fString +=
        '<li><a href="uploads/project/' +
        window.currentId +
        "/" +
        olink3 +
        '">' +
        olinkdesc3 +
        "</a></li>";
    fString += "</ul>";
  }

  //actual function:
  $("#projContTitle_id").html(title + ` (` + date.substring(0, 4) + `)`); //Title
  $("#projContYou_id").html(ytString); //Youtube link or picture

  setTimeout(function () {
    $("#fileContainer_id").html(fString);
  }, fdelay); //Filebox string

  //Image gallery
  setTimeout(function () {
    window.imageCount = imgfilesuploaded;
    if (window.imageCount > 0) changeImage(1);

    //see if there are images uploaded in the first place
    if (imgfilesuploaded == 0) {
      $("#imgError").html(`
				<span style="margin-left:12px;"><i>No images were uploaded for this project</i></span>
			`);
      if ($("#image-container-id").hasClass("shownone") == false)
        $("#image-container-id").addClass("shownone");
    } else {
      $("#imgError").html(``);
      if ($("#image-container-id").hasClass("shownone") == true)
        $("#image-container-id").removeClass("shownone");
      $("#image-holder-img-id").attr(
        "src",
        "uploads/project/" + window.currentId + "/img/large/1.jpg",
      );
    }

    //set preview image srcs and displays
    var o;
    for (o = 1; o <= 6; o++) {
      $("#img-prev-div_" + o).removeClass("showblock");
      if (o <= imgfilesuploaded) {
        $("#img-prev-src_" + o).attr(
          "src",
          "uploads/project/" + id + "/img/small/" + o + ".jpg",
        );
        $("#img-prev-div_" + o).addClass("showblock");
      }
    }

    //set image desc array
    descArray = [
      imgdesc_1,
      imgdesc_2,
      imgdesc_3,
      imgdesc_4,
      imgdesc_5,
      imgdesc_6,
    ];
  }, idelay);

  $("#prj-cont-desc_id").html(dString);
} // end changeProject

function fileDown() {
  if (fileDownB == false) {
    document.getElementById("filesarrow").textContent = "Files ▼";
    $(".file-container").slideDown(400);
    fileDownB = true;
  } else {
    document.getElementById("filesarrow").textContent = "Files ▶";
    $(".file-container").slideUp(300);
    fileDownB = false;
  }
}

function imageDown() {
  if (imageDownB == false) {
    document.getElementById("imagesarrow").textContent = "Images ▼";
    $(".imgPanel").slideDown(700);
    imageDownB = true;
    changeImageDesc(window.imageSelect);
  } else {
    document.getElementById("imagesarrow").textContent = "Images ▶";
    $(".imgPanel").slideUp(400);
    imageDownB = false;
  }
}

function changeImage(n) {
  window.imageSelect = n;
  $("#image-holder-img-id").attr(
    "src",
    "uploads/project/" +
      window.currentId +
      "/img/large/" +
      window.imageSelect +
      ".jpg",
  );
  if (imageDownB == true) {
    changeImageDesc(n);
  }
}

function changeImageDesc(n) {
  descString = htmlSCReplace(descArray[n - 1]);
  if (descString) {
    $("#img-desc_id").html(descString);
    if ($("#img-desc_id").hasClass("shownone"))
      $("#img-desc_id").removeClass("shownone");
  } else {
    $("#img-desc_id").html(``);
    if (!$("#img-desc_id").hasClass("shownone"))
      $("#img-desc_id").addClass("shownone");
  }
}

function nextImage() {
  var i = window.imageSelect;
  if (i < window.imageCount) {
    i++;
  } else {
    i = 1;
  }
  changeImage(i);
}

function prevImage() {
  var i = window.imageSelect;
  if (i > 1) {
    i--;
  } else {
    i = window.imageCount;
  }
  changeImage(i);
}

//disable links functions:
$("#filesLinkDown_id").click(function (e) {
  e.preventDefault();
});
$("#imgLinkDown").click(function (e) {
  e.preventDefault();
});

//decode html special chars
function htmlSCReplace(text) {
  var map = {
    "&amp;": "&",
    "&#038;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#039;": "'",
    "&#8217;": "’",
    "&#8216;": "‘",
    "&#8211;": "–",
    "&#8212;": "—",
    "&#8230;": "…",
    "&#8221;": "”",
  };

  return text.replace(/\&[\w\d\#]{2,5}\;/g, function (m) {
    return map[m];
  });
}

