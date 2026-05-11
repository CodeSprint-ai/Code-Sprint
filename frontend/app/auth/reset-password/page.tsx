"use client";

import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ResetPasswordContent = () => {
    return <ResetPasswordForm />;
};

const ResetPassword = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-brand-dark">
                <Skeleton className="w-8 h-8 rounded-full" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
};

export default ResetPassword;
