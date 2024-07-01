import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { Typography, Box, Button } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/blog")
      .then((response) => {
        setBlogs(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching blog data:", error);
      });
  }, []);

  const handleViewComments = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <Layout>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          All Blog
        </Typography>
        {blogs.map((blog) => (
          <Box key={blog.id} mb={2} p={2} boxShadow={1}>
            <Typography variant="h5">{blog.created_by}</Typography>
            <Typography variant="caption">Tag: {blog.tag}</Typography>
            <Typography variant="h6">{blog.subject}</Typography>
            <Typography paragraph>{blog.detail}</Typography>
            <Button
              variant="outlined"
              onClick={() => handleViewComments(blog.id)}
            >
              <ChatIcon /> {blog.comment_count} Comments
            </Button>
          </Box>
        ))}
      </Box>
    </Layout>
  );
};

export default Home;
