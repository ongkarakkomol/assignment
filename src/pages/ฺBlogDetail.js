import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import { Typography, Box, Button, TextA, TextField } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { create } from "@mui/material/styles/createTransitions";

const BlogDetail = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openAddComment, setOpenAddComment] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setIsLoggedIn(true);
    }

    axios
      .get(`http://localhost:8080/api/blog/${blogId}`)
      .then((response) => {
        setBlog(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching blog details:", error);
      });

    axios
      .get(`http://localhost:8080/api/blog/${blogId}/comments`)
      .then((response) => {
        setComments(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  }, [blogId]);

  const handleAddComment = () => {
    setOpenAddComment(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`http://localhost:8080/api/comments`, {
        blog_id: blogId,
        created_id: localStorage.getItem("userId"),
        comment: newComment,
      })
      .then((response) => {
        const newCommentData = response.data.data;
        newCommentData.created_by = localStorage.getItem("userName");
        setComments([newCommentData, ...comments]);
        setOpenAddComment(false);
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });
  };

  return (
    <Layout>
      {blog && (
        <Box p={3}>
          <Typography variant="h4">{blog.subject}</Typography>
          <Typography variant="caption">Tag: {blog.tag}</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Created by: {blog.created_by}
          </Typography>
          <Typography paragraph>{blog.detail}</Typography>
          <ChatIcon /> {comments.length} Comments
          <Box mt={2} mb={8}>
            {isLoggedIn && openAddComment === false && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddComment}
              >
                Add Comment
              </Button>
            )}
            {isLoggedIn && openAddComment === true && (
              <>
                <form onSubmit={handleSubmit}>
                  <Box my={2}>
                    <TextField
                      multiline
                      rows={4}
                      fullWidth
                      placeholder="What’s on your mind..."
                      id="newComment"
                      name="newComment"
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                  </Box>
                  <Box my={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      sx={{ float: "right" }}
                    >
                      Add Comment
                    </Button>
                  </Box>
                </form>
              </>
            )}
          </Box>
          {comments.map((comment) => (
            <Box key={comment.id} mb={2} p={2} boxShadow={1}>
              <Typography variant="h5">{comment.created_by}</Typography>
              <Typography paragraph>{comment.comment}</Typography>
            </Box>
          ))}
          {comments.length === 0 && (
            <Typography variant="body2">No comments yet.</Typography>
          )}
        </Box>
      )}
    </Layout>
  );
};

export default BlogDetail;
