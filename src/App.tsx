import { Route, Routes } from "react-router-dom";

import {AuthProvider} from "@/contexts/AuthContext.tsx";
import IndexPage from "@/pages/index";
import Monthly from "@/pages/monthly.tsx";
import CategoryPage from "@/pages/category";
import RegisterPage from "@/pages/register";
import LoginPage from "@/pages/login";
import CompleteProfilePage from "@/pages/complete-profile";
import { ProfileCompletionGuard } from "@/components/ProfileCompletionGuard";
import ProfilePage from "@/pages/profile.tsx";
import ContactPage from "@/pages/contact.tsx";
import CategoryDetailsPage from "@/pages/category-details";
import BriefDetailsPage from "@/pages/brief-details";



function App() {
  return (
    <AuthProvider>
      <ProfileCompletionGuard>
      <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<Monthly />} path="/monthly" />
      <Route element={<CategoryPage />} path="/category" />
      <Route element={<ProfilePage />} path="/profile" />
      <Route element={<ContactPage />} path="/contact" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<CompleteProfilePage />} path="/complete-profile" />
        <Route path="/category/:categoryName" element={<CategoryDetailsPage />} />
        <Route path="/brief/:id" element={<BriefDetailsPage />} />
    </Routes>
      </ProfileCompletionGuard>
    </AuthProvider>
  );
}

export default App;
