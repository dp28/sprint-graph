import { render } from "./render";
import { renderButton } from "./button";
import { renderGraph } from "./graph";

const SettingsId = "__sprintSettingsContainer";

export function renderSettings({ issues, settings, root }) {
  const settingsElement = renderSettingsContainer(root);
  const onClick = () => renderGraph({ issues, settings, root });
  renderButtons({ settings, onClick, root: settingsElement });
}

function renderSettingsContainer(root) {
  return render({
    parent: root,
    id: SettingsId,
    styles: {
      width: "100px",
      height: "100%",
      position: "relative",
      "background-color": "lightgray",
    },
  });
}

function renderButtons({ root, settings, onClick }) {
  const commonButtonParams = {
    parent: root,
    state: settings,
    onClick,
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
