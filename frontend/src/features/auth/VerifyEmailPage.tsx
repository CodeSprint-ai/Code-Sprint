import VerifyEmailContent from "./components/VerifyEmailContent";
import React, { Suspense } from "react";
import { Skeleton } from "@/features/shared/components/ui/skeleton";

const VerifyEmailLoading = () => (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <Skeleton className="w-8 h-8 rounded-full" />
    </div>
);

const VerifyEmailPage = () => {
    return (
        <Suspense fallback={<VerifyEmailLoading />}>
            <VerifyEmailContent />
        </Suspense>
    );
};

export default VerifyEmailPage;
