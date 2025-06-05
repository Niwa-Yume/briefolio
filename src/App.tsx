import { Route, Routes } from "react-router-dom";

import {AuthProvider} from "@/contexts/AuthContext.tsx";
import IndexPage from "@/pages/index";
import Monthly from "@/pages/monthly.tsx";
import CategoryPage from "@/pages/category";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import RegisterPage from "@/pages/register";
import LoginPage from "@/pages/login";
import CompleteProfilePage from "@/pages/complete-profile";
import { ProfileCompletionGuard } from "@/components/ProfileCompletionGuard";


function App() {
  return (
    <AuthProvider>
      <ProfileCompletionGuard>
      <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<Monthly />} path="/monthly" />
      <Route element={<CategoryPage />} path="/category" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<CompleteProfilePage />} path="/complete-profile" />
    </Routes>
      </ProfileCompletionGuard>
    </AuthProvider>
  );
}

export default App;
