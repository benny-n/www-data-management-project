import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Snackbar,
  TextField,
  Tooltip,
  Zoom,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Slide, { SlideProps } from "@mui/material/Slide";
import React from "react";
import { FormDialogProps } from "./AppMenu";
import { LoadingButton } from "@mui/lab";
import { getAllPolls } from "../api";
import { useQuery } from "react-query";
import { UserContext } from "../App";
import FiltersList from "./FiltersList";
import { Filter } from "./FilterItem";

const questionMaxLength = 300;
const answerMaxLength = 100;
const questionLengthErrorMessage = `Question length must be shorter than ${questionMaxLength} characters!`;
const answerLengthErrorMessage = `Answer length must be shorter than ${answerMaxLength} characters!`;

enum AnswerError {
  None,
  TooLong,
}

const AddPollForm: React.FC<FormDialogProps> = (props) => {
  const [filters, setFilters] = React.useState<Filter[]>([
    { pollUid: "123", answerIndex: 123 } as Filter,
    { pollUid: "123", answerIndex: 123 } as Filter,
    { pollUid: "123", answerIndex: 123 } as Filter,
  ]); //TODO implement filters
  const [question, setQuestion] = React.useState("");
  const [questionError, setQuestionError] = React.useState(false);
  const [answers, setAnswers] = React.useState(["", ""]);
  const [answerErrors, setAnswerErrors] = React.useState([
    AnswerError.None,
    AnswerError.None,
  ]);

  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > questionMaxLength) {
      setQuestionError(true);
      return;
    }
    setQuestionError(false);
    setQuestion(event.target.value);
  };

  const handleAnswerChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    let answerErrorsSlice = answerErrors.slice();
    if (event.target.value.length > answerMaxLength) {
      answerErrorsSlice[index] = AnswerError.TooLong;
      setAnswerErrors(answerErrorsSlice);
      return;
    }
    answerErrorsSlice[index] = AnswerError.None;
    setAnswerErrors(answerErrorsSlice);
    let answersSlice = answers.slice();
    answersSlice[index] = event.target.value;
    setAnswers(answersSlice);
  };

  const handleAnswerAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let answerNum: number = parseInt(event.target.value);
    let newAnswers = answers.slice();
    if (answerNum > answers.length) {
      for (let i = answers.length; i < answerNum; i++) {
        newAnswers.push("");
      }
    } else {
      newAnswers = answers.slice(0, answerNum);
    }
    setAnswers(newAnswers);
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: 2,
          }}
          id="poll-form"
          onSubmit={() => {
            console.log("submit");
          }}
        >
          <TextField
            sx={{ width: "80%" }}
            error={questionError}
            label="Poll Question"
            variant="outlined"
            value={question}
            helperText={questionError ? questionLengthErrorMessage : ""}
            onChange={handleQuestionChange}
          />
          <Divider />
          <TextField
            sx={{ width: "30%" }}
            select
            label="Number of poll answers"
            value={answers.length}
            onChange={handleAnswerAmountChange}
            variant="outlined"
          >
            {[2, 3, 4].map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </TextField>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              flex: "50%",
              gap: "5px",
            }}
          >
            {answers.map((_, index) => (
              <TextField
                key={index}
                sx={{ margin: 0.1, width: "49%" }}
                error={answerErrors[index] === AnswerError.TooLong}
                label={`Poll Answer ${index + 1}`}
                variant="outlined"
                value={answers[index]}
                helperText={
                  answerErrors[index] === AnswerError.TooLong
                    ? answerLengthErrorMessage
                    : ""
                }
                onChange={(e) => handleAnswerChange(e, index)}
              />
            ))}
          </Box>
          <Divider />
          <FiltersList {...{ filters, setFilters }} />
        </Box>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          type="submit"
          form={props.formId}
          size="medium"
          onClick={() => {}} //TODO
          loading={false} //TODO
          variant="contained"
        >
          Submit
        </LoadingButton>
        <Button size="medium" variant="contained" onClick={props.onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPollForm;
