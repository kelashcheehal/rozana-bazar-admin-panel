"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log the error to an analytics service
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-2 text-center">
                <AlertCircle className="h-10 w-10 text-red-500" />
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    Something went wrong!
                </h2>
                <p className="text-gray-500">
                    {error.message || "An unexpected error occurred while loading this page."}
                </p>
            </div>
            <Button onClick={() => reset()} variant="default">
                Try again
            </Button>
        </div>
    );
}
