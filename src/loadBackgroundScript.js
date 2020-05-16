// Using a dynamic import enables static imports in the rest of the app
(async () => {
  const src = chrome.extension.getURL("src/backgroundScript.js");
  try {
    const backgroundScript = await import(src);
    backgroundScript.main();
  } catch (error) {
    console.error(error);
  }
})();
