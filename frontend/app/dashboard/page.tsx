// app/dashboard/page.tsx
"use client";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import api from "../../lib/axios";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const user = useSelector((s: RootState) => s.auth.user);
  const [data, setData] = useState<any>(null);

//   useEffect(() => {
//     api
//       .get("/users/me")
//       .then((r) => setData(r.data))
//       .catch(() => (window.location.href = "/login"));
//   }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}</p>
      <div>Profile data: {JSON.stringify(user)}</div>
    </div>
  );
}
