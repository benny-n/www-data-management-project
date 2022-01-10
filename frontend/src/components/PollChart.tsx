import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import { PollStats } from "../types";
import { Box, Divider, Typography, useTheme } from "@mui/material";
import React from "react";

const PollChart: React.FC<PollStats> = (props) => {
  const theme = useTheme();

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
    const themes: any[] = [am5themes_Animated.new(root)];
    if (theme.palette.mode === "dark") {
      themes.push(am5themes_Dark.new(root));
    }
    root.setThemes(themes);

    let pollStats = props.answers.map((answer, index) => {
      return { answer: answer, votes: props.votes[index] };
    });

    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(80),
        x: am5.percent(90),
        layout: root.verticalLayout,
      })
    );
    series.data.setAll(pollStats);
    legend.data.setAll(series.dataItems);

    return () => {
      root.dispose();
    };
  }, [props, theme]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Typography fontWeight="bold" variant="h5" sx={{ alignSelf: "center" }}>
        {props.question}
      </Typography>
      <Box
        id={`chartdiv-${props.uid}`}
        style={{ padding: 2, width: "100%", height: "250px", marginBottom: 5 }}
      ></Box>
      <Divider sx={{ alignSelf: "center", width: "100%" }} />
    </Box>
  );
};

export default PollChart;
