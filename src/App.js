import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import BlogDetail from "./pages/ฺBlogDetail";
import Blog from "./pages/Blog";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:blogId" element={<BlogDetail />} />
    </Routes>
  );
}

export default App;
