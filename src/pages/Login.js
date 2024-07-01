import { useState } from "react";
import logo from "../assets/9761bea793b24e9f6af1620580a39d2f.png";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/users", {
        name,
      });
      console.log(response.data);
      const userId = response.data.data.id;
      const userName = response.data.data.name;
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      navigate("/home");
    } catch (error) {
      console.error("There was an error logging in!", error);
    }
  };

  return (
    <>
      <Grid
        container
        component="main"
        sx={{ height: "100vh", backgroundColor: "#243831" }}
      >
        <Grid
          item
          sm={6}
          sx={{
            display: "flex",
          }}
        >
          <Box
            sx={{
              margin: "auto",
            }}
          >
            <Typography variant="h4" sx={{ mt: 2, color: "#fff" }}>
              Sign in
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                name="name"
                autoComplete="off"
                autoFocus
                InputProps={{
                  style: {
                    backgroundColor: "#fff",
                    color: "black",
                  },
                  notchedOutline: {
                    borderColor: "white",
                  },
                }}
                onChange={(e) => setName(e.target.value)}
              />
              <Button
                type="submit"
                margin="normal"
                fullWidth
                variant="contained"
                color="success"
                size="large"
              >
                Sign In
              </Button>
            </form>
          </Box>
        </Grid>
        <Grid
          item
          sm={6}
          sx={{
            display: "flex",
            backgroundColor: "#2B5F44",
          }}
        >
          <Box
            sx={{
              margin: "auto",
            }}
          >
            <img src={logo} alt="a board" />
            <Typography
              variant="h4"
              sx={{ mt: 2, color: "#fff", textAlign: "center" }}
            >
              a Board
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
