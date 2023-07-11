import { render } from "./render.js";

export function renderButton({
  parent,
  label: { on, off },
  state,
  attributeName,
  onClick,
}) {
  const button = render({
    parent,
    innerText: state[attributeName] ? on : off,
    elementType: "button",
  });

  button.addEventListener("click", async () => {
    state[attributeName] = !state[attributeName];

    button.disabled = "disabled";
    await onClick(state[attributeName]);

    button.innerText = state[attributeName] ? on : off;
    button.disabled = null;
  });

  return button;
}
