export function main() {
  console.debug("Loaded!");
  registerListeners();
}

function registerListeners() {
  chrome.runtime.onMessage.addListener((action) => {
    console.debug("Message received by content script:", action);
    switch (action.type) {
      case "TOGGLE_POPUP":
        console.log("Open graph");
        return;
      default:
        return;
    }
  });
}
