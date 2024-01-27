export function section_toggle(section) {
  const container = document.querySelector(`#${section}-container`);
  const arrow = document.querySelector(`#${section}-arrow`);

  if (!container.classList.contains("show")) {
    arrow.textContent = "▿";
    container.classList.remove("hide");
    container.classList.add("show");
  } else {
    arrow.textContent = "▹";
    container.classList.remove("show");
    container.classList.add("hide");
  }
}

export function section_open(section) {
  document.querySelector(`#${section}-arrow`).textContent = "▿";
  document.querySelector(`#${section}-container`).classList.remove("hide");
  document.querySelector(`#${section}-container`).classList.add("show");
}

export function section_close(section) {
  document.querySelector(`#${section}-arrow`).textContent = "▹";
  document.querySelector(`#${section}-container`).classList.remove("show");
  document.querySelector(`#${section}-container`).classList.add("hide");
}
