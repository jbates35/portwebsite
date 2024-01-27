//decode html special chars
export function html_decode(input) {
  let doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

export function change_image(n, id, desc) {
  const image_holder = document.querySelector("#image-holder");
  const image_desc = document.querySelector("#image-desc");

  image_holder.setAttribute(
    "src",
    `../uploads/project/${id}/img/large/${n}.jpg`,
  );
  image_holder.className = `image-${n}`;
  image_desc.innerText = desc;
}
