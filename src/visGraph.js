import { DataSet, Network } from "vis-network/standalone";

export function drawVisGraph(issueGraph, root) {
  const data = {
    nodes: new DataSet(
      issueGraph.nodes.map(({ key, status, summary }, index) => ({
        level: index,
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
