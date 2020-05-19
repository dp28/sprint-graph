export function findIssueKeys(projectKey) {
  const safeProjectKey = projectKey || findCurrentProjectKey();
  const regex = new RegExp(`${safeProjectKey}-\\d+`, "g");
  return [...new Set(document.body.innerHTML.match(regex))];
}

export function findCurrentProjectKey() {
  const url = location.href;
  const pathMatch = url.match(/\/projects\/(\w+)\//);
  if (pathMatch) {
    return pathMatch[1];
  }

  const searchMatch = url.match(/projectKey=(\w+)/);
  if (searchMatch) {
    return searchMatch[1];
  }

  const issueIdMatch = url.match(/([A-Z]+)-\d+/);
  if (issueIdMatch) {
    return issueIdMatch[1];
  }

  throw "Project key not found in URL";
}
