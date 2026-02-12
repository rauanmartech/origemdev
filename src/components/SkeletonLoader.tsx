import { Skeleton } from "@/components/ui/skeleton";

export const ProjectSkeleton = () => {
    return (
        <div className="clay-card h-full flex flex-col overflow-hidden relative">
            <Skeleton className="w-full aspect-video rounded-t-3xl" />
            <div className="p-6 flex flex-col flex-1 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-20 w-full" />
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                </div>
            </div>
        </div>
    );
};
