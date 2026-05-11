import VerifyEmailContent from "@/components/forms/VerifyEmailContent";
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const VerifyEmailLoading = () => (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <Skeleton className="w-8 h-8 rounded-full" />
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
