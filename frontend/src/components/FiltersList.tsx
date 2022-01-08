import { TextField, MenuItem, Skeleton, Box, Typography } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { getAllPolls } from "../api";
import { UserContext } from "../App";
import FilterItem, { Filter, Poll } from "./FilterItem";

export interface FiltersListProps {
  filters: Filter[];
  setFilters: (v: Filter[]) => void;
}

const FiltersList: React.FC<FiltersListProps> = ({ filters, setFilters }) => {
  const [pollUids, setPollUids] = React.useState<string[]>([]);
  const [answersIndices, setAnswersIndices] = React.useState<number[]>([]);
  const [answersLists, setAnswersLists] = React.useState<string[][]>([]);
  const { basicAuth } = React.useContext(UserContext);
  const { data, status } = useQuery(
    "get-all-polls",
    () => getAllPolls(basicAuth),
    {
      retry: false,
      refetchOnMount: "always",
      staleTime: Infinity,
    }
  );

  const handleQuestionChange = (uid: string, index: number) => {
    let newPollUids = pollUids.slice();
    newPollUids[index] = uid;
    setPollUids(newPollUids);
    data?.polls.find((value: Poll) => {
      if (uid === value.uid) {
        let newAnswersLists = answersLists.slice();
        newAnswersLists[index] = value.answers;
        setAnswersLists(newAnswersLists);
      }
    });
  };

  const handleAnswerChange = (answerIndex: number, index: number) => {
    console.log("answer index", answerIndex);
    let newAnswerIndices = answersIndices.slice();
    newAnswerIndices[index] = answerIndex;
    setAnswersIndices(newAnswerIndices);
    //setFilters()
  };

  //   React.useEffect(() => {
  //     console.log("status", status);
  //     try {
  //       console.log("data", data?.polls);
  //     } catch {
  //       console.log("not yet");
  //     }
  //   }, [status, data]);

  return status === "success" ? (
    <Box>
      <FilterItem
        polls={data!.polls}
        activeAnswers={answersLists[0]}
        onQuestionChange={(uid) => handleQuestionChange(uid, 0)}
        setFilter={(answerIndex) => handleAnswerChange(answerIndex, 0)}
      />
      {/* {filters.map((element: Filter, index: number) => {
        <FilterItem
          polls={data!.polls}
          activeAnswers={answersLists[index]}
          onQuestionChange={(uid) => handleQuestionChange(uid, index)}
          setFilter={(answerIndex) => handleAnswerChange(answerIndex, index)}
        />;
      })} */}

      <Typography variant="caption" color="secondary" fontSize="11px">
        The poll will be sent only to students who answered the selected answer
        on the selected question.
      </Typography>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1,
      }}
    >
      <Skeleton width="49%" />
      <Skeleton width="49%" />
    </Box>
  );
};

export default FiltersList;
