import { drawVisGraph } from "./visGraph";
import { drawD3Graph } from "./d3Graph";
import { getIssues } from "./queries";

const RootId = "__sprintGraphRoot";

function main() {
  if (window.__sprintGraphAlreadyLoaded) {
    return;
  }
  registerListeners();
  window.__sprintGraphAlreadyLoaded = true;
  console.debug("Loaded!");
}

function registerListeners() {
  chrome.runtime.onMessage.addListener((action) => {
    console.debug("Message received by content script:", action);
    switch (action.type) {
      case "TOGGLE_POPUP":
        console.debug("Toggle graph");
        toggleGraph();
        return;
      default:
        return;
    }
  });
}

function toggleGraph() {
  const root = document.getElementById(RootId);
  if (root) {
    document.body.removeChild(root);
  } else {
    drawGraph();
  }
}

async function drawGraph() {
  const issueGraph = await getIssues();
  console.debug(issueGraph);

  const root = document.createElement("div");
  root.style =
    "width: calc(100% - 20px); height: calc(100% - 20px); border: 1px solid lightgray; position: absolute; top: 10px; left: 10px; background: white; z-index: 10000";
  root.id = RootId;
  document.body.appendChild(root);

  drawVisGraph(issueGraph, root);
  // drawD3Graph(issueGraph, RootId);

  console.debug("Drew graph");
}

main();
