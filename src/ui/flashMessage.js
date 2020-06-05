import { render } from "./render";

const FlashMessageElementId = "__flashMessage";

export function showMessage(message, root) {
  hideMessage(root);
  render({
    parent: root,
    id: FlashMessageElementId,
    innerText: message,
  });
}

export function hideMessage(root) {
  const messageElement = findFlashMessageElement(root);
  if (messageElement) {
    root.removeChild(messageElement);
  }
}

function findFlashMessageElement(root) {
  return root.querySelector(`#${FlashMessageElementId}`);
}
