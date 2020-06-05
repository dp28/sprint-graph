import { render } from "./render";
import { renderCheckbox } from "./checkbox";
import { Grey } from "./colours";

const SettingsId = "__sprintSettingsContainer";

export function renderSettings({ graph, settings, issues, root, onChange }) {
  const visibleIssues = graph.nodes;
  const allRawIssues = Object.values(issues);

  const settingsElement = renderSettingsContainer(root);
  renderInfo({ visibleIssues, allRawIssues, parent: settingsElement });
  renderCheckboxes({
    issues,
    settings,
    root: settingsElement,
    onChange,
  });
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

function renderInfo({ visibleIssues, allRawIssues, parent }) {
  render({
    parent,
    elementType: "p",
    innerText: `Loaded ${allRawIssues.length} issues`,
    styles: {
      "margin-bottom": "0px",
    },
  });
  render({
    parent,
    elementType: "p",
    innerText: `(${
      allRawIssues.length - visibleIssues.length
    } hidden by filters)`,
    styles: {
      "margin-top": "0px",
      "margin-bottom": "20px",
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
    label: `Show completed issues`,
    attributeName: "includeDoneIssues",
  });

  renderCheckbox({
    ...commonButtonParams,
    label: `Include subtasks`,
    attributeName: "includeSubtasks",
  });
}
