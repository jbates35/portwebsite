document.addEventListener("DOMContentLoaded", () => {
  // Source for image preview logic: https://dev.to/michaelburrows/preview-selected-image-in-a-input-type-file-using-javascript-k5j

  // Main task here is to take any image uploaded and preview it in the box
  // we also need to assign a callback to the 'delete' button
  const disp_image_form = document.querySelector(`#img-file-id`);
  const disp_image_preview = document.querySelector(`#preview-img`);
  const disp_image_clear = document.querySelector(`#empty-disp-img`);

  disp_image_form.addEventListener("change", () => {
    set_image(disp_image_form.files[0], disp_image_preview);
  });

  disp_image_clear.addEventListener("click", () => {
    clear_image(disp_image_form, disp_image_preview);
  });

  const image_div_boxes = document.querySelectorAll(`.child-box-1`);
  image_div_boxes.forEach((image_div_box) => {
    const image_form = image_div_box.querySelector(`.file-c`);
    const image_preview = image_div_box.querySelector(`.preview-f-img`);
    const image_clear = image_div_box.querySelector(`.emptyForm`);

    image_form.addEventListener("change", () => {
      set_image(image_form.files[0], image_preview);
    });

    image_clear.addEventListener("click", () => {
      clear_image(image_form, image_preview);
    });
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

function clear_image(image_form, image_box) {
  image_form.value = ``;
  image_box.src = `/upload_project/static/img/transspec.png`;
}
