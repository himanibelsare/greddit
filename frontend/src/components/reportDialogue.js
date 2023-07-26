import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ReportDialog(title) {
  const navigate = useNavigate();
  //   console.log(title);
  const [open, setOpen] = React.useState(false);
  const [makeComment, setMakeComment] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    setOpen(false);
    // console.log(makeComment, title.title);
    try {
      const response = await axios.put(
        "http://localhost:8000/api/reports/createreports",
        { title: title.title, reason: makeComment },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      console.log("here", response.data);
      //   alert("bookmark added!");
    //   window.location.reload();
    } catch (err) {
      if (err.response.status === 401) {
        localStorage.setItem("token", "");
        navigate("/");
        return;
      }
      console.log(err);
    }
  };

  function changeComment(event) {
    console.log("in change comment");
    console.log(event.target.value);
    setMakeComment(event.target.value);
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Report
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>reason for report:</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="comment"
            label="comment"
            type="comment"
            fullWidth
            variant="standard"
            onChange={changeComment}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
