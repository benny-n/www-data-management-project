import { TextField, MenuItem, Box } from "@mui/material";
import React from "react";
import { Poll } from "../types";

interface FilterItemProps {
  polls: Poll[];
  activeAnswers: string[];
  onQuestionChange: (uid: string) => void;
  setFilter: (answerIndex: number) => void;
}

const FilterItem: React.FC<FilterItemProps> = (props) => {
  const [activeAnswer, setActiveAnswer] = React.useState<"" | number>("");

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActiveAnswer("");
    props.onQuestionChange(e.target.value);
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let activeIndex = +e.target.value;
    setActiveAnswer(activeIndex);
    props.setFilter(activeIndex);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        flex: "50%",
      }}
    >
      <TextField
        sx={{ width: "49%" }}
        select
        label="Question"
        defaultValue=""
        onChange={handleQuestionChange}
        variant="standard"
      >
        {props.polls.map((element: Poll) => (
          <MenuItem key={element.uid} value={element.uid}>
            {element.question}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        sx={{ width: "49%" }}
        disabled={props.activeAnswers === undefined}
        label="Answer"
        value={activeAnswer}
        onChange={handleAnswerChange}
        variant="standard"
      >
        {props.activeAnswers &&
          props.activeAnswers.map((element: string, index: number) => (
            <MenuItem key={index} value={index}>
              {element}
            </MenuItem>
          ))}
      </TextField>
    </Box>
  );
};

export default FilterItem;
