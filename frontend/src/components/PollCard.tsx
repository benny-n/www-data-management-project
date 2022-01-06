import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import LoadingButton from "@mui/lab/LoadingButton";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import SendIcon from "@mui/icons-material/Send";
import React from "react";
import { Alert, Snackbar } from "@mui/material";
import Slide, { SlideProps } from "@mui/material/Slide";

const TransitionUp = (props: SlideProps) => {
  return <Slide {...props} direction="up" />;
};

const PollCard = () => {
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleClick = () => {
    if (loading) {
      return;
    }
    // TODO change this to HTTP post request
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAlertOpen(true);
    }, 2500);
  };

  const handleClose = () => {
    setAlertOpen(false);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "rgba(0, 0, 0, 0.09)",
        maxWidth: "275px",
        borderWidth: 3,
      }}
    >
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
          {/* TODO change this to poll question */}
          Would you rather be hairy and bald or not?
        </Typography>
        <Box sx={{ my: 2, overflow: "auto", maxHeight: "100px" }}>
          {/* TODO change this to map by poll answers */}
          <Typography variant="body2" color="text.secondary" component="div">
            1. hairy and bald.
            <br />
            2. or not.
            <br />
            3. ....
            <br />
            4. .....
            <br />
            5. ......
            <br />
            6. .......
            <br />
            6. .......
            <br />
            6. .......
            <br />
            6. .......
            <br />
            6. .......
            <br />
            6. .......
            <br />
            6. .......
            <br />
            6. .......
            <br />
            6. .......
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <LoadingButton
          onClick={handleClick}
          endIcon={<SendIcon />}
          loading={loading}
          loadingPosition="end"
          variant="contained"
        >
          Send
        </LoadingButton>
      </CardActions>
      <Snackbar
        open={alertOpen}
        onClose={handleClose}
        autoHideDuration={3000}
        TransitionComponent={TransitionUp}
      >
        {/* TODO add error state */}
        <Alert onClose={handleClose} severity="success">
          Poll sent!
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default PollCard;
