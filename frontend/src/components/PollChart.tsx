import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import { PollStats } from "../types";
import Box from "@mui/material/Box";
import React from "react";

const PollChart: React.FC<PollStats> = (props) => {
  React.useLayoutEffect(() => {
    let root = am5.Root.new(`chartdiv-${props.uid}`);
    let chart = root.container.children.push(am5percent.PieChart.new(root, {}));
    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Poll Statistics",
        categoryField: "answer",
        valueField: "votes",
      })
    );

    let pollStats = props.answers.map((answer, index) => {
      return { answer: answer, votes: props.votes[index] };
    });

    series.data.setAll(pollStats);

    return () => {
      root.dispose();
    };
  }, [props]);
  return (
    <Box
      id={`chartdiv-${props.uid}`}
      style={{ width: "50%", height: "250px" }}
    ></Box>
  );
};

export default PollChart;
