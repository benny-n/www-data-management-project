import { Box, Divider, Skeleton } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { getAllPollStats } from "../api";
import { UserContext } from "../App";
import { PollStats } from "../types";
import PollChart from "./PollChart";

const PollsPage: React.FC = () => {
  const { basicAuth } = React.useContext(UserContext);
  const { data, status } = useQuery("get-all-polls-stats", () =>
    getAllPollStats(basicAuth!!)
  );

  return (
    <Box
      className="poll-page-box"
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        flex: "40%",
        gap: "5px",
        marginTop: 1,
      }}
    >
      {status === "success"
        ? data!!.stats.map((poll_stats: PollStats, index) => (
            <Box sx={{ width: "49%" }} key={index}>
              <PollChart {...poll_stats} />
              <Divider
                orientation="vertical"
                sx={{ height: "320px", marginTop: "-320px" }}
              />
            </Box>
          ))
        : [0, 1, 2, 3].map((index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "49%",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Skeleton width={50} />
              <Skeleton variant="circular" width={210} height={218} />
              <Skeleton width="100%" />
            </Box>
          ))}
    </Box>
  );
};

export default PollsPage;
