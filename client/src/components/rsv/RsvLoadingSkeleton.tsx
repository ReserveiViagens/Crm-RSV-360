import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export type RsvSkeletonVariant = "card" | "text-line" | "avatar" | "metric" | "list-item";

export interface RsvLoadingSkeletonProps {
  variant?: RsvSkeletonVariant;
  count?: number;
  className?: string;
  "data-testid"?: string;
}

function CardSkeleton({ testId }: { testId: string }) {
  return (
    <div
      data-testid={`${testId}-card`}
      className="rounded-card border border-border bg-[var(--surface-card)] p-4 flex flex-col gap-3"
    >
      <Skeleton className="w-full h-40 rounded-control" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-8 flex-1 rounded-control" />
        <Skeleton className="h-8 w-20 rounded-control" />
      </div>
    </div>
  );
}

function MetricSkeleton({ testId }: { testId: string }) {
  return (
    <div
      data-testid={`${testId}-metric`}
      className="rounded-card border border-border bg-[var(--surface-card)] p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="w-9 h-9 rounded-control" />
      </div>
      <Skeleton className="h-8 w-28" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

function TextLineSkeleton({ testId }: { testId: string }) {
  return (
    <div
      data-testid={`${testId}-text-line`}
      className="flex flex-col gap-2"
    >
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  );
}

function AvatarSkeleton({ testId }: { testId: string }) {
  return (
    <div
      data-testid={`${testId}-avatar`}
      className="flex items-center gap-3"
    >
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

function ListItemSkeleton({ testId }: { testId: string }) {
  return (
    <div
      data-testid={`${testId}-list-item`}
      className="flex items-center gap-3 py-3 border-b border-border last:border-none"
    >
      <Skeleton className="w-10 h-10 rounded-control shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-6 w-16 rounded-control shrink-0" />
    </div>
  );
}

const variantMap: Record<RsvSkeletonVariant, (testId: string) => React.ReactNode> = {
  card: (id) => <CardSkeleton testId={id} />,
  metric: (id) => <MetricSkeleton testId={id} />,
  "text-line": (id) => <TextLineSkeleton testId={id} />,
  avatar: (id) => <AvatarSkeleton testId={id} />,
  "list-item": (id) => <ListItemSkeleton testId={id} />,
};

export function RsvLoadingSkeleton({
  variant = "card",
  count = 1,
  className,
  "data-testid": testId = "rsv-loading-skeleton",
}: RsvLoadingSkeletonProps) {
  const render = variantMap[variant];

  return (
    <div
      data-testid={testId}
      className={cn(
        variant === "card" || variant === "metric"
          ? "grid gap-4"
          : "flex flex-col gap-3",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>{render(`${testId}-${i}`)}</React.Fragment>
      ))}
    </div>
  );
}
