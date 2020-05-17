export async function getIssues() {
  const projectKey = getProjectKey();
  console.debug({ projectKey });

  const issueKeys = findIssueKeysInPage(projectKey);
  console.log({ issueKeys });
  const query = combineQueryParts(issueKeys.map(buildIssueQuery));
  const { data } = await performQuery(query);
  console.log(data);
  const issues = Object.values(data);
  return mapIssuesToNetworkData(issues);
}

function getProjectKey() {
  const url = location.href;
  const pathMatch = url.match(/\/projects\/(\w+)\//);
  if (pathMatch) {
    return pathMatch[1];
  } else {
    const searchMatch = url.match(/projectKey=(\w+)/);
    if (searchMatch) {
      return searchMatch[1];
    } else {
      throw "Project key not found in URL";
    }
  }
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

function mapIssuesToNetworkData(issues) {
  const nodes = issues.map(toIssue);
  const edges = findEdges(issues);
  return { nodes, edges };
}

function toIssue({ id, key, fields }) {
  const summary = findField("summary", fields).content;
  const status = findField("status", fields).content;
  return {
    id,
    key,
    status: { name: status.name, category: status.statusCategory.key },
    summary,
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
    .filter((_) => _.link.outwardIssue)
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
