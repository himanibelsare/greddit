import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import { Container, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import RedditIcon from "@mui/icons-material/Reddit";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import PrimarySearchAppBar from "./components/PrimarySearchAppBar";
import CancelIcon from "@mui/icons-material/Cancel";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogFollowers = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const BootstrapDialogFollowing = styled(Dialog)(({ theme }) => ({
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
function BootstrapDialogTitleFollowers(props) {
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
function BootstrapDialogTitleFollowing(props) {
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
BootstrapDialogTitleFollowers.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

BootstrapDialogTitleFollowing.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const Profile = () => {
  const navigate = useNavigate();

  const [myFollowerArray, setmyFollowerArray] = useState([]);
  const [myFollowingArray, setmyFollowingArray] = useState([]);
  const [editUser, setEditUser] = useState({
    firstname: "",
    lastName: "",
    age: "",
    email: "",
    number: "",
    username: "",
    password: "",
  });

  const logout = (event) => {
    event.preventDefault();
    const token = "";
    localStorage.setItem("token", token);
    navigate("/");
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const doNothing = () => {
    setOpen(false);
  };
  const handleClose = async (event) => {
    event.preventDefault();
    setOpen(false);
    //update details of the user
    // console.log("in handleclose");
    try {
      const response = await axios
        .put("http://localhost:8000/api/profile/editprofile", editUser, {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          if (response) {
            console.log(response.data);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const [openFollowers, setOpenFollowers] = React.useState(false);
  const getUserDetails = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/profile/", {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      setEditUser({
        firstname: response.data.firstname,
        lastName: response.data.lastName,
        age: response.data.age,
        email: response.data.email,
        number: response.data.number,
        username: response.data.username,
        password: response.data.password,
      });
      const resFollower = await axios.put(
        "http://localhost:8000/api/followers/getfollowers",
        { username: response.data.username },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      const resFollowing = await axios.put(
        "http://localhost:8000/api/followers/getfollowing",
        { username: response.data.username },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      setmyFollowerArray(resFollower.data);
      setmyFollowingArray(resFollowing.data);
      const myListFollower = document.createElement("ul");
      myFollowerArray.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        myListFollower.appendChild(listItem);
      });
      const myListFollowing = document.createElement("ul");
      myFollowingArray.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        myListFollowing.appendChild(listItem);
      });
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
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, []);
  useEffect(() => {
    getUserDetails();
  }, []);

  const handleClickOpenFollowers = async () => {
    setOpenFollowers(true);
  };
  const handleCloseFollowers = () => {
    setOpenFollowers(false);
  };
  const doNothingFollowers = () => {
    setOpenFollowers(false);
  };

  const [openFollowing, setOpenFollowing] = React.useState(false);

  const handleClickOpenFollowing = () => {
    setOpenFollowing(true);
  };
  const doNothingFollowing = () => {
    setOpenFollowing(false);
  };
  const handleCloseFollowing = () => {
    setOpenFollowing(false);
  };

  function changeDetails(event) {
    console.log(event.target.value);
    const { value, name } = event.target;
    setEditUser({
      ...editUser,
      [name]: value,
    });
  }

  const removeFollowers = async (follower) => {
    console.log("remove followers");
    console.log(follower.item);
    try {
      const response = await axios.put(
        "http://localhost:8000/api/followers/removefollowers",
        { myFollower: follower.item },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      console.log("done, in frontend");
      console.log(response.data);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  const removeFollowing = async (imFollowing) => {
    console.log("unfollowing ppl");
    console.log(imFollowing.item);
    try {
      const response = await axios.put(
        "http://localhost:8000/api/followers/removefollowing",
        { imFollowing: imFollowing.item },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      console.log("done, in frontend");
      console.log(response.data);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div
      style={{
        backgroundColor: "#94d2bd",
        width: "100%",
        height: "825px",
      }}
    >
      <PrimarySearchAppBar />
      <Box
        sx={{
          bgcolor: "white",
          display: "flex",
          p: 1,
          m: 0,
          borderRadius: 1,
          width: "100%",
        }}
      >
        <Button
          sx={{ flexGrow: 1 }}
          variant="outlined"
          onClick={handleClickOpen}
        >
          Edit Profile
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
            Edit Profile!
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstname"
                    required
                    fullWidth
                    id="firstname"
                    label="First Name"
                    autoFocus
                    value={editUser.firstname}
                    onChange={changeDetails}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    value={editUser.lastName}
                    onChange={changeDetails}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    fullWidth
                    id="age"
                    label="Age"
                    name="age"
                    autoComplete="age"
                    value={editUser.age}
                    onChange={changeDetails}
                  />
                </Grid>
                <Grid item xs={12} sm={9}>
                  <TextField
                    required
                    fullWidth
                    id="number"
                    label="Number"
                    name="number"
                    autoComplete="number"
                    value={editUser.number}
                    onChange={changeDetails}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    value={editUser.email}
                    onChange={changeDetails}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    value={editUser.username}
                    onChange={changeDetails}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value={editUser.password}
                    onChange={changeDetails}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleClose}
            >
              Save changes
            </Button>
          </DialogActions>
        </BootstrapDialog>
        <Button
          sx={{ flexGrow: 1 }}
          variant="outlined"
          onClick={logout}
          color="error"
        >
          {" "}
          LOGOUT
        </Button>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <RedditIcon sx={{ height: "100px", width: "100px" }} />
      </Box>
      <h2 style={{ display: "flex", justifyContent: "center" }}>GREDDIT</h2>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
        <div sx={{ flexGrow: 1 }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#263238" }}
            onClick={handleClickOpenFollowers}
          >
            Followers ({myFollowerArray.length})
          </Button>
          <BootstrapDialogFollowers
            onClose={doNothingFollowers}
            aria-labelledby="customized-dialog-title"
            open={openFollowers}
          >
            <BootstrapDialogTitleFollowers
              id="customized-dialog-title"
              onClose={doNothingFollowers}
            >
              Followers!
            </BootstrapDialogTitleFollowers>
            <DialogContent>
              <Box sx={{ maxWidth: 300, maxHeight: 200 }}>
                <div className="container">
                  <div className="row">
                    {myFollowerArray.map((item, index) => (
                      <div key={index} className="col-md-12 mb-0">
                        <div className="card">
                          <div className="card-body d-flex justify-content-between">
                            <h5 className="card-title">{item}</h5>
                            <IconButton
                              size="large"
                              color="inherit"
                              onClick={() => removeFollowers({ item })}
                            >
                              <CancelIcon />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleCloseFollowers}>
                Save changes
              </Button>
            </DialogActions>
          </BootstrapDialogFollowers>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#263238" }}
            onClick={handleClickOpenFollowing}
          >
            Following ({myFollowingArray.length})
          </Button>
          <BootstrapDialogFollowing
            onClose={doNothingFollowing}
            aria-labelledby="customized-dialog-title"
            open={openFollowing}
          >
            <BootstrapDialogTitleFollowing
              id="customized-dialog-title"
              onClose={doNothingFollowing}
            >
              Following!
            </BootstrapDialogTitleFollowing>
            <DialogContent>
              <Box sx={{ maxWidth: 300, maxHeight: 200 }}>
                <div className="container">
                  <div className="row">
                    {myFollowingArray.map((item, index) => (
                      <div key={index} className="col-md-12 mb-0">
                        <div className="card">
                          <div className="card-body d-flex justify-content-between">
                            <h5 className="card-title">{item}</h5>
                            <IconButton
                              size="large"
                              color="inherit"
                              onClick={() => removeFollowing({ item })}
                            >
                              <CancelIcon />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleCloseFollowing}>
                Save changes
              </Button>
            </DialogActions>
          </BootstrapDialogFollowing>
        </div>
      </Box>
      <Container
        sx={{
          display: "flex",
          width: 1200,
          flexDirection: "center",
          marginTop: 2,
        }}
      >
        <TableContainer component={Paper}>
          <Table size="medium" aria-label="a dense table">
            <TableBody>
              <TableRow>
                <TableCell>Firstname</TableCell>
                <TableCell align="right">{editUser.firstname}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Lastname</TableCell>
                <TableCell align="right">{editUser.lastName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Age</TableCell>
                <TableCell align="right">{editUser.age}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell align="right">{editUser.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Number</TableCell>
                <TableCell align="right">{editUser.number}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell align="right">{editUser.username}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
};
export default Profile;
