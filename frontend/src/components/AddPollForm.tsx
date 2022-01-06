import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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

const questionMaxLength = 300;
const answerMaxLength = 100;
const answerMaxAmount = 10;
const answerMinAmount = 2;
const questionLengthErrorMessage = `Question length must be shorter than ${questionMaxLength} characters!`;
const answerLengthErrorMessage = `Answer length must be shorter than ${answerMaxLength} characters!`;
const answerTooManyErrorMessage = `Polls can't have more than ${answerMaxAmount} answers!`;
const answerNotEnoughErrorMessage = `Polls must have at least ${answerMinAmount} answers!`;

//TODO implement filters
// interface Filter {
//   question: string;
//   answer: string;
// }

enum AnswerError {
  None,
  NotEnough,
  TooMany,
  TooLong,
}

const TransitionDown = (props: SlideProps) => {
  return <Slide {...props} direction="down" />;
};

const AddPollForm: React.FC<FormDialogProps> = (props) => {
  //const [filters, setFilters] = React.useState<Filter[]>([]); //TODO implement filters
  const [question, setQuestion] = React.useState("");
  const [answers, setAnswers] = React.useState(["", ""]);
  const [answerErrors, setAnswerErrors] = React.useState([
    AnswerError.None,
    AnswerError.None,
  ]);
  const [answerAlert, setAnswerAlert] = React.useState(AnswerError.None);
  const [answerAlertOpen, setAnswerAlertOpen] = React.useState(false);
  const [questionError, setQuestionError] = React.useState(false);

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

  const handleAddAnswer = () => {
    const incNumAnswers = answers.length + 1;
    if (incNumAnswers > answerMaxAmount) {
      setAnswerAlertOpen(true);
      setAnswerAlert(AnswerError.TooMany);
      return;
    }
    setAnswers(answers.concat(""));
  };

  const handleRemoveAnswer = () => {
    const decNumAnswers = answers.length - 1;
    if (decNumAnswers < answerMinAmount) {
      setAnswerAlertOpen(true);
      setAnswerAlert(AnswerError.NotEnough);
      return;
    }
    setAnswers(answers.slice(0, -1));
  };

  const handleCloseAlert = () => {
    setAnswerAlertOpen(false);
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
            gap: 1,
            marginTop: 2,
          }}
          id="poll-form"
          onSubmit={() => {
            console.log("submit");
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 2,
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
            <Box sx={{ flexDirection: "row" }}>
              <Tooltip title={"Add Answer"} TransitionComponent={Zoom}>
                <IconButton
                  sx={{ padding: "5px" }}
                  size="large"
                  onClick={handleAddAnswer}
                >
                  <AddCircleIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={"Remove Answer"} TransitionComponent={Zoom}>
                <IconButton
                  sx={{ padding: "5px" }}
                  size="large"
                  onClick={handleRemoveAnswer}
                >
                  <RemoveCircleIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={"Add Filter"} TransitionComponent={Zoom}>
                <IconButton sx={{ padding: "5px" }} size="large">
                  <FilterAltIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          {answers.map((_, index) => (
            <TextField
              key={index}
              sx={{ margin: 0.1, width: "60%" }}
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
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={answerAlertOpen}
            onClose={handleCloseAlert}
            autoHideDuration={1500}
            TransitionComponent={TransitionDown}
          >
            {answerAlert === AnswerError.TooMany ? (
              <Alert onClose={handleCloseAlert} severity="error">
                {answerTooManyErrorMessage}
              </Alert>
            ) : answerAlert === AnswerError.NotEnough ? (
              <Alert onClose={handleCloseAlert} severity="error">
                {answerNotEnoughErrorMessage}
              </Alert>
            ) : (
              <Alert />
            )}
          </Snackbar>
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
