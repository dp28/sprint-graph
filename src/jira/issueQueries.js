export async function loadIssues(issueKeys) {
  const query = combineQueryParts(issueKeys.map(buildIssueQuery));
  const { data } = await performQuery(query);
  return Object.values(data);
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
  return `query loadIssues { ${parts.join("\n\n")} }`;
}
