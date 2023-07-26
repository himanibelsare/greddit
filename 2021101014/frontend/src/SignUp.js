import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function SignUp({ setSignUpFlag }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [userData, setUserData] = useState("");
  const [FnameDisabled, setFnameDisabled] = useState(true);
  const [LnameDisabled, setLnameDisabled] = useState(true);
  const [ageDisabled, setageDisabled] = useState(true);
  const [numberDisabled, setnumberDisabled] = useState(true);
  const [emailDisabled, setemailDisabled] = useState(true);
  const [UDisabled, setUDisabled] = useState(true);
  const [PDisabled, setPDisabled] = useState(true);

  const disabled = () => {
    if (
      UDisabled ||
      PDisabled ||
      FnameDisabled ||
      LnameDisabled ||
      ageDisabled ||
      numberDisabled ||
      emailDisabled
    )
      return true;
    else return false;
  };

  const signin = (event) => {
    event.preventDefault();
    setSignUpFlag(false);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const firstname = data.get("firstname");
    const lastName = data.get("lastName");
    const age = data.get("age");
    const number = data.get("number");
    const email = data.get("email");
    const username = data.get("username");
    const password = data.get("password");
    // console.log({ firstname, lastName, age, number, email, username, password });

    Axios.post("http://localhost:8000/api/users/signup", {
      firstname,
      lastName,
      age,
      number,
      email,
      username,
      password,
    }).then((response) => {
      if (response) {
        setUserData(response.data);
        console.log(response.data.token);
        localStorage.setItem("token", response.data.token);
        navigate("/profile");
      }
    });

    if (!username || !password) {
      setActive(true);
    }
  };

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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
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
                  onChange={(text) => setFnameDisabled(!text.target.value)}
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
                  onChange={(text) => setLnameDisabled(!text.target.value)}
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
                  onChange={(text) => setageDisabled(!text.target.value)}
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
                  onChange={(text) => setnumberDisabled(!text.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  onChange={(text) => setemailDisabled(!text.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  onChange={(text) => setUDisabled(!text.target.value)}
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
                  onChange={(text) => setPDisabled(!text.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={disabled()}
            >
              Sign Up
            </Button>
            <Button fullWidth onClick={signin} sx={{ mb: 2 }}>
              {" "}
              Don't have an account? SignIn
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
