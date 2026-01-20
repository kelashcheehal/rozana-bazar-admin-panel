import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-[200px]" />
                    <Skeleton className="h-4 w-[300px]" />
                </div>
                <Skeleton className="h-10 w-[120px]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                ))}
            </div>

            <div className="space-y-4">
                <Skeleton className="h-[400px] w-full" />
            </div>
        </div>
    );
}
