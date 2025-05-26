import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import Monthly from "@/pages/monthly.tsx";
import CategoryPage from "@/pages/category";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<Monthly />} path="/monthly" />
      <Route element={<CategoryPage />} path="/category" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
    </Routes>
  );
}

export default App;
