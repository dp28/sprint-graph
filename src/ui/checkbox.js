import { render } from "./render";

export function renderCheckbox({
  parent,
  label,
  state,
  attributeName,
  onChange,
}) {
  const labelElement = render({
    parent,
    innerText: label,
    elementType: "label",
  });

  const checkbox = render({
    parent: labelElement,
    elementType: "input",
    styles: { float: "left" },
  });

  checkbox.type = "checkbox";
  checkbox.checked = state[attributeName];

  checkbox.addEventListener("change", async () => {
    state[attributeName] = !state[attributeName];

    checkbox.disabled = "disabled";
    await onChange(state[attributeName]);
    checkbox.disabled = null;
  });

  return checkbox;
}
