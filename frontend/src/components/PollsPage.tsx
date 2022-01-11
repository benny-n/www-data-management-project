import { Box, Divider, Skeleton } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { getAllPollStats } from "../api";
import { UserContext } from "../App";
import { PollStats } from "../types";
import PollChart from "./PollChart";

export interface PollsPageProps {
  refresh: boolean;
  setRefresh: (_: boolean) => void;
}

const PollsPage: React.FC<PollsPageProps> = ({ refresh, setRefresh }) => {
  const { basicAuth } = React.useContext(UserContext);
  const { data, status, remove } = useQuery("get-all-polls-stats", () =>
    getAllPollStats(basicAuth!!)
  );

  React.useEffect(() => {
    if (refresh) {
      remove();
      setRefresh(false);
    }
  }, [refresh, setRefresh, remove]);

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
        ? data!!.stats.map((pollStats: PollStats, index) => (
            <Box sx={{ width: "49%" }} key={index}>
              <PollChart {...{ pollStats, setRefresh }} />
              <Divider
                orientation="vertical"
                sx={{ height: "340px", marginTop: "-340px" }}
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
