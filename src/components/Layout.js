import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import EditNoteIcon from "@mui/icons-material/EditNote";

const Layout = ({ children }) => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`http://localhost:8080/api/users/${userId}`)
        .then((response) => {
          setUserName(response.data.data.name);
        })
        .catch((error) => {
          console.error("There was an error fetching user data!", error);
          localStorage.removeItem("userId");
          localStorage.removeItem("userName");
          navigate("/");
        });
    } else {
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      navigate("/");
    }
  }, []);

  const handleLogin = () => {
    navigate("/");
  };

  const drawerWidth = 240;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            a Board
          </Typography>
          {userName !== "" ? (
            <>
              <Typography variant="h6" component="div">
                Welcome, {userName}
              </Typography>
            </>
          ) : (
            <Button variant="contained" color="success" onClick={handleLogin}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box
          sx={{ overflow: "auto", backgroundColor: "#BBC2C0", height: "100vh" }}
        >
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/home")}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary={"Home"} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/blog")}>
                <ListItemIcon>
                  <EditNoteIcon />
                </ListItemIcon>
                <ListItemText primary={"Our Blog"} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
