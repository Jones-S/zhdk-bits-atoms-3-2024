import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

console.log("Displaying simple bar chart");

// Declare the chart dimensions and margins.
const width = 1250;
// const width = window.innerWidth;

// window.addEventListener("resize", () => {
//   width = window.innerWidth;
//   console.log("width: ", width);
// })

// button.addEventListener("click", () => {

// })

const height = 600;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

async function fetchData() {
  const url = "./data.json"; // data from https://opendata.swiss/en/dataset/treibhausgasemissionen-im-kanton-zurich
  let response = await fetch(url);

  if (response.ok) {
    // if HTTP-status is 200-299
    // get the response body (the method explained below)
    let json = await response.json();
    console.log("Finally received the response:");
    console.log("Response: ", json);
    const filteredData = filterData(json);
    drawChart(filteredData);
  } else {
    alert("HTTP-Error: " + response.status);
  }
}

function filterData(data) {
  // another way to write the function?
  return data.filter(
    (item) => item.thg === "CO2" && item.untergruppe === "Abfallverbrennung"
  );
}

function drawChart(data) {
  console.log("data: ", data);

  // Create the SVG container.
  const svg = d3.create("svg").attr("width", width).attr("height", height);

  console.log("svg: ", svg);

  const maxEmission = d3.max(data, (d) => d.emission);

  console.log("maxEmission: ", maxEmission);

  // Declare the x (horizontal position) scale.

  const x = d3
    .scaleBand()
    .domain(d3.range(1990, 2025))
    .range([marginLeft, width - marginRight])
    .padding(0.2);

  // Declare the y (vertical position) scale.
  const y = d3
    .scaleLinear()
    .domain([0, maxEmission])
    .range([height - marginBottom, marginTop]);

  // Add the x-axis.
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - marginBottom})`)
    .call(d3.axisBottom(x));

  // Add the y-axis.
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft}, 0)`)
    .call(d3.axisLeft(y));

  // Declare the bars
  svg
    .append("g")
    .selectAll()
    .data(data)
    .join("rect")
    .attr("fill", "blue")
    .attr("x", function (d) {
      return x(d.jahr);
    })
    .attr("y", (d) => y(d.emission))
    .attr("height", (d) => height - y(d.emission) - marginBottom)
    // .attr("data-year", (d, i) => `${d.jahr} - ${i}`)
    .attr("data-year", function (dataItem, i) {
      return `${dataItem.jahr} - ${i}`;
    })
    .attr("width", x.bandwidth());
  // .attr("width", 1200 / data.length - 10);

  // Add y-axis label
  svg
    .append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("font-size", "10px")
    .attr("font-family", "sans-serif")
    .attr("x", 140)
    .attr("y", 0)
    .attr("dy", ".75em")
    .text("Emissions CO2 (tons per year)");

  // Append the SVG element.
  const container = document.getElementById("container");

  console.log("svg.node(): ", svg.node());
  container.append(svg.node());
}

fetchData();

// use case for translate?
