export function prependButton({
  rootElement,
  label: { on, off },
  state,
  attributeName,
  onClick,
}) {
  const button = document.createElement("button");
  button.innerText = state[attributeName] ? on : off;

  button.addEventListener("click", async () => {
    state[attributeName] = !state[attributeName];

    button.disabled = "disabled";
    await onClick(state[attributeName]);

    button.innerText = state[attributeName] ? on : off;
    button.disabled = null;
  });

  rootElement.prepend(button);
}
