//decode html special chars
export function html_decode(input) {
  let doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}
