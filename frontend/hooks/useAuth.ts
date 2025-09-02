"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store"
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {login, logout} from "@/redux/slices/authSlice";

export default function useAuth() {
    const { accessToken }: any = useSelector((s: RootState) => s.auth);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        let token = accessToken;
        // console.log("token", token)

        // If no token in Redux, try cookies
        if (!token) {
            const cookieToken = Cookies.get("accessToken");
            const cookieRefresh = Cookies.get("refreshToken");
            const cookieUser = Cookies.get("user"); // optional if you also set user info in cookies

            // console.log("cookieToken", cookieToken)
            // console.log("cookieRefresh", cookieRefresh)
            // console.log("cookieUser", cookieUser)

            if (cookieToken && cookieRefresh) {
                dispatch(
                    login({
                        accessToken: cookieToken,
                        refreshToken: cookieRefresh,
                        user: cookieUser ? JSON.parse(cookieUser) : null,
                    })
                );
                token = cookieToken;
            }
        }

        // If still no token, redirect
        if (!token) {
            dispatch(logout()); // make sure state is clean
            router.replace("/login");
        }
    }, [accessToken, dispatch, router]);
}
