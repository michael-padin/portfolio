"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="text-6xl font-display text-accent mb-4">500</div>
        <h1 className="text-display-lg text-text-primary mb-4">Something went wrong</h1>
        <p className="text-text-secondary mb-8">An unexpected error occurred. Please try again.</p>
        <button onClick={reset} className="btn-primary">
          Try again
        </button>
      </div>
    </div>
  );
}
