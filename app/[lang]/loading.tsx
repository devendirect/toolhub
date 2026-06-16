export default function Loading() {
  return (
    <div className="pt-10 animate-pulse">
      {/* Hero skeleton */}
      <div className="mb-14">
        <div className="relative p-9 border border-line bg-bg-1 min-h-[260px]">
          <div className="h-3 w-24 bg-bg-2 rounded mb-5" />
          <div className="h-10 w-2/3 bg-bg-2 rounded mb-4" />
          <div className="h-4 w-full max-w-[60ch] bg-bg-2 rounded mb-2" />
          <div className="h-4 w-3/4 max-w-[50ch] bg-bg-2 rounded mb-7" />
          <div className="h-[50px] w-full bg-bg-2 rounded" />
        </div>
      </div>

      {/* Cards grid skeleton */}
      <div className="grid grid-cols-3 border border-line">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-[22px] border-r border-b border-line min-h-[180px]">
            <div className="h-6 w-10 bg-bg-2 rounded mb-4" />
            <div className="h-4 w-3/4 bg-bg-2 rounded mb-2" />
            <div className="h-3 w-full bg-bg-2 rounded mb-1" />
            <div className="h-3 w-2/3 bg-bg-2 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
