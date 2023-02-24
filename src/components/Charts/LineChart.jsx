import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const data = [
  { date: new Date('2001-01-01'), value: 100 },
  { date: new Date('2002-02-01'), value: 200 },
  { date: new Date('2004-06-01'), value: 120 },
  { date: new Date('2006-04-01'), value: 180 },
  { date: new Date('2008-02-02'), value: 300 },
  { date: new Date('2010-03-01'), value: 250 },
  { date: new Date('2011-07-01'), value: 400 },
  { date: new Date('2012-08-01'), value: 390 },
  { date: new Date('2015-11-21'), value: 280 },
  { date: new Date('2016-10-01'), value: 260 },
  { date: new Date('2018-12-01'), value: 310 },
  { date: new Date('2020-09-19'), value: 370 },
];

const LineChart = () => {
  const ref = useRef(null);
  const svgContainer = useRef(null);
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();

  //handling page responsiveness
  const getSvgContainerSize = () => {
    const newWidth = svgContainer.current.clientWidth;
    setWidth(newWidth);

    const newHeight = svgContainer.current.clientHeight;
    setHeight(newHeight);
  };

  useEffect(() => {
    // detect 'width' and 'height' on render
    getSvgContainerSize();
    // listen for resize changes, and detect dimensions again when they change
    window.addEventListener("resize", getSvgContainerSize);
    // cleanup event listener
    return () => window.removeEventListener("resize", getSvgContainerSize);
  }, []);

  useEffect(() => {
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    //setting up svg
    const svg = d3
      .select(ref.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    //setting the scaling
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([height, 0]);
      
    //setting the axes
    const xAxis = d3.axisBottom(xScale);

    const yAxis = d3.axisLeft(yScale)
      .ticks(5);

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    svg.append('g').call(yAxis);

    //setting up the curve
    const line = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value))
      .curve(d3.curveLinear);

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);
  }, [data]);

  return (
    <div ref={svgContainer} className='LineChart'>
      <div ref={ref}></div>
    </div>
  );
};

export default LineChart;
