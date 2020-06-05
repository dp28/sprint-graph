import { render } from "./render";
import { Grey, Red } from "./colours";

const FlashMessageElementId = "__flashMessage";

export function showMessage(message, root, colour = Grey) {
  hideMessage(root);
  render({
    parent: root,
    id: FlashMessageElementId,
    innerText: message,
    styles: {
      position: "absolute",
      top: "10px",
      left: "25%",
      width: "50%",
      padding: "10px",
      background: colour.light,
      border: `1px solid ${colour.medium}`,
      "text-align": "center",
      "border-radius": "10px",
      "box-shadow": `3px 3px 3px ${Grey.dark}`,
    },
  });
}

export function showErrorMessage(message, root) {
  showMessage(message, root, Red);
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
