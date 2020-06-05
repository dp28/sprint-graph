import { render } from "./render";
import { renderGraph } from "./graph";
import { renderButton } from "./button";

const PopupId = "__sprintGraphRoot";

export async function togglePopup({ loadIssues, settings, doc = document }) {
  const popup = document.getElementById(PopupId);
  if (popup) {
    document.body.removeChild(popup);
  } else {
    const popup = renderPopup();
    const issues = await loadIssues();
    renderGraph({ root: popup, issues, settings });
    renderButtons({ root: popup, issues, settings });
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
      "z-index": 10000,
    },
  });
}

function renderButtons({ root, issues, settings }) {
  const commonButtonParams = {
    parent: root,
    state: settings,
    onClick: () => renderGraph({ issues, settings, root }),
  };

  renderButton({
    ...commonButtonParams,
    label: { on: "Hide 'Done' issues", off: "Show 'Done' issues" },
    attributeName: "includeDoneIssues",
  });

  renderButton({
    ...commonButtonParams,
    label: { on: "Hide subtasks", off: "Show subtasks" },
    attributeName: "includeSubtasks",
  });

  renderButton({
    ...commonButtonParams,
    label: { on: "Hide summary", off: "Show summary" },
    attributeName: "showSummary",
  });
}
