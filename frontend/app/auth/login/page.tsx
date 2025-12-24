import LoginForm from "@/components/forms/LoginForm";
import AuthContainer from "@/containers/AuthContainer";
import React from "react";

const Login = () => {
  return (
    <AuthContainer>
      <LoginForm />
    </AuthContainer>
  );
};

export default Login;
