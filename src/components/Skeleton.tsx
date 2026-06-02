export function StoryCardSkeleton() {
  return (
    <div className="card-glass rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-video bg-hti-border/50" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-hti-border/50 rounded w-1/4" />
        <div className="h-5 bg-hti-border/50 rounded w-3/4" />
        <div className="h-4 bg-hti-border/50 rounded w-full" />
        <div className="h-4 bg-hti-border/50 rounded w-2/3" />
        <div className="flex items-center gap-2 pt-2">
          <div className="h-3 bg-hti-border/50 rounded w-20" />
          <div className="h-3 bg-hti-border/50 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export function StoryGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <StoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-12 bg-hti-border/30 rounded-lg w-3/4 mx-auto" />
      <div className="h-6 bg-hti-border/30 rounded w-1/2 mx-auto" />
      <div className="flex justify-center gap-4 pt-4">
        <div className="h-12 bg-hti-border/30 rounded-lg w-40" />
        <div className="h-12 bg-hti-border/30 rounded-lg w-40" />
      </div>
    </div>
  );
}

export function ReelCardSkeleton() {
  return (
    <div className="card-glass rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[9/16] bg-hti-border/50" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-hti-border/50 rounded w-3/4" />
        <div className="h-3 bg-hti-border/50 rounded w-1/3" />
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card-glass rounded-xl p-4 space-y-2">
          <div className="h-8 bg-hti-border/50 rounded w-16" />
          <div className="h-4 bg-hti-border/50 rounded w-24" />
        </div>
      ))}
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-hti-border/50 rounded w-full" />
        </td>
      ))}
    </tr>
  );
}
