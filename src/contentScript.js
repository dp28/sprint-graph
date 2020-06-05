import { loadIssuesOnPage } from "./jira/loader";
import { togglePopup } from "./ui/popup";

const Settings = {
  includeDoneIssues: false,
  includeSubtasks: false,
  includeEpics: false,
  showSummary: true,
  statusColours: {},
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
        console.debug("Toggle popup");
        togglePopup({ loadIssues: loadIssuesOnPage, settings: Settings });
        return;
      default:
        return;
    }
  });
}

main();
