import { loadIssues } from "./issueQueries";
import { findIssueKeys } from "./page";

export async function loadIssuesOnPage() {
  const issueKeys = findIssueKeys();
  return await loadIssues(issueKeys);
}
