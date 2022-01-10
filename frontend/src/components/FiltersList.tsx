import { Skeleton, Box, Typography, IconButton } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { getAllPolls } from "../api";
import { UserContext } from "../App";
import FilterItem from "./FilterItem";
import { Filter, Poll } from "../types";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

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
    () => getAllPolls(basicAuth!!),
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
        return true;
      }
      return false;
    });
  };

  const handleAnswerChange = (answerIndex: number, index: number) => {
    let newAnswerIndices = answersIndices.slice();
    newAnswerIndices[index] = answerIndex;
    setAnswersIndices(newAnswerIndices);
    let newFilters = filters.slice();
    newFilters[index] = { answerIndex, pollUid: pollUids[index] };
    setFilters(newFilters);
  };

  const handleAddFilter = (event: any) => {
    let newFilters = filters.slice();
    newFilters.push({} as Filter);
    setFilters(newFilters);
  };

  const handleRemoveFilter = (event: any) => {
    let newFilters = filters.slice();
    newFilters.pop();
    setFilters(newFilters);
    let newPollUids = pollUids.slice();
    newPollUids.pop();
    setPollUids(newPollUids);
    let newAnswersLists = answersLists.slice();
    newAnswersLists.pop();
    setAnswersLists(newAnswersLists);
  };

  return status === "success" ? (
    <Box>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 1,
          }}
          color="text.secondary"
          fontSize="14px"
        >
          Add or remove filters:
        </Typography>
        <IconButton onClick={handleAddFilter}>
          <AddCircleIcon />
        </IconButton>
        <IconButton onClick={handleRemoveFilter}>
          <RemoveCircleIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {filters.map((_: Filter, index: number) => (
          <FilterItem
            key={index}
            polls={data!.polls}
            activeAnswers={answersLists[index]}
            onQuestionChange={(uid) => handleQuestionChange(uid, index)}
            setFilter={(answerIndex) => handleAnswerChange(answerIndex, index)}
          />
        ))}
      </Box>
      {filters.length > 0 && (
        <Typography variant="caption" color="text.secondary" fontSize="11px">
          The poll will be sent only to students who answered the selected
          answer on the selected question."
        </Typography>
      )}
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
