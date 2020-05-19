import { buildGraph } from "./issueGraph";
import { loadIssues } from "./issues";
import { findIssueKeys } from "./page";

export async function loadIssueGraph(graphOptions = {}) {
  const issueKeys = findIssueKeys();
  const issues = await loadIssues(issueKeys);
  return buildGraph(issues, graphOptions);
}
