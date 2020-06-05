export function render({
  parent,
  styles = null,
  id = null,
  innerText = null,
  elementType = "div",
  doc = document,
}) {
  const element = doc.createElement(elementType);

  if (styles) {
    applyStyles(styles, element);
  }

  if (id) {
    element.id = id;
  }

  if (innerText) {
    element.innerText = innerText;
  }

  parent.appendChild(element);
  return element;
}

function applyStyles(styles, element) {
  const styleString = Object.entries(styles)
    .map(([name, value]) => `${name}: ${value}`)
    .join("; ");
  element.style = styleString;
}
