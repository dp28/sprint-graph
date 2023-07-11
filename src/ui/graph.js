import { render, removeChild } from "./render.js";
import { showMessage, hideMessage } from "./flashMessage.js";
import { buildGraphDrawer } from "../visGraph.js";
import { Grey } from "./colours.js";

const DiagramRootId = "__sprintDiagramRoot";

export function renderGraph({ graph, settings, root }) {
  showMessage("Drawing graph ...", root);
  const drawer = buildGraphDrawer(graph, settings);

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
