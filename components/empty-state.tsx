import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] p-4 text-center">
      <div className="bg-muted rounded-full p-4 mb-4">
        <Icon className="w-10 h-10 text-muted-foreground" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {/* {actionLabel && action && <Button onClick={action}>{actionLabel}</Button>} */}
    </div>
  );
}
