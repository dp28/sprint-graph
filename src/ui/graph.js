import { render } from "./render";
import { showMessage, hideMessage } from "./flashMessage";
import { buildGraph } from "../jira/issueGraph";
import { buildGraphDrawer } from "../visGraph";

const DiagramRootId = "__sprintDiagramRoot";

export function renderGraph({ issues, settings, root }) {
  const issueGraph = buildGraph(issues, settings);
  console.debug(issueGraph);

  showMessage("Building graph ...", root);
  const drawer = buildGraphDrawer(issueGraph, settings);

  hideMessage(root);
  const diagramRoot = renderDiagramRoot(root);
  drawer.draw(diagramRoot);

  console.debug("Drew graph");
}

function renderDiagramRoot(root) {
  removeDiagramRoot(root);
  return render({
    parent: root,
    id: DiagramRootId,
    styles: {
      width: "100%",
      height: "100%",
      position: "relative",
      "flex-grow": 1,
    },
  });
}

function removeDiagramRoot(root) {
  const diagramRoot = root.querySelector(`#${DiagramRootId}`);
  if (diagramRoot) {
    root.removeChild(diagramRoot);
  }
}