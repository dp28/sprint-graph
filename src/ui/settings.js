import { render } from "./render";
import { renderCheckbox } from "./checkbox";
import { Grey, getStatusColour, setStatusColour } from "./colours";

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

  renderStatusColours({
    parent: settingsElement,
    issues: visibleIssues,
    settings,
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
  const renderText = ({ text, styles }) => {
    render({ parent, elementType: "p", innerText: text, styles });
  };

  renderText({
    text: `Found ${allRawIssues.length} issues on this page`,
    styles: {
      "margin-bottom": "20px",
    },
  });

  renderText({
    text: `Showing ${visibleIssues.length} issues`,
    styles: {
      "margin-bottom": "0px",
    },
  });

  renderText({
    text: `(${allRawIssues.length - visibleIssues.length} hidden by filters)`,
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

  renderCheckbox({
    ...commonButtonParams,
    label: `Include epics`,
    attributeName: "includeEpics",
  });
}

function renderStatusColours({ parent, issues, settings, onChange }) {
  const allStatuses = issues.map((_) => _.status);
  const statusToCategory = Object.fromEntries(
    allStatuses.map(({ name, category }) => [name, category])
  );

  render({
    parent,
    elementType: "h3",
    innerText: "Statuses",
  });

  Object.entries(statusToCategory).forEach(([status, category]) => {
    const label = render({
      parent,
      innerText: status,
      elementType: "label",
      styles: { display: "block", "margin-bottom": "10px" },
    });

    const colourInput = render({
      parent: label,
      elementType: "input",
      styles: { float: "left", "margin-right": "5px" },
    });

    colourInput.type = "color";
    colourInput.value = getStatusColour({ category, status, settings });

    colourInput.addEventListener("change", async ({ target }) => {
      const newColour = target.value;
      setStatusColour({ status, colour: newColour, settings });

      colourInput.disabled = "disabled";
      await onChange();
      colourInput.disabled = null;
    });
  });
}
