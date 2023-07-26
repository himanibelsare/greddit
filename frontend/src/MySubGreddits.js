import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import PrimarySearchAppBar from "./components/PrimarySearchAppBar";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Container, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import axios from "axios";
import LaunchIcon from "@mui/icons-material/Launch";
import DeleteIcon from "@mui/icons-material/Delete";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const MySubGreddits = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, []);

  const [open, setOpen] = React.useState(false);
  const [subGreds, setSubGreds] = useState([]);
  const [makeSub, setMakeSub] = useState({
    Name: "",
    Description: "",
    Tags: "",
    BannedWords: "",
  });

  const getMySubDetails = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/mysubgreddits/getdetails",
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      setSubGreds(response.data);
      console.log("here", response.data);
    } catch (err) {
      if (err.response.status === 401) {
        localStorage.setItem("token", "");
        navigate("/");
        return;
      }
      console.log(err);
    }
  };

  useEffect(() => {
    getMySubDetails();
  }, []);

  const createSub = () => {
    setOpen(true);
  };
  const handleClose = async (event) => {
    event.preventDefault();
    setOpen(false);
    //update details of the user
    console.log(makeSub);
    try {
      const response = await axios
        .post(
          "http://localhost:8000/api/mysubgreddits/createsubgreddit",
          makeSub,
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": localStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          if (response) {
            console.log(response.data);
            window.location.reload();
          }
        });
    } catch (err) {
      if (err.response.status === 400) {
        return console.log("sub already exists");
      }
      console.log(err);
    }
  };

  const doNothing = () => {
    setOpen(false);
  };

  function changeDetails(event) {
    console.log(event.target.value);
    const { value, name } = event.target;
    setMakeSub({
      ...makeSub,
      [name]: value,
    });
  }

  const launchSubDetails = (name) => {
    navigate(`/mysubgreddits/${name}`);
  };
  const deleteSub = async (name) => {
    try {
      // console.log(name);
      const response = await axios.post(
        "http://localhost:8000/api/mysubgreddits/deletesub",
        { Name: name },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      console.log(response.data);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div
    //
    >
      <PrimarySearchAppBar />
      <div>
        <div
          style={{
            backgroundColor: "#a0c4ff",
            // width: "100%",
            // height: "825px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1> MySubGreddits!</h1>

          <Button
            variant="contained"
            onClick={createSub}
            sx={{ backgroundColor: "#263238" }}
          >
            Create New SubGreddit
          </Button>
          <BootstrapDialog
            onClose={doNothing}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={doNothing}
            >
              Create new SubGreddit!
            </BootstrapDialogTitle>
            <DialogContent dividers>
              <Box component="form" noValidate sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="Name"
                      required
                      fullWidth
                      id="Name"
                      label="Name (not space seperated)"
                      autoFocus
                      onChange={changeDetails}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="Description"
                      label="Description"
                      name="Description"
                      onChange={changeDetails}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="Tags"
                      label="Tags (lower case, comma separated)"
                      name="Tags"
                      onChange={changeDetails}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="BannedWords"
                      label="Banned Keywords (comma seperated)"
                      name="BannedWords"
                      onChange={changeDetails}
                    />
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose}>
                Save changes
              </Button>
            </DialogActions>
          </BootstrapDialog>
        </div>
      </div>
      <div className="app">
        <div
          className="user-list"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
          }}
        >
          {subGreds.map((user) => (
            <div className="card" key={user.Name}>
              <div className="card-header">
                <h2
                  style={{
                    backgroundColor: "#a0c4ff",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {user.Name}
                  <IconButton
                    style={{ marginLeft: "0.8rem" }}
                    onClick={() => {
                      launchSubDetails(user.Name);
                    }}
                  >
                    <LaunchIcon />
                  </IconButton>
                  <IconButton
                    style={{ marginLeft: "0.8rem" }}
                    onClick={() => {
                      deleteSub(user.Name);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </h2>
              </div>
              <div className="card-body">
                <p>
                  <strong>Description:</strong> {user.Description}
                </p>
                <p>
                  <strong>Banned Keywords:</strong>
                  {user.BannedWords}
                </p>
                <p>
                  <strong>Users:</strong>
                  {user.Users.length}
                </p>
                <p>
                  <strong>Posts:</strong> {user.Posts}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MySubGreddits;
