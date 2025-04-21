export function Spinner({ size = "md" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}
      role="status"
      aria-label="Loading">
      <span className="sr-only">Loading...</span>
    </div>
  );
}
