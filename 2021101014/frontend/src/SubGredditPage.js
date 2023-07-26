import * as React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PrimarySearchAppBar from "./components/PrimarySearchAppBar";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { CardActions, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReportIcon from "@mui/icons-material/Report";
import FormDialog from "./components/commentDialogue";
import ReportDialog from "./components/reportDialogue";

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

export default function SubGredditPage() {
  const navigate = useNavigate();
  const { subName } = useParams();
  const [open, setOpen] = React.useState(false);
  const [posts, setPosts] = useState([]);
  const [subGreds, setSubGreds] = useState([]);
  const [makePost, setMakePost] = useState({
    Title: "",
    Description: "",
    subName: subName,
  });
  const [makeComment, setMakeComment] = useState({
    comment: "",
    Post: "",
    User: subName,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, []);

  const getPosts = async () => {
    try {
      const response = await axios.put(
        "http://localhost:8000/api/allsubgreddits/getdetails",
        { subName },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      setSubGreds(response.data);
      console.log("subGredditInfo", response.data);
      const res = await axios.post(
        "http://localhost:8000/api/posts/getposts",
        { subName },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      setPosts(res.data);
      console.log("here", res.data);

      const result = await axios.post(
        "http://localhost:8000/api/comments/getcomments",
        { subName },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      setMakeComment(res.data);
      console.log("here", res.data);
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
    getPosts();
  }, []);

  const createPost = () => {
    setOpen(true);
  };
  const handleClose = async (event) => {
    event.preventDefault();
    setOpen(false);
    //update details of the user
    try {
      const response = await axios
        .post(
          "http://localhost:8000/api/posts/createposts",
          { makePost },
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
        return console.log("post already exists");
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
    setMakePost({
      ...makePost,
      [name]: value,
    });
  }
  const upvote = async (title) => {
    try {
      const response = await axios.put(
        "http://localhost:8000/api/posts/upvote",
        { title },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      console.log("here", response.data);
      window.location.reload();
    } catch (err) {
      if (err.response.status === 401) {
        localStorage.setItem("token", "");
        navigate("/");
        return;
      }
      console.log(err);
    }
  };

  const downvote = async (title) => {
    try {
      const response = await axios.put(
        "http://localhost:8000/api/posts/downvote",
        { title },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      console.log("here", response.data);
      window.location.reload();
    } catch (err) {
      if (err.response.status === 401) {
        localStorage.setItem("token", "");
        navigate("/");
        return;
      }
      console.log(err);
    }
  };

  const save = async (title) => {
    try {
      const response = await axios.put(
        "http://localhost:8000/api/posts/savepost",
        { title },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      console.log("here", response.data);
      //   alert("bookmark added!");
      window.location.reload();
    } catch (err) {
      if (err.response.status === 401) {
        localStorage.setItem("token", "");
        navigate("/");
        return;
      }
      console.log(err);
    }
  };
  const follow = async (user) => {
    console.log(user);
    try {
      const response = await axios.put(
        "http://localhost:8000/api/followers/addfollowers",
        { myUsername: user },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      console.log("here", response.data);
      //   alert("bookmark added!");
      window.location.reload();
    } catch (err) {
      if (err.response.status === 401) {
        localStorage.setItem("token", "");
        navigate("/");
        return;
      }
      console.log(err);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#ffe8d6",
      }}
    >
      <PrimarySearchAppBar />
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          onClick={createPost}
          sx={{ backgroundColor: "#263238" }}
        >
          Create New Post
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
            Create new Post!
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    name="Title"
                    required
                    fullWidth
                    id="Title"
                    label="Title"
                    autoFocus
                    onChange={changeDetails}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    required
                    fullWidth
                    id="Description"
                    label="Description"
                    name="Description"
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
      <div style={{ display: "flex" }}>
        <div style={{ width: "25%" }}>
          <img
            src="https://images.unsplash.com/photo-1676807882709-9337b0fb6e84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3Nzk1NjkyOA&ixlib=rb-4.0.3&q=80&w=1080"
            alt="Example Image"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div style={{ width: "80%" }}>
          <TableContainer component={Paper}>
            <Table size="medium" aria-label="a dense table">
              <TableBody>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">{subGreds.Name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">{subGreds.Description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Users</TableCell>
                  <TableCell align="right">
                    {subGreds.Users && subGreds.Users.join(", ")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>BannedWords</TableCell>
                  <TableCell align="right">{subGreds.BannedWords}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      ></div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {posts.map((post, index) => (
          <Card
            key={index}
            sx={{
              width: "calc(33.33% - 20px)",
              marginBottom: 2,
              marginRight: 2,
            }}
          >
            <CardContent
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Typography gutterBottom variant="h5" component="div">
                  {post.Title}
                </Typography>
                <Typography gutterBottom variant="h8" component="div">
                  Description: {post.Description}
                </Typography>
                <Typography gutterBottom variant="h8" component="div">
                  Made by: {post.User}
                </Typography>
                <Typography gutterBottom variant="h8" component="div">
                  Comments:
                  {post.Comments.map((comment) => (
                    <div key={comment.id}>{comment}</div>
                  ))}
                </Typography>
              </div>
              <CardActions>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <IconButton onClick={() => upvote(post.Title)}>
                    <ThumbUpIcon fontSize="small" />
                    <span> {post.Upvotes.length} </span>
                  </IconButton>
                  <IconButton onClick={() => downvote(post.Title)}>
                    <ThumbDownIcon fontSize="small" />
                    <span> {post.Downvotes.length} </span>
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      save(post.Title);
                      alert("bookmark added!");
                    }}
                  >
                    <BookmarkBorderIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => follow(post.User)}>
                    <PersonAddIcon fontSize="small" />
                  </IconButton>
                  <ReportDialog title={post.Title} />
                  <FormDialog title={post.Title} />
                </div>
              </CardActions>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
