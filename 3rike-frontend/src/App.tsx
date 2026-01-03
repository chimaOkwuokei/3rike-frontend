import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from "@/components/ui/layout";
import { CreateAccountForm, ForgotPasswordEmailForm, ForgotPasswordPhoneForm, Landing, LoginForm, NoMatch, Onboarding, DriverDashboard, VerifyAccountForm, VerificationSuccess, VerificationFailed, } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: "Geist" }}>
        <Routes>

          {/* auth */}
          <Route path="/create-account-rider" element={<CreateAccountForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/forgot-password-phone" element={<ForgotPasswordPhoneForm />} />
          <Route path="/forgot-password-email" element={<ForgotPasswordEmailForm />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Shared layout (Navbar + Footer are inside Layout) */}
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
          </Route>

          {/* Driver */}
          <Route path="/driver">
            <Route index element={<DriverDashboard />} />
            <Route path="verification" element={<VerifyAccountForm />} />
            <Route path="verification-success" element={<VerificationSuccess />} />
            <Route path="verification-failed" element={<VerificationFailed/>} />
            <Route path="*" element={<NoMatch />} />
          </Route>


          {/* Using path="*"" means "match anything", so this route
          acts like a catch-all for URLs that we don't have explicit
          routes for. */}
          <Route path="*" element={<NoMatch />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
