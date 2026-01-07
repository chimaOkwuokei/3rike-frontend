import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from "@/components/ui/layout";
import { CreateAccountForm, ForgotPasswordEmailForm, ForgotPasswordPhoneForm, Landing, LoginForm, NoMatch, Onboarding, DriverDashboard, VerifyAccountForm, VerificationSuccess, VerificationFailed, VerificationFailedForm, LoanDashboard, LoanRequestSuccess, LoanNotification, SavingsOnboarding, SavingsDashboard, Loan, Savings, Verification, SavingsTargetDashboard, SavingsTargetForm, } from "./pages";

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

            {/* Verification routes */}
            <Route path="verification" element={<Verification />}>
              <Route index element={<VerifyAccountForm />} />
              <Route path="success" element={<VerificationSuccess />} />
              <Route path="failed" element={<VerificationFailed />} />
              <Route path="retry" element={<VerificationFailedForm />} />
            </Route>

            {/* Loan routes */}
            <Route path="loan" element={<Loan />}>
              <Route index element={<LoanDashboard />} />
              <Route path="submitted" element={<LoanRequestSuccess />} />
              <Route path="notification" element={<LoanNotification />} />
            </Route>

            {/* Savings route */}
            <Route path="savings" element={<Savings />}>
              <Route index element={<SavingsOnboarding />} />
              <Route path="dashboard" element={<SavingsDashboard />} />
              <Route path="target" element={<SavingsTargetDashboard />} />
              <Route path="create-target" element={<SavingsTargetForm />} />
            </Route>

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
