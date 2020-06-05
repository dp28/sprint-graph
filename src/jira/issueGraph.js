import { not, isComplete, isSubtask } from "./issues";

export function buildGraph(
  issues,
  { includeDoneIssues = false, includeSubtasks = false } = {}
) {
  const nodes = issues.filter(isNotEpic).map(toIssue);
  const edges = findEdges(issues);
  const graph = { nodes, edges };

  return filterSubtasks(
    filterDoneIssues(graph, includeDoneIssues),
    includeSubtasks
  );
}

function filterDoneIssues(graph, includeDoneIssues) {
  if (includeDoneIssues) {
    return graph;
  }
  const unfinishedIssues = graph.nodes.filter(not(isComplete));
  const unfinishedIssueKeys = new Set(unfinishedIssues.map((_) => _.key));
  const unfinishedIssueEdges = graph.edges.filter((edge) =>
    unfinishedIssueKeys.has(edge.from)
  );
  return { nodes: unfinishedIssues, edges: unfinishedIssueEdges };
}

function filterSubtasks(graph, includeSubtasks) {
  if (includeSubtasks) {
    return graph;
  }
  const parentIssues = graph.nodes.filter(not(isSubtask));
  const parentIssueKeys = new Set(parentIssues.map((_) => _.key));
  const parentIssueEdges = graph.edges.filter((edge) =>
    parentIssueKeys.has(edge.to)
  );
  return { nodes: parentIssues, edges: parentIssueEdges };
}

function toIssue({ key, fields }) {
  const summary = findField("summary", fields).content;
  const status = findField("status", fields).content;
  return {
    key,
    status: { name: status.name, category: status.statusCategory.key },
    summary,
    subtask: findField("issuetype", fields).content.subtask,
  };
}

function findEdges(issues) {
  return findBlockedEdges(issues).concat(findSubtaskEdges(issues));
}

function findBlockedEdges(issues) {
  return issues
    .flatMap((issue) =>
      findField("issuelinks", issue.fields).content.map((link) => ({
        key: issue.key,
        link,
      }))
    )
    .filter((_) => _.link.outwardIssue && _.link.type.outward === "blocks")
    .map((issue) => ({
      from: issue.key,
      to: issue.link.outwardIssue.key,
      type: issue.link.type.outward,
    }));
}

function findSubtaskEdges(issues) {
  return issues.flatMap((issue) =>
    findField("subtasks", issue.fields).content.map((subtask) => ({
      from: issue.key,
      to: subtask.key,
      type: "child",
    }))
  );
}

function findField(name, fields) {
  return fields.find((_) => _.key === name);
}

function isNotEpic(rawIssue) {
  const issueType = findField("issuetype", rawIssue.fields).content;
  return issueType.name.toLowerCase() !== "epic";
}
