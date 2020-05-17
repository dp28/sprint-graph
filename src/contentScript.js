import { buildGraph } from "./visGraph";
import { getIssues } from "./queries";

const RootId = "__sprintGraphRoot";
const DiagramRootId = "__sprintDiagramRoot";
const MessageElementId = "sprintMessage";

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

async function drawGraph(
  root,
  { includeDoneIssues = true, includeSubtasks = true } = {}
) {
  showMessage("Loading data ...", root);
  const issueGraph = await getIssues({ includeDoneIssues, includeSubtasks });
  console.debug(issueGraph);

  showMessage("Building graph ...", root);
  const graph = buildGraph(issueGraph);

  hideMessage(root);
  const diagramRoot = createOrReplaceDiagramRoot(root);
  graph.draw(diagramRoot);

  console.debug("Drew graph");
}

function drawButtons(root) {
  const state = { includeDoneIssues: true, includeSubtasks: true };
  drawDoneIssuesToggle(root, state);
  drawSubtasksToggle(root, state);
}

function drawDoneIssuesToggle(root, state) {
  const toggleShowDoneIssues = document.createElement("button");
  toggleShowDoneIssues.innerText = "Hide 'Done' issues";

  toggleShowDoneIssues.addEventListener("click", async () => {
    state.includeDoneIssues = !state.includeDoneIssues;

    toggleShowDoneIssues.disabled = "disabled";
    await drawGraph(root, state);

    toggleShowDoneIssues.innerText = state.includeDoneIssues
      ? "Hide 'Done' issues"
      : "Show 'Done' issues";
    toggleShowDoneIssues.disabled = null;
  });

  root.prepend(toggleShowDoneIssues);
}

function drawSubtasksToggle(root, state) {
  const toggleShowSubtasks = document.createElement("button");
  toggleShowSubtasks.innerText = "Hide subtasks";

  toggleShowSubtasks.addEventListener("click", async () => {
    state.includeSubtasks = !state.includeSubtasks;

    toggleShowSubtasks.disabled = "disabled";
    await drawGraph(root, state);

    toggleShowSubtasks.innerText = state.includeSubtasks
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
