import { render, removeChild } from "./render";
import { showMessage, hideMessage } from "./flashMessage";
import { buildGraph } from "../jira/issueGraph";
import { buildGraphDrawer } from "../visGraph";
import { Grey } from "./colours";

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
  removeChild(DiagramRootId, root);
  return render({
    parent: root,
    id: DiagramRootId,
    styles: {
      width: "100%",
      height: "100%",
      position: "relative",
      "flex-grow": 1,
      "box-shadow": `-2px 0px 2px ${Grey.medium}`,
    },
  });
}
