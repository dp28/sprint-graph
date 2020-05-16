async function performQuery(query) {
  const response = await fetch("/rest/graphql/1/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });
  return await response.json();
}

const issueQuery = (id) => `
  query {
    issue(issueIdOrKey: "${id}", latestVersion: true, screen: "view") {
      id
      fields {
        key
        title
        content
        renderedContent
      }
    }
  }
`;

function findIdsInPage(projectPrefix) {
  const regex = new RegExp(`${projectPrefix}-\\d+`, "g");
  return new Set(document.body.innerText.match(regex));
}
