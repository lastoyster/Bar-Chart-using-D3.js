function buildChart(dataset) {
  // Title
  const title = d3.select('#title');
  title.text('GDP Chart');

  // Chart

  const width = 800;
  const height = 400;
  const barWidth = width / dataset.length;

  const chart = d3.select('#chart');

  // Tooltip

  const tooltip = chart.append('div').attr('id', 'tooltip');

  // SVG

  const svg = chart.append('svg');
  svg.attr('width', width + 100);
  svg.attr('height', height + 60);

  const getDate = (date) => new Date(date);

  const minYear = d3.min(dataset, (d) => getDate(d[0]));
  const maxYear = d3.max(dataset, (d) => getDate(d[0]));

  // X axis
  const xScale = d3.scaleTime().domain([minYear, maxYear]).range([0, width]);

  const xAxis = d3.axisBottom(xScale);
  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(60, ${height + 0})`)
    .call(xAxis);

  // Y Axis
  const yScaleAxis = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([height, 0]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([0, height]);

  const yAxis = d3.axisLeft(yScaleAxis);

  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(50, 0)`)
    .call(yAxis);

  // bar

  svg
    .selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('fill', 'red')
    .attr('width', barWidth)
    .attr('height', (d) => yScale(d[1]))
    .attr('x', (d, i) => xScale(getDate(d[0])))
    .attr('y', (d) => height - yScale(d[1]))
    .attr('transform', 'translate(60,0)')
    .attr('data-date', (d) => d[0])
    .attr('data-gdp', (d) => d[1])
    .attr('index', (d, i) => i)
    .on('mouseover', function (event, d) {
      const i = this.getAttribute('index');
      tooltip
        .style('opacity', 1)
        .html(`${d[1]}`)
        .style('top', height - 100 + 'px')
        .style('left', event.x + 'px')
        .attr('data-date', d[0]);
    })
    .on('mouseout', (event, d) => {
      console.log(event, d);
      tooltip.style('opacity', 0);
    });
}

// Load json

function load() {
  d3.json(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
  ).then((response) => {
    console.log(response.data);
    buildChart(response.data);
  });
}

load();
