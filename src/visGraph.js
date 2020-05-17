import { DataSet, Network } from "vis-network/standalone";

export function drawVisGraph(issueGraph, root) {
  const levels = calculateLevels(issueGraph);
  const data = {
    nodes: new DataSet(
      issueGraph.nodes.map(({ key, status, summary }, index) => ({
        level: levels[key],
        id: key,
        label: key,
        title: `[${status}] ${summary}`,
      }))
    ),
    edges: new DataSet(
      issueGraph.edges.map(({ from, to, type }) => ({
        from,
        to,
        label: type,
        arrows: "to",
      }))
    ),
  };

  const options = {
    nodes: {
      shape: "box",
      widthConstraint: 100,
    },
    layout: {
      hierarchical: {
        enabled: true,
        treeSpacing: 200,
      },
    },
  };

  new Network(root, data, options);
}

function calculateLevels({ nodes, edges }) {
  const incomingEdges = edges.reduce((incoming, edge) => {
    incoming[edge.to] = incoming[edge.to] || [];
    incoming[edge.to].push(edge.from);
    return incoming;
  }, {});

  return Object.fromEntries(
    nodes.map((node) => [
      node.key,
      calculateLongestDistanceToRoot(node.key, incomingEdges),
    ])
  );
}

function calculateLongestDistanceToRoot(nodeKey, incomingEdges) {
  if (!incomingEdges[nodeKey]) {
    return 0;
  }
  return Math.max(
    ...incomingEdges[nodeKey].map(
      (from) => 1 + calculateLongestDistanceToRoot(from, incomingEdges)
    )
  );
}
