import { DataSet, Network } from "vis-network/standalone";

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

function drawGraph() {
  const root = document.createElement("div");
  root.style =
    "width: calc(100% - 20px); height: calc(100% - 20px); border: 1px solid lightgray; position: absolute; top: 10px; left: 10px; background: white; z-index: 10000";
  root.id = "__sprintGraphRoot";
  document.body.appendChild(root);

  const data = {
    nodes: new DataSet([
      { id: 1, label: "Node 1" },
      { id: 2, label: "Node 2" },
      { id: 3, label: "Node 3" },
      { id: 4, label: "Node 4" },
      { id: 5, label: "Node 5" },
    ]),
    edges: new DataSet([
      { from: 1, to: 3 },
      { from: 1, to: 2 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 3 },
    ]),
  };

  new Network(root, data, {});
  console.debug("Drew graph");
}

main();
