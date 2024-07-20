document.addEventListener("DOMContentLoaded", () => {
  // Source for image preview logic: https://dev.to/michaelburrows/preview-selected-image-in-a-input-type-file-using-javascript-k5j

  // Main task here is to take any image uploaded and preview it in the box
  // we also need to assign a callback to the 'delete' button
  const disp_image_form = document.querySelector(`#img-file-id`);
  const disp_image_preview = document.querySelector(`#preview-img`);
  const disp_image_clear = document.querySelector(`#undo-disp-img`);
  const default_image = disp_image_preview.src;

  disp_image_form.addEventListener("change", () => {
    set_image(disp_image_form.files[0], disp_image_preview);
  });

  disp_image_clear.addEventListener("click", (e) => {
    e.preventDefault();
    clear_image(disp_image_form, disp_image_preview, default_image);
  });

  const image_div_boxes = document.querySelectorAll(`.child-box-1`);
  image_div_boxes.forEach((box) => {
    const default_file_str = box.querySelector(".img-desc").value;
    const image_upload = box.querySelector(`.file-c`);
    const preview_image = box.querySelector(`.preview-f-img`);
    const undo_image = box.querySelector(`.undo-btn`);
    const delete_image = box.querySelector(`.delete-btn`);
    const default_image = preview_image.src;
    const delete_flag = box.querySelector(".image-delete-box");
    const current_image_text = box.querySelector(".currently-uploaded-text");

    image_upload.addEventListener("change", () => {
      preview_image.style.opacity = 1;
      set_image(image_upload.files[0], preview_image);
    });

    undo_image.addEventListener("click", (e) => {
      e.preventDefault();

      box.querySelector(".img-desc").value = default_file_str;
      clear_image(image_upload, preview_image, default_image);

      if (delete_flag.checked) preview_image.style.opacity = 0.3;
    });

    if (delete_image) {
      delete_image.addEventListener("click", (e) => {
        e.preventDefault();
        delete_flag.checked = !delete_flag.checked;
        if (delete_flag.checked) {
          current_image_text.classList.add("currently-deleted");
          preview_image.style.opacity = 0.3;
        } else {
          current_image_text.classList.remove("currently-deleted");
          preview_image.style.opacity = 1;
        }
      });
    }
  });

  const file_boxes = document.querySelectorAll(".file-child");
  file_boxes.forEach((box) => {
    const default_file_str = box.querySelector(".file-desc").value;
    const delete_btn = box.querySelector(".delete-btn");
    const undo_btn = box.querySelector(".undo-btn");

    undo_btn.addEventListener("click", (e) => {
      e.preventDefault();

      const desc = box.querySelector(".file-desc");
      const file_upload = box.querySelector(".file-upload");

      desc.value = default_file_str;
      file_upload.value = "";
    });

    if (delete_btn) {
      delete_btn.addEventListener("click", (e) => {
        e.preventDefault();

        const current_file_str = box.querySelector(".currently-uploaded-text");
        const delete_flag = box.querySelector(".file-delete-box");

        delete_flag.checked = !delete_flag.checked;

        if (delete_flag.checked) {
          current_file_str.classList.add("currently-deleted");
        } else {
          current_file_str.classList.remove("currently-deleted");
        }
      });
    }
  });
});

function set_image(image_file, image_box) {
  try {
    const file_reader = new FileReader();
    file_reader.readAsDataURL(image_file);
    file_reader.addEventListener("load", () => {
      image_box.src = file_reader.result;
    });
  } catch (e) {
    console.error(e);
  }
}

function clear_image(image_form, image_box, default_image) {
  image_form.value = ``;
  image_box.src = default_image;
}
