import { buildGraph } from "./visGraph";
import { getIssues } from "./queries";

const RootId = "__sprintGraphRoot";
const DiagramRootId = "__sprintDiagramRoot";
const MessageElementId = "sprintMessage";

const State = {
  includeDoneIssues: false,
  includeSubtasks: false,
};

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

async function toggleGraph() {
  const root = document.getElementById(RootId);
  if (root) {
    document.body.removeChild(root);
  } else {
    const root = createRoot();
    await drawGraph(root);
    drawButtons(root);
  }
}

async function drawGraph(root) {
  showMessage("Loading data ...", root);
  const issueGraph = await getIssues(State);
  console.debug(issueGraph);

  showMessage("Building graph ...", root);
  const graph = buildGraph(issueGraph);

  hideMessage(root);
  const diagramRoot = createOrReplaceDiagramRoot(root);
  graph.draw(diagramRoot);

  console.debug("Drew graph");
}

function drawButtons(root) {
  drawDoneIssuesToggle(root);
  drawSubtasksToggle(root);
}

function drawDoneIssuesToggle(root) {
  const toggleShowDoneIssues = document.createElement("button");
  toggleShowDoneIssues.innerText = State.includeDoneIssues
    ? "Hide 'Done' issues"
    : "Show 'Done' issues";

  toggleShowDoneIssues.addEventListener("click", async () => {
    State.includeDoneIssues = !State.includeDoneIssues;

    toggleShowDoneIssues.disabled = "disabled";
    await drawGraph(root);

    toggleShowDoneIssues.innerText = State.includeDoneIssues
      ? "Hide 'Done' issues"
      : "Show 'Done' issues";
    toggleShowDoneIssues.disabled = null;
  });

  root.prepend(toggleShowDoneIssues);
}

function drawSubtasksToggle(root) {
  const toggleShowSubtasks = document.createElement("button");
  toggleShowSubtasks.innerText = State.includeSubtasks
    ? "Hide subtasks"
    : "Show subtasks";

  toggleShowSubtasks.addEventListener("click", async () => {
    State.includeSubtasks = !State.includeSubtasks;

    toggleShowSubtasks.disabled = "disabled";
    await drawGraph(root);

    toggleShowSubtasks.innerText = State.includeSubtasks
      ? "Hide subtasks"
      : "Show subtasks";
    toggleShowSubtasks.disabled = null;
  });

  root.prepend(toggleShowSubtasks);
}

function createOrReplaceDiagramRoot(root) {
  let diagramRoot = root.querySelector(`#${DiagramRootId}`);
  if (diagramRoot) {
    root.removeChild(diagramRoot);
  }
  return createDiagramRoot(root);
}

function createRoot() {
  const root = document.createElement("div");
  root.style =
    "width: calc(100% - 20px); height: calc(100% - 20px); border: 1px solid lightgray; position: absolute; top: 10px; left: 10px; background: white; z-index: 10000";
  root.id = RootId;
  document.body.appendChild(root);
  return root;
}

function createDiagramRoot(root) {
  const diagramRoot = document.createElement("div");
  diagramRoot.id = DiagramRootId;
  diagramRoot.style =
    "width: 100%; height: calc(100% - 50px); position: relative; border-top: 1px solid lightgray";
  root.appendChild(diagramRoot);
  return diagramRoot;
}

function showMessage(message, root) {
  let element = root.querySelector(`#${MessageElementId}`);
  if (!element) {
    element = document.createElement("p");
    element.id = MessageElementId;
    root.prepend(element);
  }
  element.innerText = message;
}

function hideMessage(root) {
  let element = root.querySelector(`#${MessageElementId}`);
  if (element) {
    root.removeChild(element);
  }
}

main();
