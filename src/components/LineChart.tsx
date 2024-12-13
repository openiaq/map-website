import React from 'react';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryScatter, VictoryVoronoiContainer, VictoryTooltip } from 'victory';

interface LineChartProps {
  data: { x: string | number; y: number }[];
  className?: string; // TailwindCSS styles
}

const LineChart: React.FC<LineChartProps> = ({ data, className = "" }) => {
  let minPpm = 400;
  let maxPpm = 400;
  data.map(d => {
    minPpm = Math.min(minPpm, d.y);
    maxPpm = Math.max(maxPpm, d.y);
  });

  return (
    <div className={`max-w-xl ${className}`}>
      <VictoryChart
        theme={VictoryTheme.clean}
        domain={{
          x: [0, data.length + 1],
          y: [minPpm, maxPpm + 20],
        }}

      /* Tooltip not working well
      containerComponent={
        <VictoryVoronoiContainer
          voronoiDimension="x"
          labels={({ datum }) =>
            `${datum.y} ppm`
          }
          labelComponent={
            <VictoryTooltip />
          }
        />
      }
     */
      >
        <VictoryLine
          style={{ data: { stroke: "#565656" } }}
          data={data}
          x="x"
          y="y"
        />
        <VictoryScatter data={data} />
      </VictoryChart>
    </div >
  );
};

export default LineChart;