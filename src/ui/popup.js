import { render } from "./render";
import { renderGraph } from "./graph";
import { renderSettings } from "./settings";
import { showMessage, showErrorMessage } from "./flashMessage";

const PopupId = "__sprintGraphRoot";

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
      width: "calc(100% - 20px)",
      height: "calc(100% - 20px)",
      border: "1px solid lightgray",
      position: "absolute",
      top: "10px",
      left: "10px",
      background: "white",
      display: "flex",
      "z-index": 10000,
    },
  });
}
