// app/login/page.tsx
"use client";
import { useState } from "react";
import api from "../../lib/axios";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";

export default function LoginPage() {
  const [email, setEmail] = useState(""),
    [pw, setPw] = useState("");
  const dispatch = useDispatch();

  const handle = async () => {
    try {
      const r = await api.post("/auth/login", { email, password: pw });
      const data = (r.data as {
        data: {
          accessToken: string;
          refreshToken: string;
          user: any;
        };
      }).data;
      dispatch(
        login({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user,
        })
      );
      window.location.href = "/dashboard";
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h1>Login </h1>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      />
      <button onClick={handle}> Log in </button>
    </div>
  );
}
