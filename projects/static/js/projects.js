import {
  fetch_project,
  fetch_project_list,
  update_project_param,
} from "./data_callbacks.js";
import { html_decode, change_image } from "./helper_funcs.js";
import {
  section_open,
  section_close,
  section_toggle,
} from "./section_transitions.js";
import { check_user } from "/static/js/session.js";

document.addEventListener("DOMContentLoaded", async function() {
  // Load the project popup template
  const popup_container = document.getElementById(`project-container-body`);
  const popup_template = popup_container.innerHTML.trim();
  popup_container.innerHTML = "";

  // Bind the close project page
  const close_project_links = document.querySelectorAll(`.close-project-link`);
  close_project_links.forEach((link) => {
    link.addEventListener("click", () => {
      close_project_popup();
    });
  });

  // Get all the projects
  const project_list = await fetch_project_list();

  // Bind the open project popup to each project image
  const img_elements = document.querySelectorAll(`.img-click`);
  img_elements.forEach((element) => {
    const id = element.id.split("-")[2];
    element.addEventListener("click", () => {
      open_project_popup(id, popup_template, project_list);
    });
  });

  //Check to see if admin privileges are present
  await check_user().then((admin) => {
    if (admin.logged_in) {
      // IF so, then bind the delete popups for closing and opening
      const close_delete_popup =
        document.querySelectorAll(`.close-delete-popup`);
      close_delete_popup.forEach((popup) => {
        popup.addEventListener("click", () => {
          change_delete_popup_visibility(false);
        });
      });

      const open_delete_popup = document.querySelectorAll(`.delete-button`);
      open_delete_popup.forEach(async (button) => {
        button.addEventListener("click", () => {
          const id_split = button.id.split("-");
          const deleted_project_id = Number(id_split[id_split.length - 1]);

          fetch_project(deleted_project_id).then((project) => {
            document.querySelector("#confirmation-project-label").innerText =
              html_decode(project.title);

            const change_visi_button = document.querySelector(
              "#change-visi-confirm-button",
            );
            change_visi_button.innerText = project.show ? "Hide" : "Show";
            change_visi_button.addEventListener("click", () => {
              change_project_visibility(deleted_project_id, !project.show);
            });
          });

          change_delete_popup_visibility(true);
        });
      });
    }
  });

  // Attach keydown listeners
  document.addEventListener("keydown", (e) => {
    //Catch escape key
    if (e.keyCode === 27) close_project_popup();

    //Catch spacebar
    if (e.keyCode === 32) {
      e.preventDefault();
      if (
        document
          .querySelector(`#image - container`)
          .classList.contains(`show`) ||
        document.querySelector(`#file - container`).classList.contains(`show`)
      ) {
        section_close("file");
        section_close("image");
      } else {
        section_open("file");
        section_open("image");
      }
    }
  });
});

async function open_project_popup(id, template, project_list) {
  //Check to see if admin privileges are present
  const user = await check_user();
  const admin = user.logged_in;

  fetch_project(id).then((project) => {
    // Create a DOM parser of the templated code
    const parser = new DOMParser();
    const popup = parser.parseFromString(template, "text/html").body;

    //Pre-process some data early
    const year = project.date.substring(0, 4);
    const prog_languages =
      project.planguage == "" ? "None specified" : project.planguage;
    const description = html_decode(project.description);

    //Youtube link should either be the preview image or the youtube link
    popup.querySelector(".yt-div").classList.remove("show");
    if (project.ylink == "") {
      // Show the preview image and set its source to a holding image
      popup.querySelector("#project-container-ytimg").classList.add("show");
      popup
        .querySelector("#youtube-image")
        .setAttribute(
          "src",
          `uploads / project / ${project.id} / ${headerpic.jpg}`,
        );
    } else {
      // Show the youtube video iframe and set its source to the youtube link
      popup.querySelector("#project-container-ytframe").classList.add("show");
      popup
        .querySelector("#youtube-iframe")
        .setAttribute("src", `https://www.youtube.com/embed/${project.ylink}`);
    }

    //Populate the file div with a list and its entries if they exist
    const fcontainer = popup.querySelector("#file-container");
    if (project.files.length === 0) {
      // If no files were uploaded, display a message
      fcontainer.innerText = "No files were uploaded for this project";
      fcontainer.style.fontStyle = "italic";
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
      fcontainer.appendChild(file_list);
    }

    // Populate the image div now with its entries, if they exist of course
    const icontainer = popup.querySelector("#image-container");
    const image_bar = popup.querySelector("#image-preview-bar");
    const image_holder = popup.querySelector("#image-holder");
    const image_desc = popup.querySelector("#image-desc");

    if (project.imgfilesuploaded === 0) {
      // Get rid of contents as there are no images found
      icontainer.innerHTML = "";

      const image_error = document.createElement("div");
      image_error.classList.add("image-error");
      image_error.innerText = "No images were uploaded for this project";

      icontainer.appendChild(image_error);
    } else {
      // Note for self for later, the following is a range based loop
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
        image_bar.appendChild(image_preview_div);
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
    popup.innerHTML = popup.innerHTML
      .replace("%title%", project.title)
      .replace("%year%", year)
      .replace("%date%", project.date)
      .replace("%creator%", project.creator)
      .replace("%planguage%", prog_languages)
      .replace("%description%", description);

    //Place code into the popup div now
    document.getElementById("project-container-body").innerHTML =
      popup.outerHTML;

    //Bind any event listeners
    //Attach file down functionality to the file down button
    const file_down_btn = document.querySelector("#file-down-button");
    file_down_btn.addEventListener("click", () => {
      section_toggle("file");
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
          change_image(preview_id, project.id, project.imgdesc[preview_id - 1]);
        });
      });

      // Assign callbacks to the image arrows
      const image_left = document.querySelector("#image-left");
      const image_right = document.querySelector("#image-right");

      // Find the current image in the image holder
      image_left.addEventListener("click", () => {
        const current_image = Number(image_holder.className.split("-")[1]);
        const new_image =
          current_image === 1 ? project.imgfilesuploaded : current_image - 1;
        change_image(new_image, project.id, project.imgdesc[new_image - 1]);
      });

      image_right.addEventListener("click", () => {
        const current_image = Number(image_holder.className.split("-")[1]);
        const new_image =
          current_image === project.imgfilesuploaded ? 1 : current_image + 1;
        change_image(new_image, project.id, project.imgdesc[new_image - 1]);
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
    const pcontainer = document.querySelectorAll(".popup_show_handle");
    pcontainer.forEach((container) => {
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

function change_delete_popup_visibility(can_show) {
  const popup_containers = document.querySelectorAll(".delete-popup");
  popup_containers.forEach((container) => {
    container.style.display = can_show ? "flex" : "none";
  });
}

function delete_project() { }

function change_project_visibility(id, show) {
  update_project_param(id, "show", show)
    .then((response) => {
      if (response.success) {
        const div_click = document.querySelector(`#img-click-${id}`);
        const image_click = document.querySelector(`#display-pic-${id}`);
        const delete_text = document.querySelector(`#delete-button-${id}`);

        if (show) {
          div_click.classList.remove("div-hidden");
          image_click.classList.remove("img-hidden");
          delete_text.innerText = "Delete";
        } else {
          div_click.classList.add("div-hidden");
          image_click.classList.add("img-hidden");
          delete_text.innerText = "Unhide";
        }

        change_delete_popup_visibility(false);
      } else {
        console.log("ERROR: Could not hide project");
      }
    })
    .catch((error) => {
      console.log(`ERROR: ${error}`);
    });
}
