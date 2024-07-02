//decode html special chars
export function html_decode(input) {
  const doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

export function change_image(n, id, project_image) {
  const image_holder = document.querySelector("#image-holder");
  const image_desc = document.querySelector("#image-desc");

  image_holder.setAttribute(
    "src",
    `../uploads/project/${id}/img/large/${project_image.file}`,
  );
  image_holder.className = `image-${n}`;
  image_desc.innerText = project_image.description;
}
