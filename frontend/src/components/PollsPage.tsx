import { Box, Divider } from "@mui/material";
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

  React.useEffect(() => {
    console.log(data);
  }, [data]);

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
      {status === "success" ? (
        data!!.stats.map((poll_stats: PollStats, index) => (
          <Box sx={{ width: "49%" }}>
            <PollChart key={index} {...poll_stats} />
            <Divider
              orientation="vertical"
              sx={{ height: "320px", marginTop: "-320px" }}
            />
          </Box>
        ))
      ) : (
        <span>Loading...</span>
      )}
    </Box>
  );
};

export default PollsPage;
