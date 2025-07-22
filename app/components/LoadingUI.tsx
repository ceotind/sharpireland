export default function LoadingUI() {
  return (
    <div className="min-h-screen bg-[var(--bg-100)] flex items-center justify-center">
      <div className="animate-pulse text-[var(--text-100)]">
        Loading content...
      </div>
    </div>
  );
}