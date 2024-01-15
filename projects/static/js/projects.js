import { fetch_project } from "./data_callbacks.js";

var m = 0;
var fileDownB = false;
var imageDownB = false;
var descArray = [];
var projectOpen = false;

document.addEventListener("DOMContentLoaded", function () {
  // Load the project popup template
  const popup_template = document
    .getElementById("project-popup-template")
    .innerHTML.trim();

  // Clear the popup project container
  const project_container = document.getElementById(
    "project-container-overlay",
  );
  project_container.innerHTML = "";

  // Bind the close project page
  const close_project_links = document.querySelectorAll(".close-project-link");
  close_project_links.forEach((link) => {
    link.addEventListener("click", () => {
      close_project_popup();
    });
  });

  // Bind the open project popup to each project image
  const img_elements = document.querySelectorAll(".img-click");
  img_elements.forEach((element) => {
    let id = element.id.split("-")[2];
    element.addEventListener("click", () => {
      open_project_popup(id, popup_template);
    });
  });
});

function open_project_popup(id, template) {
  fetch_project(id).then((project) => {
    // Open the popup, i.e. add show class to the overlay
    const project_containers = document.querySelectorAll(".popup_show_handle");
    project_containers.forEach((container) => {
      container.classList.add("show");
      container.classList.remove("hide");
    });

    //Make a copy of template so it can be reserved for function arguments later
    const template_copy = template;

    //Process some data early
    const year = project.date.substring(0, 4);

    //Youtube link should either be the preview image or the youtube link
    const yt_image_cont = document.querySelector("#project-container-yimg");
    const yt_frame_cont = document.querySelector("#project-container-ylink");
    if (project.ylink == "") {
      yt_image_cont.classList.add("show");
      yt_frame_cont.classList.remove("show");
    } else {
      yt_image_cont.classList.remove("show");
      yt_frame_cont.classList.add("show");
    }

    //Replace the template with the project data
    template = template
      .replace("%title%", project.title)
      .replace("%year%", year)
      .replace("%ylink", youtube_string)
      .replace("%yimg", project.id);

    //Place code into the popup div now
    document.getElementById(
      "project-container-overlay",
    ).popup_container.innerHTML = template;
  });
}

function close_project_popup() {
  // Close the popup, i.e. remove show class from the overlay
  const project_containers = document.querySelectorAll(".popup_show_handle");
  project_containers.forEach((container) => {
    container.classList.remove("show");
    container.classList.add("hide");
  });
}

function changeProject(n) {
  m = n;
  $.getJSON(jsonFile, function (json) {
    projectDisplay(
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
    );
  });
}

//function to display the popup window
function projectDisplay(
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

  //script to see if planguage is empty
  var planguageNew = "";
  if (planguage == "") {
    planguageNew = `<br>`;
  } else {
    planguageNew =
      `<label>Programming languages used:</label> ` + planguage + ` <br><br>`;
  }

  //Content box description string (dString)
  var dString = ``;
  dString += `<label>Date created:</label> ` + date + `<br>`;
  dString += `<label>Creator:</label> ` + creator + ` <br>`;
  dString += planguageNew;
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
        id +
        "/" +
        olink1 +
        '">' +
        olinkdesc1 +
        "</a></li>";
    if (olink2)
      fString +=
        '<li><a href="uploads/project/' +
        id +
        "/" +
        olink2 +
        '">' +
        olinkdesc2 +
        "</a></li>";
    if (olink3)
      fString +=
        '<li><a href="uploads/project/' +
        id +
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

    console.log(window.currentId);

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
} // end of changeProject

function nextProject() {
  var maxC = window.proj_count - 1;
  if (m < maxC) {
    m++;
  } else {
    m = 0;
  }
  changeProject(m);
}

function prevProject() {
  var minC = window.proj_count - 1;
  if (m > 0) {
    m--;
  } else {
    m = minC;
  }
  changeProject(m);
}

function popupProject() {
  if (projectOpen == false) {
    $("#project-container-inner_id").fadeIn(0);
    $("#project-container-outer_id").fadeIn(300);

    projectOpen = true;
  } else {
    $("#project-container-inner_id").fadeOut(0);
    $("#project-container-outer_id").fadeOut(0);

    //close image/file containers
    if (fileDownB == true) {
      fileDown();
    }
    if (imageDownB == true) {
      imageDown();
    }

    projectOpen = false;
  }
}

// listen for keycodes

$(document).keydown(function (e) {
  if (projectOpen == true) {
    switch (e.keyCode) {
      case 27: // esc
        popupProject();
        projectOpen = false;
        break;

      case 37: //left
        prevProject();
        break;

      case 39: //right
        nextProject();
        break;

      case 32: //spacebar:
        e.preventDefault();
        var truthTable = 10 * fileDownB + imageDownB;
        switch (truthTable) {
          case 11:
            imageDown();
            fileDown();
            break;
          case 10:
            imageDown();
            break;
          case 1:
            fileDown();
            break;
          case 0:
            imageDown();
            fileDown();
            break;
          default:
            break;
        }
    }
  }
});

// Script for opening up file area or image gallery

function fileDown() {
  if (fileDownB == false) {
    $("#filesarrow").html(`Files &#9660;`);
    $(".file-container").slideDown(400);
    fileDownB = true;
  } else {
    $("#filesarrow").html(`Files &#9656;`);
    $(".file-container").slideUp(300);
    fileDownB = false;
  }
}

function imageDown() {
  if (imageDownB == false) {
    $("#imagesarrow").html(`Images &#9660;`);
    $(".imgPanel").slideDown(700);
    imageDownB = true;
    changeImageDesc(window.imageSelect);
  } else {
    $("#imagesarrow").html(`Images &#9656;`);
    $(".imgPanel").slideUp(400);
    imageDownB = false;
  }
}

// Script for image gallery functionality

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
