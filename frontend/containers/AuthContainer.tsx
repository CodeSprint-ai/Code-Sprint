import React, { type ReactNode } from "react";

interface AuthContainerProps {
  children: ReactNode;
}

const AuthContainer = ({ children }: AuthContainerProps) => {
  return (
    <div className="w-screen h-screen flex  items-center">
        {children}
    </div>
  );
};

export default AuthContainer;
