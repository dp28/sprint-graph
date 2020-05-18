export async function getIssues({ includeDoneIssues, includeSubtasks }) {
  const projectKey = getProjectKey();
  console.debug({ projectKey });

  const issueKeys = findIssueKeysInPage(projectKey);
  console.debug({ issueKeys });
  const query = combineQueryParts(issueKeys.map(buildIssueQuery));
  const { data } = await performQuery(query);
  console.debug(data);
  const issues = Object.values(data);
  return mapIssuesToNetworkData({ issues, includeDoneIssues, includeSubtasks });
}

function getProjectKey() {
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

async function performQuery(query) {
  const response = await fetch("/rest/graphql/1/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });
  return await response.json();
}

function buildIssueQuery(key) {
  const name = key.replace("-", "");
  return `
    ${name}: issue(issueIdOrKey: "${key}", latestVersion: true, screen: "view") {
      id
      key
      fields {
        key
        title
        content
        renderedContent
      }
    }
  `;
}

function combineQueryParts(parts) {
  return `query { ${parts.join("\n\n")} }`;
}

function findIssueKeysInPage(projectKey) {
  const regex = new RegExp(`${projectKey}-\\d+`, "g");
  return [...new Set(document.body.innerHTML.match(regex))];
}

function mapIssuesToNetworkData({
  issues,
  includeDoneIssues,
  includeSubtasks,
}) {
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
  const unfinishedIssues = graph.nodes.filter((_) => !isDone(_));
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
  const parentIssues = graph.nodes.filter((_) => !_.subtask);
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

function isDone(issue) {
  return issue.status.category === "done";
}

function isNotEpic(rawIssue) {
  const issueType = findField("issuetype", rawIssue.fields).content;
  return issueType.name.toLowerCase() !== "epic";
}
