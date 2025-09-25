import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./page/login/Login";
import Unauthorized from "./page/login/Unauthorized";
import Layout from "./component/Layout";
import ErrorPage from "./page/errorPage/ErrorPage";
import AdminDashboard from "./page/admin/AdminDashboard";
import VenderDashboard from "./page/vender/VenderDashboard";
import CompanyDashboard from "./page/company/CompanyDashboard";
import ProtectedRoute from "./component/ProtectedRoute";
import FAQ from "./page/faq/FAQ";
import Category from "./page/category/Category";
import Review from "./page/review/Review";
import Subcategory from "./page/subcategory/Subcategory";
import Products from "./page/product/Products";
import AdminHome from "./page/admin/AdminHome";
import EyeCheck from "./page/eyeCheck/Eyecheck";
import VendorHome from "./page/vender/VendorHome";
// import VendorRegistrationForm from "./page/vender/VendorRegistrationForm";
// import CompanyRegistrationForm from "./page/company/CompanyRegister";
import VendorPage from "./page/vender/VendorPage";
// import Register from "./page/login/Register";
import Testimonials from "./page/testimonials/Testimonials";
import EyewearTips from "./page/eyewearTips/EyewearTips";
import Inquiry from "./page/inquiries/Inquiry";
import UpdateVendorProfile from "./page/vender/UpdateVendorProfile";
import Disclaimer from "./page/disclaimer/Disclaimer";
import EyeService from "./page/ourEyeServices/EyeServices";
import CompanyHome from "./page/company/CompanyHome";
import UpdateCompanyProfile from "./page/company/UpdateCompanyProfile";
import AdminCompanyDetails from "./page/company/AdminCompanyDetails";
import ContactLens from "./page/contactLens/ContactLens";
import UpdateAdminProfile from "./page/admin/UpdateAdminProfile";
import CouponCode from "./page/coupons/CouponCode";

function App() {
  return (
    <Routes>
      {/* ---------- public routes ---------- */}
      {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
      <Route path="/" element={<Navigate to="/loginNew" replace />} />
      <Route path="/loginNew" element={<Login />} />
      {/* <Route path="/login" element={<Login />} /> */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      {/* ---------- protected  ---------- */}
      <Route element={<Layout />}>
        {/* ------------ admin ------------ */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<AdminHome />} />
          <Route path="profile" element={<UpdateAdminProfile />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="category" element={<Category />} />
          <Route path="subCategory" element={<Subcategory />} />
          <Route path="product" element={<Products />} />
          <Route path="coupons" element={<CouponCode />} />
          <Route path="review" element={<Review />} />
          {/* <Route path="service" element={<Service />} /> */}
          <Route path="eyeCheck" element={<EyeCheck />} />
          <Route path="vendor" element={<VendorPage />} />
          <Route path="company" element={<AdminCompanyDetails />} />
          {/* <Route path="register" element={<Register/>} /> */}
          {/* <Route path="register" element={<VendorRegistrationForm />} /> */}
          {/* <Route path="company" element={<CompanyRegistrationForm />} /> */}
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="eyewearTips" element={<EyewearTips />} />
          <Route path="inquiries" element={<Inquiry />} />
          <Route path="disclaimer" element={<Disclaimer />} />
          <Route path="eye-services" element={<EyeService />} />
          <Route path="contact-lens" element={<ContactLens />} />
        </Route>

        <Route
          path="/vendor"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <VenderDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<VendorHome />} />
          <Route path="product" element={<VendorHome />} />
          <Route path="order" element={<VendorHome />} />
          <Route path="profile" element={<UpdateVendorProfile />} />
          <Route path="faq" element={<VendorHome />} />
        </Route>

        <Route
          path="/company"
          element={
            <ProtectedRoute allowedRoles={["company"]}>
              <CompanyDashboard />
            </ProtectedRoute>

          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<CompanyHome />} />
          <Route path="services" element={<CompanyHome />} />
          <Route path="project" element={<CompanyHome />} />
          <Route path="profile" element={<UpdateCompanyProfile />} />
          <Route path="team" element={<CompanyHome />} />
          <Route path="faq" element={<CompanyHome />} />
        </Route>


        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes >
  );
}

export default App;
