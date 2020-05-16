(() => {
  // Don't load the script if it's already been loaded
  if (window.__sprintContentScriptAlreadyRun === true) {
    return { skippedInsertion: true };
  }

  loadContentScript();
  window.__sprintContentScriptAlreadyRun = true;
  return { skippedInsertion: false };
})();

async function loadContentScript() {
  const src = chrome.extension.getURL("src/contentScript.js");
  try {
    // Using a dynamic import enables static imports in the rest of the app
    const contentScript = await import(src);
    contentScript.main();
  } catch (error) {
    console.error(error);
  }
}
