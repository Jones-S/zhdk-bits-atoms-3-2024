import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

console.log("Displaying simple bar chart");

// Declare the chart dimensions and margins.
const width = 800;
const height = 800;

const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

// get all the names for the items without children in a flat array
function getNames(node) {
  let names = [];
  if (node.children) {
    node.children.forEach((child) => {
      names = names.concat(getNames(child));
    });
  } else {
    if (node.name) {
      names.push(node.name);
    }
  }
  return names;
}

async function fetchData() {
  const url = "./data.json"; // data from https://opendata.swiss/en/dataset/treibhausgasemissionen-im-kanton-zurich
  let response = await fetch(url);

  if (response.ok) {
    // if HTTP-status is 200-299
    // get the response body (the method explained below)
    let json = await response.json();
    console.log("Finally received the response:");
    console.log("Response: ", json);

    drawChart(json);
  } else {
    alert("HTTP-Error: " + response.status);
  }
}

/* Add Id functionality. Copied from https://github.com/observablehq/stdlib/blob/main/src/dom/uid.js */
let count = 0;

export function uid(name) {
  return new Id("O-" + (name == null ? "" : name + "-") + ++count);
}

function Id(id) {
  this.id = id;
  this.href = new URL(`#${id}`, location) + "";
}

Id.prototype.toString = function () {
  return "url(" + this.href + ")";
};

function drawChart(data) {
  const tileNames = getNames(data);
  console.log("tileNames: ", tileNames);

  // Specify the color scale.
  const color = d3.scaleOrdinal(
    tileNames, // names:  ["Livestock","Crops (excl. Feeds)","Forests","Shrub","Urban","Freshwater","Glaciers","Barren land"]
    [
      "#ABB166",
      "#91BF61",
      "#34A60B",
      "#FFE187",
      "#F34343",
      "#657AFF",
      "#BEE8FF",
      "#C3BFB0",
    ]

    // or use a predefined color scheme:
    // d3.schemeTableau10
  );

  console.log("d3.schemeTableau10: ", d3.schemeTableau10);

  // Compute the layout.
  const root = d3
    .treemap()
    .tile(d3.treemapSquarify) // e.g., d3.treemapSquarify
    .size([width, height])
    .padding(1)
    .round(false)(
    d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)
  );

  // Create the SVG container.
  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height);

  // Add a cell for each leaf of the hierarchy.
  const leaf = svg
    .selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  // Append a tooltip.
  const format = d3.format(",d");
  leaf.append("title").text(
    (d) =>
      `${d
        .ancestors()
        .reverse()
        .map((d) => d.data.name)
        .join(".")}\n${format(d.value)}`
  );

  // Append a color rectangle.
  leaf
    .append("rect")
    .attr("id", (d) => (d.leafUid = uid("leaf")).id)
    .attr("fill", (d) => {
      return color(d.data.name);
    })
    .attr("fill-opacity", 0.6)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0);

  // Append a clipPath to ensure text does not overflow.
  leaf
    .append("clipPath")
    .attr("id", (d) => (d.leafUid = uid("leaf")).id)
    .append("use")
    .attr("xlink:href", (d) => d.leafUid.href);

  // Append multiline text. The last line shows the value and has a specific formatting.
  leaf
    .append("text")
    .attr("clip-path", (d) => d.clipUid)
    .selectAll("tspan")
    .data((d) =>
      d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value))
    )
    .join("tspan")
    .attr("x", 3)
    .attr(
      "y",
      (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`
    )
    .attr("fill-opacity", (d, i, nodes) =>
      i === nodes.length - 1 ? 0.7 : null
    )
    .text((d) => d);

  // return Object.assign(svg.node(), { scales: { color } });

  console.log("svg.node(): ", svg.node());
  container.append(svg.node());
}

fetchData();

// use case for translate?
