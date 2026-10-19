interface SkeletonProps {
    className?: string;
}

export default function Skeleton({ className = "" }: SkeletonProps) {
    return <div aria-hidden="true" className={`animate-pulse bg-admin-active-bg ${className}`} />;
}
