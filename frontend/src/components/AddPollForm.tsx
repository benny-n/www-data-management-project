import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  TextField,
} from "@mui/material";
import React from "react";
import { FormDialogProps } from "./AppMenu";
import { LoadingButton } from "@mui/lab";
import FiltersList from "./FiltersList";
import { Filter } from "../types";
import { useQuery } from "react-query";
import { createPoll } from "../api";
import { UserContext } from "../App";

const questionMaxLength = 300;
const answerMaxLength = 100;
const questionLengthErrorMessage = `Question length must be shorter than ${questionMaxLength} characters!`;
const answerLengthErrorMessage = `Answer length must be shorter than ${answerMaxLength} characters!`;
const emptyFieldErrorMessage = "Required field.";

enum FieldError {
  None,
  TooLong,
  Empty,
}

const AddPollForm: React.FC<FormDialogProps> = (props) => {
  const [filters, setFilters] = React.useState<Filter[]>([]);
  const [filtersError, setFiltersError] = React.useState(false);
  const [question, setQuestion] = React.useState("");
  const [questionError, setQuestionError] = React.useState<FieldError>(
    FieldError.None
  );
  const [answers, setAnswers] = React.useState(["", ""]);
  const [answerErrors, setAnswerErrors] = React.useState<FieldError[]>([
    FieldError.None,
    FieldError.None,
  ]);

  const [createTrigger, setCreateTrigger] = React.useState(false);
  const { basicAuth } = React.useContext(UserContext);
  const { status, remove } = useQuery(
    "create-poll",
    () => createPoll(question, answers, filters, basicAuth!!),
    {
      enabled: createTrigger,
      retry: false,
      staleTime: Infinity,
    }
  );

  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > questionMaxLength) {
      setQuestionError(FieldError.TooLong);
      return;
    } else if (event.target.value.length === 0) {
      setQuestionError(FieldError.Empty);
    } else {
      setQuestionError(FieldError.None);
    }
    setQuestion(event.target.value);
  };

  const handleAnswerChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    let answerErrorsSlice = answerErrors.slice();
    if (event.target.value.length > answerMaxLength) {
      answerErrorsSlice[index] = FieldError.TooLong;
      setAnswerErrors(answerErrorsSlice);
      return;
    } else if (event.target.value.length === 0) {
      answerErrorsSlice[index] = FieldError.Empty;
      setAnswerErrors(answerErrorsSlice);
    } else {
      answerErrorsSlice[index] = FieldError.None;
      setAnswerErrors(answerErrorsSlice);
    }
    let answersSlice = answers.slice();
    answersSlice[index] = event.target.value;
    setAnswers(answersSlice);
  };

  const handleAnswerAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let answerNum: number = +event.target.value;
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

  const handleClickCreate = () => {
    if (!question) {
      setQuestionError(FieldError.Empty);
    } else if (answers.some((element) => element === "")) {
      let newAnswerErrors = answerErrors.slice();
      answers.forEach((answer: string, index: number) => {
        if (!answer) {
          newAnswerErrors[index] = FieldError.Empty;
        }
      });
      setAnswerErrors(newAnswerErrors);
    } else {
      setCreateTrigger(true);
    }
  };

  const handleClose = React.useCallback(() => {
    setFilters([]);
    setFiltersError(false);
    setQuestion("");
    setQuestionError(FieldError.None);
    setAnswers(["", ""]);
    setAnswerErrors([FieldError.None, FieldError.None]);
    setCreateTrigger(false);
    remove();
    props.onClose();
  }, [props, remove]);

  React.useEffect(() => {
    let error = false;
    filters.forEach((filter) => {
      if (Object.keys(filter).length === 0) {
        error = true;
        return;
      }
    });
    setFiltersError(error);
  }, [filters, filtersError]);

  React.useEffect(() => {
    if (status === "success") {
      handleClose();
    }
  }, [status, handleClose]);

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
          onSubmit={() => {}}
        >
          <TextField
            sx={{ width: "80%" }}
            error={questionError !== FieldError.None}
            label="Poll Question"
            variant="outlined"
            value={question}
            helperText={
              questionError === FieldError.TooLong
                ? questionLengthErrorMessage
                : questionError === FieldError.Empty
                ? emptyFieldErrorMessage
                : ""
            }
            onChange={handleQuestionChange}
          />
          <Divider />
          <TextField
            sx={{ width: "30%" }}
            select
            label="Number of poll answers"
            defaultValue={2}
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
                error={answerErrors[index] !== FieldError.None}
                label={`Poll Answer ${index + 1}`}
                variant="outlined"
                value={answers[index]}
                helperText={
                  answerErrors[index] === FieldError.TooLong
                    ? answerLengthErrorMessage
                    : answerErrors[index] === FieldError.Empty
                    ? emptyFieldErrorMessage
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
          disabled={
            filtersError ||
            questionError !== FieldError.None ||
            answerErrors.some((element) => element !== FieldError.None)
          }
          size="medium"
          onClick={handleClickCreate}
          loading={status === "loading"}
          variant="contained"
        >
          Submit
        </LoadingButton>
        <Button size="medium" variant="contained" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPollForm;
