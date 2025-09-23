import SignUpForm from "@/components/forms/SignupForm";
import AuthContainer from "@/containers/AuthContainer";
import React from "react";

const Signup = () => {
  return (
    <AuthContainer>
      <SignUpForm />
    </AuthContainer>
  );
};

export default Signup;
