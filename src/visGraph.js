import { DataSet, Network } from "vis-network/standalone";
import { Blue, Green, Grey } from "./ui/colours";

export function buildGraphDrawer(issueGraph, { showSummary }) {
  const levels = calculateLevels(issueGraph);
  const nodeMap = Object.fromEntries(
    issueGraph.nodes.map((node) => [node.key, node])
  );
  const data = {
    nodes: new DataSet(
      issueGraph.nodes.map(({ key, status, summary }, index) => ({
        level: levels[key],
        id: key,
        label: showSummary ? `[${key}] ${summary}` : `[${key}]`,
        title: `(${status.name}) ${summary}`,
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
        nodeSpacing: 100,
        treeSpacing: 100,
      },
    },
  };

  return { draw: (root) => new Network(root, data, options) };
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

function calculateLongestDistanceToRoot(nodeKey, incomingEdges, path = []) {
  if (!incomingEdges[nodeKey]) {
    return 0;
  }
  const nextEdgesWithoutCycles = incomingEdges[nodeKey].filter(
    (key) => !path.includes(key)
  );

  return Math.max(
    ...nextEdgesWithoutCycles.map(
      (from) =>
        1 +
        calculateLongestDistanceToRoot(from, incomingEdges, [...path, nodeKey])
    )
  );
}

const StatusColours = {
  new: Grey.medium,
  done: {
    border: Green.dark,
    background: Green.medium,
  },
  default: {
    border: Blue.dark,
    background: Blue.medium,
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
