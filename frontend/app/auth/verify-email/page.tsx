import VerifyEmailContent from "@/components/forms/VerifyEmailContent";
import React, { Suspense } from "react";

const VerifyEmailLoading = () => (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <div className="animate-spin w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full" />
    </div>
);

const VerifyEmail = () => {
    return (
        <Suspense fallback={<VerifyEmailLoading />}>
            <VerifyEmailContent />
        </Suspense>
    );
};

export default VerifyEmail;
