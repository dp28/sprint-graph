import { render } from "./render";
import { Grey } from "./colours";

const FlashMessageElementId = "__flashMessage";

export function showMessage(message, root) {
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
      background: Grey.light,
      border: `1px solid ${Grey.medium}`,
      "text-align": "center",
      "border-radius": "10px",
      "box-shadow": `3px 3px 3px ${Grey.medium}`,
    },
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
