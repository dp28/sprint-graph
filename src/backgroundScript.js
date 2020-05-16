function registerListeners() {
  chrome.browserAction.onClicked.addListener((tab) => {
    console.debug("Clicked - tab:", tab.id);
    chrome.tabs.executeScript(
      tab.id,
      {
        file: "contentScript.bundle.js",
        runAt: "document_end",
        allFrames: false,
      },
      (...results) => {
        console.debug("Content script loaded", ...results);
        chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_POPUP" });
      }
    );
  });
}

console.debug("Loaded!");
registerListeners();
