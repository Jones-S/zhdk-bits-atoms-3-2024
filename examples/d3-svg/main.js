const data = [10, 56, 95, 77];

// Add SVG
const svg = d3
  .select("#d3")
  .append("svg")
  .attr("width", 1000)
  .attr("height", 750)
  .attr("viewBox", [0, 0, 1000, 750]);

const line = svg
  // using the same svg selection from before and adding a line
  .append("line")
  // adding a class attribute for stroke styling (see style.css)
  .attr("class", "axis")
  // and adding line specific attributes to define the line
  .attr("x1", 10)
  .attr("y1", 20)
  .attr("x2", window.innerWidth - 10)
  .attr("y2", 20);

// Adding a group
const group = svg.append("g").attr("transform", "translate(36 45.5)");

// Adding a circle to the group
const circle = group
  .append("circle")
  .attr("cx", 100)
  .attr("cy", 300)
  .attr("r", 55)
  .attr("fill", "steelblue");

// Adding another circle to the group
const circleSmall = group
  .append("circle")
  .attr("cx", 250)
  .attr("cy", 300)
  .attr("r", 20)
  .attr("fill", "rgb(100, 0, 30)");

const gutter = 50;
const barWidth = 30;
const marginLeft = 50;

svg
  // selecting (selectAll()) is necessary, but we can add a random selector here ('whatever')
  // the return value is an empty selection:
  // https://github.com/d3/d3-selection/blob/v3.0.0/README.md#selectAll
  // if you ask yourself why:
  // https://stackoverflow.com/questions/17452508/what-is-the-point-of-calling-selectall-when-there-are-no-existing-nodes-yet-on-d
  .selectAll("whatever")
  .data(data)
  .enter()
  .append("rect")
  .attr(
    "x",
    (d, currentIndex) => marginLeft + currentIndex * (barWidth + gutter)
  )
  .attr("y", 40)
  .attr("width", barWidth)
  .attr("height", (d) => d)
  .attr("rx", 3) // corner radius
  .append("circle");
