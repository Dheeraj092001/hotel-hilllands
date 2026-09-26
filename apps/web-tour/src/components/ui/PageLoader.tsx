export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cloud" aria-label="Loading">
      <div className="flex flex-col items-center gap-5">
        {/* Mountain silhouette loader */}
        <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            d="M0 32L12 8L20 18L28 4L40 20L48 32H0Z"
            fill="#173B2B"
            className="animate-pulse"
          />
        </svg>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-pine animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}