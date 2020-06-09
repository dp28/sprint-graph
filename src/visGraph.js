import { DataSet, Network } from "vis-network/standalone";
import { Blue, Green, Grey, Red, getStatusColour } from "./ui/colours";
import { isComplete, isEpic } from "./jira/issues";

export function buildGraphDrawer(issueGraph, settings) {
  const levels = calculateLevels(issueGraph);
  const nodeMap = Object.fromEntries(
    issueGraph.nodes.map((node) => [node.key, node])
  );
  const edges = removeUselessEdges(issueGraph.edges, nodeMap);
  const data = {
    nodes: new DataSet(
      issueGraph.nodes.map((issue) => ({
        level: levels[issue.key],
        id: issue.key,
        label: settings.showSummary
          ? `[${issue.key}] ${issue.summary}`
          : `[${issue.key}]`,
        title: `(${issue.status.name}) ${issue.summary}`,
        color: getColour(issue, settings),
        borderWidth: isEpic(issue) ? 3 : 1,
      }))
    ),
    edges: new DataSet(
      edges.map(({ from, to, type }) => ({
        from,
        to,
        label: getEdgeLabel(type, nodeMap[from]),
        arrows: getArrowDirection(type),
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

function calculateLevels(graph) {
  const levels = calculateBaseLevels(graph);
  const epics = graph.nodes.filter(isEpic);
  if (!epics.length) {
    return levels;
  }

  const lowestEpicLevel = Math.max(epics.map(({ key }) => levels[key]));
  graph.nodes.forEach((issue) => {
    if (!isEpic(issue)) {
      levels[issue.key] += lowestEpicLevel + 1;
    }
  });

  return levels;
}

function calculateBaseLevels({ nodes, edges }) {
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

function getColour(issue, settings) {
  const colour = getStatusColour({
    status: issue.status.name,
    category: issue.status.category,
    settings,
  });
  return isEpic(issue) ? { background: colour, border: Green.dark } : colour;
}

function getEdgeLabel(edgeType, fromNode) {
  if (edgeType === "blocks" && isComplete(fromNode)) {
    return "blocked";
  }
  return edgeType;
}

function getEdgeColour(edgeType, fromNode) {
  if (edgeType === "blocks" && !isComplete(fromNode)) {
    return Red.medium;
  } else if (edgeType === "child") {
    return Blue.dark;
  } else if (edgeType === "epic") {
    return Green.dark;
  }
  return Grey.dark;
}

function getArrowDirection(type) {
  return ["child", "epic"].includes(type) ? "from" : "to";
}

function removeUselessEdges(edges, nodeMap) {
  return edges.filter((edge) => nodeMap[edge.to] && nodeMap[edge.from]);
}
