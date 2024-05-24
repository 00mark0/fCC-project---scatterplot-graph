d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
).then((data) => {
  const width = 800;
  const height = 500;
  const padding = 60;

  const svg = d3
    .select("#scatterplot")
    .attr("width", width)
    .attr("height", height);

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.Year - 1), d3.max(data, (d) => d.Year + 1)])
    .range([padding, width - padding]);

  const yScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => new Date(d.Seconds * 1000)))
    .range([height - padding, padding]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .attr("transform", `translate(0, ${height - padding})`)
    .attr("id", "x-axis")
    .call(xAxis);

  svg
    .append("g")
    .attr("transform", `translate(${padding}, 0)`)
    .attr("id", "y-axis")
    .call(yAxis);

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(new Date(d.Seconds * 1000)))
    .attr("r", 5)
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => new Date(d.Seconds * 1000))
    .on("mouseover", (d, i) => {
      d3
        .select("#tooltip")
        .style("opacity", 1)
        .style("left", `${d3.event.pageX}px`)
        .style("top", `${d3.event.pageY}px`)
        .attr("data-year", d.Year).html(`
          <p>Year: ${d.Year}</p>
          <p>Time: ${d.Time}</p>
        `);
    })
    .on("mouseout", (d, i) => {
      d3.select("#tooltip").style("opacity", 0);
    });
});
