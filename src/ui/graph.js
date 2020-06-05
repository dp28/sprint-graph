import { render } from "./render";
import { showMessage, hideMessage } from "./flashMessage";
import { buildGraph } from "../jira/issueGraph";
import { buildGraphDrawer } from "../visGraph";

const DiagramRootId = "__sprintDiagramRoot";

export function renderGraph({ issues, settings, root }) {
  showMessage("Loading data ...", root);
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
      height: "calc(100% - 50px)",
      position: "relative",
      "border-top": "1px solid lightgray",
    },
  });
}

function removeDiagramRoot(root) {
  const diagramRoot = root.querySelector(`#${DiagramRootId}`);
  if (diagramRoot) {
    root.removeChild(diagramRoot);
  }
}
