/** Placeholder shown before localStorage has been read, so server and client render the same HTML. */
export default function Skeleton({ label = "Loading your sessions" }: { label?: string }) {
  return (
    <div role="status">
      <span className="sr-only">{label}</span>
      <div aria-hidden className="animate-pulse space-y-6">
        <div className="h-24 bg-ln-muted/20" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-ln-muted/20" />
          <div className="h-32 bg-ln-muted/20" />
        </div>
        <div className="h-48 bg-ln-muted/20" />
      </div>
    </div>
  );
}
