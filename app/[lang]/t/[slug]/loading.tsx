export default function Loading() {
  return (
    <div className="pt-9 animate-pulse">
      {/* Breadcrumb */}
      <div className="mb-7">
        <div className="h-4 w-48 bg-bg-2 rounded mb-2" />
        <div className="h-3 w-32 bg-bg-2 rounded ml-[18px]" />
      </div>

      {/* Tool header */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 py-6 border-y border-line mb-7">
        <div>
          <div className="h-8 w-10 bg-bg-2 rounded mb-3" />
          <div className="h-3 w-24 bg-bg-2 rounded mb-3" />
          <div className="h-9 w-2/3 bg-bg-2 rounded mb-3" />
          <div className="h-4 w-full max-w-[60ch] bg-bg-2 rounded mb-2" />
          <div className="h-4 w-3/4 max-w-[45ch] bg-bg-2 rounded mb-5" />
          <div className="flex gap-2">
            <div className="h-8 w-24 bg-bg-2 rounded" />
            <div className="h-8 w-24 bg-bg-2 rounded" />
          </div>
        </div>
        <div className="h-32 w-56 bg-bg-2 rounded" />
      </div>

      {/* Workspace skeleton */}
      <div className="border border-line min-h-[420px] bg-bg-1" />
    </div>
  );
}
