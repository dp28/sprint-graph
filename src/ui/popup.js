import { render, removeChild } from "./render";
import { renderGraph } from "./graph";
import { renderSettings } from "./settings";
import { showMessage, showErrorMessage } from "./flashMessage";
import { Grey } from "./colours";

const PopupId = "__sprintGraphRoot";
const PopupMargin = "10px";
const PopupZIndex = 10000;

export async function togglePopup({ loadIssues, settings, doc = document }) {
  const popup = document.getElementById(PopupId);
  if (popup) {
    document.body.removeChild(popup);
  } else {
    await renderPopup({ loadIssues, settings, doc });
  }
}

async function renderPopup({ loadIssues, settings, doc }) {
  const popup = renderPopupRoot(doc);
  renderCloseButton(popup);
  showMessage("Loading data ...", popup);

  try {
    const issues = await loadIssues();
    renderSettings({ root: popup, issues, settings });
    renderGraph({ root: popup, issues, settings });
  } catch (error) {
    console.error(error);
    showErrorMessage("Failed to load any issues", popup);
  }
}

function renderPopupRoot(doc) {
  return render({
    parent: doc.body,
    id: PopupId,
    styles: {
      width: `calc(100% - 2 * ${PopupMargin})`,
      height: `calc(100% - 2 * ${PopupMargin})`,
      border: `1px solid ${Grey.medium}`,
      position: "absolute",
      top: PopupMargin,
      left: PopupMargin,
      background: "white",
      display: "flex",
      "z-index": PopupZIndex,
      "box-shadow": `3px 3px 3px ${Grey.dark}`,
    },
  });
}

function renderCloseButton(popup) {
  const button = render({
    parent: popup,
    elementType: "button",
    innerText: "x",
    styles: {
      position: "absolute",
      top: "4px",
      right: "4px",
      width: "25px",
      height: "25px",
      cursor: "pointer",
      "z-index": PopupZIndex + 1,
      "border-radius": "20px",
      border: "none",
      "box-shadow": `3px 3px 3px ${Grey.dark}`,
    },
  });

  button.addEventListener("click", () => {
    removeChild(PopupId, document.body);
  });
}
