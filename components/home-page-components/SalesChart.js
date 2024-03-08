import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { data } from 'autoprefixer';

export default function SalesChart({ salesData }) {
  const svgRef = useRef();
  
  const [singleSaleData, setSingleSaleData] = useState({data:null, open:false})

  useEffect(() => {
    const width = 600;
    const height = 400;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('border', '1px solid #ccc');

    const x = d3.scaleTime()
      .domain(d3.extent(salesData, d => new Date(d?.closing_date)))
      .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(salesData, d => d?.payment?.quantity / 10 ** 18)])
      .range([height - marginBottom, marginTop]);

    svg.append('g')
      .attr('transform', `translate(0, ${height - marginBottom})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('transform', `translate(${marginLeft}, 0)`)
      .call(d3.axisLeft(y));

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    const dot = svg.append('g')
      .selectAll('circle')
      .data(salesData)
      .join('circle')
      .attr('cx', d => x(new Date(d?.closing_date)))
      .attr('cy', d => y(d?.payment?.quantity / 10 ** 18))
      .attr('r', 4)
      .attr('fill', 'none') // Set fill to none to create a ring
      .attr('stroke', 'steelblue') // Set stroke color
      .attr('stroke-width', 2) // Set stroke width to visualize the ring
    // On mouseover, change the fill color and display tooltip/modal
    .on('mouseover', (event, d) => {
      d3.select(event.currentTarget)
        .attr('fill', 'orange'); // Change to the desired background fill color
      tooltip.transition()
        .duration(200)
        .style('opacity', 1);
      setSingleSaleData({ data: d, open: true });
    })
    // On mouseout, revert the fill color and hide tooltip/modal
    .on('mouseout', (event, d) => {
      d3.select(event.currentTarget)
        .attr('fill', 'none'); // Revert to the original fill color
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
      setSingleSaleData({ data: null, open: false });
    });

    svg.call(d3.brush().on('start brush end', ({ selection }) => {
      let value = [];
      if (selection) {
        const [[x0, y0], [x1, y1]] = selection;
        value = dot.filter(d =>
          x0 <= x(new Date(d?.closing_date * 1000)) && x(new Date(d?.closing_date * 1000)) <= x1 &&
          y0 <= y(d?.payment?.quantity / 10 ** 18) && y(d?.payment?.quantity / 10 ** 18) <= y1)
          .data();
      } else {
        dot.attr('stroke', 'steelblue'); // Change the stroke color back to steelblue on brush reset
      }
      svg.property('value', value).dispatch('input');
    }));

  }, [salesData]);

  return (
  <>
  <SingleSaleModal data={singleSaleData.data} open={singleSaleData.open}/>
  <svg ref={svgRef} />
  </>
  );
}

function SingleSaleModal({data, open}) {
  
  if(!open){
      return
  }

  function formatDateTime(epoch) {
      const date = new Date(epoch * 1000); // Multiply by 1000 to convert seconds to milliseconds
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
      };
      return date.toLocaleString('en-US', options);
  }
  
return (
  <div className=''>
      <img src={data?.nft?.image_url} alt="NFT img" className='w-20 h-20 border-2'/>
      <br></br>
      Date: {formatDateTime(data?.closing_date)}
      <br></br>
      Sale Price: {data?.payment?.quantity / 10 ** 18}
  </div>
)
}
