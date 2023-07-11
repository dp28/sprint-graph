function registerListeners() {
  chrome.action.onClicked.addListener((tab) => {
    console.debug("Clicked - tab:", tab.id);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["contentScript.js"],
    }).then((...results) => {
      console.debug("Content script loaded", ...results);
      chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_POPUP" });
    });
  });
}

console.debug("Loaded!");
registerListeners();
