import { isComplete, isSubtask, isEpic } from "./issues.js";

export function buildGraph(issues, settings = {}) {
  const nodes = issues.map(toIssue);
  const edges = findEdges(issues);
  const graph = { nodes, edges };

  const filter = buildFilter(settings);
  return filterGraph(filter, graph);
}

function buildFilter({
  includeDoneIssues = false,
  includeSubtasks = false,
  includeEpics = false,
}) {
  return (issue) =>
    (includeDoneIssues || !isComplete(issue)) &&
    (includeSubtasks || !isSubtask(issue)) &&
    (includeEpics || !isEpic(issue));
}

function filterGraph(shouldKeepNode, graph) {
  const nodesToKeep = graph.nodes.filter(shouldKeepNode);
  const nodeKeysToKeep = new Set(nodesToKeep.map((_) => _.key));
  const edgesToKeep = graph.edges.filter((edge) =>
    nodeKeysToKeep.has(edge.from)
  );
  return { nodes: nodesToKeep, edges: edgesToKeep };
}

function toIssue({ key, fields }) {
  const summary = findField("summary", fields).content;
  const status = findField("status", fields).content;
  return {
    key,
    status: { name: status.name, category: status.statusCategory.key },
    summary,
    subtask: findField("issuetype", fields).content.subtask,
    type: findField("issuetype", fields).content.name.toLowerCase(),
  };
}

function findEdges(issues) {
  return [findBlockedEdges, findSubtaskEdges, findEpicEdges].reduce(
    (edges, findEdges) => edges.concat(findEdges(issues)),
    []
  );
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
    findOptionalArray("subtasks", issue.fields)
      .concat(findOptionalArray("children-issues", issue.fields))
      .map((subtask) => ({
        from: issue.key,
        to: subtask.key,
        type: "child",
      }))
  );
}

function findEpicEdges(issues) {
  return issues.flatMap((possibleEpic) => {
    const subIssues = findField("epic-issues", possibleEpic.fields);
    if (!subIssues) {
      return [];
    }

    return subIssues.content.map((issue) => ({
      to: issue.key,
      from: possibleEpic.key,
      type: "epic",
    }));
  });
}

function findOptionalArray(name, fields) {
  return (findField(name, fields) || {}).content || []
}

function findField(name, fields) {
  return fields.find((_) => _.key === name);
}
