import React from 'react';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryScatter, VictoryVoronoiContainer, VictoryTooltip } from 'victory';

interface LineChartProps {
  data: { x: string | number; y: number }[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  return (
    <VictoryChart
      theme={VictoryTheme.clean}
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
    >
      <VictoryLine
        style={{ data: { stroke: "#565656" } }}
        data={data}
        x="x"
        y="y"
      />

    </VictoryChart>
  );
};

export default LineChart;