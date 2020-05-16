export async function getIssues() {
  const projectKey = getProjectKey();
  console.debug({ projectKey });

  const issueKeys = findIssueKeysInPage(projectKey);
  const query = combineQueryParts(issueKeys.map(buildIssueQuery));
  const { data } = await performQuery(query);
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
  return [...new Set(document.body.innerText.match(regex))];
}

function mapIssuesToNetworkData(issues) {
  const nodes = issues.map(toNode);
  const edges = findEdges(issues);
  return { nodes, edges };
}

function toNode({ id, key, fields }) {
  const summary = findField("summary", fields).content;
  const status = findField("status", fields).content.name;
  return {
    id,
    label: `[${key}] ${summary} (${status})`,
  };
}

function findEdges(issues) {
  return issues
    .flatMap((issue) => findField("issuelinks", issue.fields).content)
    .filter((_) => _.outwardIssue)
    .map((issue) => ({ from: issue.id, to: issue.outwardIssue.id }));
}

function findField(name, fields) {
  return fields.find((_) => _.key === name);
}
