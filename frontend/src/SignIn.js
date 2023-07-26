import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Axios from "axios";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn({ setSignUpFlag }) {
  const navigate = useNavigate();

  const [userData, setUserData] = useState("");
  const [INactive, setINActive] = useState(false);
  const [Udisabled, setUDisabled] = useState(true);
  const [Pdisabled, setPDisabled] = useState(true);

  const signup = (event) => {
    event.preventDefault();
    // console.log("here");
    setSignUpFlag(true);
  };

  const disabled = () => {
    if (Udisabled || Pdisabled) return true;
    else return false;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      username: data.get("username"),
      password: data.get("password"),
    });

    const username = data.get("username");
    const password = data.get("password");

    Axios.post("http://localhost:8000/api/users/signin", {
      username,
      password,
    }).then((response) => {
      setUserData(response.data);
      //   console.log(response.data.token);
      if (response) {
        localStorage.setItem("token", response.data.token);
        navigate("/profile");
      }
    });

    if (!username || !password) {
      setINActive(true);
    }
  };

  //   const login = async (kind) => {
  //     kind = 0;
  //     const credentials = [{ username: "u1", password: "p1" }];
  //     try {
  //       const res = await fetch("http://localhost:8000/api/auth/", {
  //         method: "POST",
  //         body: JSON.stringify(credentials[kind]),
  //       });
  //     } catch (err) {
  //       console.err(err);
  //     }
  //   };
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "seagreen" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              onChange={(text) => setUDisabled(!text.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={(text) => setPDisabled(!text.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={disabled()}
            >
              Sign In
            </Button>
            <Button fullWidth onClick={signup} sx={{ mb: 2 }}>
              {" "}
              Don't have an account? SignUp
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
