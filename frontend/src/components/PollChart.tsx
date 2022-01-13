import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { deletePoll } from "../api";
import { UserContext } from "../App";
import { PollStats } from "../types";

const determineFontSize = (questionLength: number) => {
  if (questionLength < 20) {
    return "1.5rem";
  } else if (questionLength < 50) {
    return "1rem";
  } else if (questionLength < 100) {
    return "0.75rem";
  } else {
    return "0.5rem";
  }
};
export interface PollChartProps {
  pollStats: PollStats;
  setRefresh: (_: boolean) => void;
}

const PollChart: React.FC<PollChartProps> = ({ pollStats, setRefresh }) => {
  const theme = useTheme();
  const [deleteTrigger, setDeleteTrigger] = React.useState(false);
  const { jwt } = React.useContext(UserContext);
  const { status, remove } = useQuery(
    "delete-poll",
    () => {
      deletePoll(pollStats.uid, jwt!!);
    },
    { enabled: deleteTrigger, retry: false, staleTime: Infinity }
  );

  React.useEffect(() => {
    if (status === "success") {
      remove();
      setDeleteTrigger(false);
      setRefresh(true);
      setTimeout(() => setRefresh(false), 2000);
    }
  }, [status, setRefresh, remove]);

  const handleClickDelete = () => {
    setDeleteTrigger(true);
  };

  const questionFontSize = determineFontSize(pollStats.question.length);

  React.useLayoutEffect(() => {
    let root = am5.Root.new(`chartdiv-${pollStats.uid}`);
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

    let chartStats = pollStats.answers.map((answer, index) => {
      return { answer: answer, votes: pollStats.votes[index] };
    });

    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(10),
        x: am5.percent(5),
        layout: root.verticalLayout,
        legendLabelText: "{category}",
        legendValueText: "{value}",
      })
    );
    series.slices.template.set("tooltipText", "{category}: {value}");
    series.labels.template.set("text", "{category}: {value}");
    series.data.setAll(chartStats);
    legend.data.setAll(series.dataItems);

    return () => {
      root.dispose();
    };
  }, [pollStats, theme]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          fontWeight="bold"
          sx={{ fontSize: questionFontSize, marginLeft: "10px" }}
        >
          {pollStats.question}
        </Typography>
        <IconButton
          size="large"
          sx={{ marginRight: "5px" }}
          onClick={handleClickDelete}
        >
          <DeleteForeverIcon />
        </IconButton>
      </Box>
      <Box
        id={`chartdiv-${pollStats.uid}`}
        style={{ padding: 2, width: "100%", height: "250px", marginBottom: 5 }}
      ></Box>
      <Divider sx={{ alignSelf: "center", width: "100%" }} />
    </Box>
  );
};

export default PollChart;
