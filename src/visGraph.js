import { DataSet, Network } from "vis-network/standalone";

export function drawVisGraph(issueGraph, root) {
  const levels = calculateLevels(issueGraph);
  const nodeMap = Object.fromEntries(
    issueGraph.nodes.map((node) => [node.key, node])
  );
  const data = {
    nodes: new DataSet(
      issueGraph.nodes.map(({ key, status, summary }, index) => ({
        level: levels[key],
        id: key,
        label: key,
        title: `[${status.name}] ${summary}`,
        color: getStatusColour(status.category),
      }))
    ),
    edges: new DataSet(
      issueGraph.edges.map(({ from, to, type }) => ({
        from,
        to,
        label: getEdgeLabel(type, nodeMap[from]),
        arrows: type === "child" ? "from" : "to",
        color: getEdgeColour(type, nodeMap[from]),
        dashes: type !== "child",
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

const StatusColours = {
  new: "rgb(223, 225, 230)",
  done: {
    border: "rgb(0, 135, 90)",
    background: "rgb(160, 255, 223)",
  },
  default: {
    border: "rgb(0, 82, 204)",
    background: "rgb(178, 209, 255)",
  },
};

function getStatusColour(statusCategory) {
  return StatusColours[statusCategory] || StatusColours.default;
}

function getEdgeLabel(edgeType, fromNode) {
  if (edgeType === "blocks" && fromNode.status.category === "done") {
    return "was blocked by";
  }
  return edgeType;
}

function getEdgeColour(edgeType, fromNode) {
  if (edgeType === "blocks" && fromNode.status.category !== "done") {
    return "red";
  } else if (edgeType === "child") {
    return "rgb(0, 82, 204)";
  }
  return "grey";
}
