"use client";

import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import React, { Suspense } from "react";

const ResetPasswordContent = () => {
    return <ResetPasswordForm />;
};

const ResetPassword = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-brand-dark">
                <div className="animate-spin w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
};

export default ResetPassword;
