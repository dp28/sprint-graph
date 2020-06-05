import { render } from "./render";
import { renderCheckbox } from "./checkbox";
import { renderGraph } from "./graph";
import { Grey } from "./colours";

const SettingsId = "__sprintSettingsContainer";

export function renderSettings({ issues, settings, root }) {
  const settingsElement = renderSettingsContainer(root);
  const onChange = () => renderGraph({ issues, settings, root });
  renderCheckboxes({ settings, onChange, root: settingsElement });
}

function renderSettingsContainer(root) {
  const padding = "10px";
  return render({
    parent: root,
    id: SettingsId,
    styles: {
      width: "250px",
      height: `calc(100% - 2 * ${padding})`,
      padding,
      position: "relative",
      "border-right": `1px solid ${Grey.medium}`,
      "background-color": Grey.light,
    },
  });
}

function renderCheckboxes({ root, settings, onChange }) {
  const commonButtonParams = {
    parent: root,
    state: settings,
    onChange,
  };

  renderCheckbox({
    ...commonButtonParams,
    label: "Show issue summaries",
    attributeName: "showSummary",
  });

  renderCheckbox({
    ...commonButtonParams,
    label: "Show completed issues",
    attributeName: "includeDoneIssues",
  });

  renderCheckbox({
    ...commonButtonParams,
    label: "Include subtasks",
    attributeName: "includeSubtasks",
  });
}
