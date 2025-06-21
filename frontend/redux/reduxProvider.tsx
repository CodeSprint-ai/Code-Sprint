'use client';

import { Provider } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { restore } from "./slices/authSlice";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(restore());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
