import { fetch_project, fetch_project_list } from "./data_callbacks.js";
import { html_decode } from "./helper_funcs.js";

var m = 0;
var fileDownB = false;
var imageDownB = false;
var descArray = [];
var projectOpen = false;

document.addEventListener("DOMContentLoaded", async function () {
  // Load the project popup template
  const popup_container = document.getElementById("project-container-body");
  const popup_template = popup_container.innerHTML.trim();
  popup_container.innerHTML = "";

  // Bind the close project page
  const close_project_links = document.querySelectorAll(".close-project-link");
  close_project_links.forEach((link) => {
    link.addEventListener("click", () => {
      close_project_popup();
    });
  });

  // Get all the projects
  const project_list = await fetch_project_list();

  // Bind the open project popup to each project image
  const img_elements = document.querySelectorAll(".img-click");
  img_elements.forEach((element) => {
    let id = element.id.split("-")[2];
    element.addEventListener("click", () => {
      open_project_popup(id, popup_template, project_list);
    });
  });
});

function open_project_popup(id, template, project_list) {
  fetch_project(id).then((project) => {
    // Create a DOM parser of the templated code
    let parser = new DOMParser();
    let project_popup = parser.parseFromString(template, "text/html").body;

    //Pre-process some data early
    const year = project.date.substring(0, 4);
    const prog_languages =
      project.planguage == "" ? "None specified" : project.planguage;
    const description = html_decode(project.description);

    //Youtube link should either be the preview image or the youtube link
    project_popup.querySelector(".yt-div").classList.remove("show");
    if (project.ylink == "") {
      // Show the preview image and set its source to a holding image
      project_popup
        .querySelector("#project-container-ytimg")
        .classList.add("show");
      project_popup
        .querySelector("#youtube-image")
        .setAttribute("src", `uploads/project/${project.id}/${headerpic.jpg}`);
    } else {
      // Show the youtube video iframe and set its source to the youtube link
      project_popup
        .querySelector("#project-container-ytframe")
        .classList.add("show");
      project_popup
        .querySelector("#youtube-iframe")
        .setAttribute("src", `https://www.youtube.com/embed/${project.ylink}`);
    }

    //Populate the file div with a list and its entries if they exist
    const file_container = project_popup.querySelector("#file-container");
    if (project.files.length === 0) {
      // If no files were uploaded, display a message
      file_container.innerText = "No files were uploaded for this project";
      file_container.style.fontStyle = "italic";
    } else {
      // Create list which files will get added to
      const file_list = document.createElement("ul");
      file_list.classList.add("nodots");

      project.files.forEach((file) => {
        // If file description is blank, use the file name
        const file_desc =
          file.description === "" ? file.file : file.description;

        //Create the link for the file
        const file_link = document.createElement("a");
        file_link.setAttribute(
          "href",
          `../uploads/project/${project.id}/${file.file}`,
        );
        file_link.innerText = file_desc;

        //Create list element which contains the link
        const file_node = document.createElement("li");
        file_node.appendChild(file_link);
        file_list.appendChild(file_node);
      });
      file_container.appendChild(file_list);
    }

    // Populate the image div now with its entries, if they exist of course
    const image_container = project_popup.querySelector("#image-container");
    const image_preview_bar = project_popup.querySelector("#image-preview-bar");
    const image_holder = project_popup.querySelector("#image-holder");
    const image_desc = project_popup.querySelector("#image-desc");

    if (project.imgfilesuploaded === 0) {
      // Get rid of contents as there are no images found
      image_container.innerHTML = "";

      const image_error = document.createElement("div");
      image_error.classList.add("image-error");
      image_error.innerText = "No images were uploaded for this project";

      image_container.appendChild(image_error);
    } else {
      [...Array(project.imgfilesuploaded).keys()].forEach((i) => {
        // Create the image preview bar where people can select images
        const image_preview = document.createElement("img");
        image_preview.classList.add("image-preview-img");
        image_preview.setAttribute(
          "src",
          `../uploads/project/${project.id}/img/small/${i + 1}.jpg`,
        );

        const image_preview_div = document.createElement("div");
        image_preview_div.classList.add("image-preview-div");
        image_preview_div.id = `image-preview-div-${i + 1}`;

        image_preview_div.appendChild(image_preview);
        image_preview_bar.appendChild(image_preview_div);
      });

      // Last thing is to set the default image and description
      image_holder.setAttribute(
        "src",
        `../uploads/project/${project.id}/img/large/1.jpg`,
      );
      image_holder.classList.add("image-1");
      image_desc.innerText = project.imgdesc[0];
    }

    //Replace the rest of the template with the project data
    project_popup.innerHTML = project_popup.innerHTML
      .replace("%title%", project.title)
      .replace("%year%", year)
      .replace("%date%", project.date)
      .replace("%creator%", project.creator)
      .replace("%planguage%", prog_languages)
      .replace("%description%", description);

    //Place code into the popup div now
    document.getElementById("project-container-body").innerHTML =
      project_popup.outerHTML;

    //Bind any event listeners
    //Attach file down functionality to the file down button
    let file_down_btn = document.querySelector("#file-down-button");
    file_down_btn.addEventListener("click", () => {
      section_toggle("file", true);
    });

    //Attach image down functionality to the image down button
    const image_down_btn = document.querySelector("#image-down-button");
    image_down_btn.addEventListener("click", () => {
      section_toggle("image", true);
    });

    if (project.imgfilesuploaded > 0) {
      const image_holder = document.querySelector("#image-holder");

      //Assign callbacks to the image bar divs so it can change the main image
      const image_preview_divs =
        document.querySelectorAll(".image-preview-div");
      image_preview_divs.forEach((preview) => {
        const preview_id = Number(preview.id.split("-")[3]);
        preview.addEventListener("click", () => {
          change_image(preview_id, project);
        });
      });

      // Assign callbacks to the image arrows
      const image_left = document.querySelector("#image-left");
      const image_right = document.querySelector("#image-right");

      // Find the current image in the image holder
      image_left.addEventListener("click", () => {
        const current_image = Number(image_holder.className.split("-")[1]);
        const new_image =
          ((current_image - 1 + project.imgfilesuploaded) %
            project.imgfilesuploaded) +
          1;
        change_image(new_image, project);
      });

      image_right.addEventListener("click", () => {
        const current_image = Number(image_holder.className.split("-")[1]);
        const new_image = ((current_image + 1) % project.imgfilesuploaded) + 1;
        change_image(new_image, project);
      });
    }

    // Tell the next and prev projects to refresh the popup with a new project
    const project_len = project_list.length;
    const current_i = project_list.indexOf(project.id);
    const next = project_list[(current_i - 1 + project_len) % project_len];
    const prev = project_list[(current_i + 1) % project_len];

    const next_project_btn = document.querySelector("#project-container-next");
    next_project_btn.addEventListener("click", () => {
      open_project_popup(next, template, project_list);
    });

    const prev_project_btn = document.querySelector("#project-container-prev");
    prev_project_btn.addEventListener("click", () => {
      open_project_popup(prev, template, project_list);
    });

    // Open the popup, i.e. set the display to block
    const project_containers = document.querySelectorAll(".popup_show_handle");
    project_containers.forEach((container) => {
      container.classList.add("show");
      container.classList.remove("hide");
    });
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

function change_image(n, project) {
  const image_holder = document.querySelector("#image-holder");
  const image_desc = document.querySelector("#image-desc");

  image_holder.setAttribute(
    "src",
    `../uploads/project/${project.id}/img/large/${n}.jpg`,
  );
  image_holder.className = `image-${n}`;
  image_desc.innerText = project.imgdesc[n - 1];
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

function section_toggle(section, has_arrow) {
  let container = document.querySelector(`#${section}-container`);
  let arrow = null;
  if (has_arrow) {
    arrow = document.querySelector(`#${section}-arrow`);
  }

  if (!container.classList.contains("show")) {
    if (has_arrow) arrow.textContent = "▿";
    container.classList.remove("hide");
    container.classList.add("show");
  } else {
    if (has_arrow) arrow.textContent = "▹";
    container.classList.remove("show");
    container.classList.add("hide");
  }
  // if (fileDownB == false) {
  //   $("#filesarrow").html(`Files &#9660;`);
  //   $(".file-container").slideDown(400);
  //   fileDownB = true;
  // } else {
  //   $("#filesarrow").html(`Files &#9656;`);
  //   $(".file-container").slideUp(300);
  //   fileDownB = false;
  // }
}

function image_down() {
  let image_container = document.querySelector("#image-container");
  let image_arrow = document.querySelector("#image-arrow");
  if (image_container.classList.contains("hide")) {
    image_arrow.textContent = "▼";
    image_container.classList.remove("hide");
    image_container.classList.add("show");
  } else {
    image_arrow.textContent = "🢒";
    image_container.classList.remove("show");
    image_container.classList.add("hide");
  }
  // if (imageDownB == false) {
  //   $("#imagesarrow").html(`Images &#9660;`);
  //   $(".imgPanel").slideDown(700);
  //   imageDownB = true;
  //   changeImageDesc(window.imageSelect);
  // } else {
  //   $("#imagesarrow").html(`Images &#9656;`);
  //   $(".imgPanel").slideUp(400);
  //   imageDownB = false;
  // }
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

// //disable links functions:
// $("#filesLinkDown_id").click(function (e) {
//   e.preventDefault();
// });
// $("#imgLinkDown").click(function (e) {
//   e.preventDefault();
// });
//

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
