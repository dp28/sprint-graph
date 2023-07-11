import { loadIssues } from "./issueQueries.js";
import { findIssueKeys } from "./page.js";

export async function loadIssuesOnPage() {
  const issueKeys = findIssueKeys();
  return await loadIssues(issueKeys);
}
