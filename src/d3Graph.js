import * as d3 from "d3";

export function drawD3Graph(issueGraph, rootId) {
  const width = 800;
  const height = 600;
  const data = {
    nodes: issueGraph.nodes.map((node) => ({ ...node, id: node.key })),
    links: issueGraph.edges.map(({ from, to }) => ({
      source: from,
      target: to,
    })),
  };

  // const data = mockData();

  console.log(data);

  const svg = d3
    .select(`#${rootId}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const link = svg
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .style("stroke", "aaa");

  const node = svg.selectAll("g").data(data.nodes).enter().append("g");

  const nodeCircles = node
    .append("circle")
    .attr("r", 20)
    .style("fill", "#69b3a2")
    .append("text");

  const nodeLabels = node
    .append("text")
    .text((_) => _.key)
    .attr("x", 6)
    .attr("y", 3);

  node.append("title").text((_) => _.summary);

  const simulation = d3
    .forceSimulation(data.nodes) // Force algorithm is applied to data.nodes
    .force(
      "link",
      d3
        .forceLink()
        .id((_) => _.id)
        .links(data.links)
        .distance(100)
    )
    .force("charge", d3.forceManyBody().strength(-3)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
    .force("center", d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
    .on("end", ticked);

  function ticked() {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
  }
}

function mockData() {
  return {
    nodes: [
      {
        id: 1,
        name: "A",
      },
      {
        id: 2,
        name: "B",
      },
      {
        id: 3,
        name: "C",
      },
      {
        id: 4,
        name: "D",
      },
      {
        id: 5,
        name: "E",
      },
      {
        id: 6,
        name: "F",
      },
      {
        id: 7,
        name: "G",
      },
      {
        id: 8,
        name: "H",
      },
      {
        id: 9,
        name: "I",
      },
      {
        id: 10,
        name: "J",
      },
    ],
    links: [
      {
        source: 1,
        target: 2,
      },
      {
        source: 1,
        target: 5,
      },
      {
        source: 1,
        target: 6,
      },
      {
        source: 2,
        target: 3,
      },
      {
        source: 2,
        target: 7,
      },
      {
        source: 3,
        target: 4,
      },
      {
        source: 8,
        target: 3,
      },
      {
        source: 4,
        target: 5,
      },
      {
        source: 4,
        target: 9,
      },
      {
        source: 5,
        target: 10,
      },
    ],
  };
}
