import { render } from "./render";
import { renderGraph } from "./graph";
import { renderSettings } from "./settings";
import { showMessage } from "./flashMessage";

const PopupId = "__sprintGraphRoot";

export async function togglePopup({ loadIssues, settings, doc = document }) {
  const popup = document.getElementById(PopupId);
  if (popup) {
    document.body.removeChild(popup);
  } else {
    const popup = renderPopup();
    showMessage("Loading data ...", popup);
    const issues = await loadIssues();
    renderSettings({ root: popup, issues, settings });
    renderGraph({ root: popup, issues, settings });
  }
}

function renderPopup() {
  return render({
    parent: document.body,
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
