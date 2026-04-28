"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md px-6 text-center">
        <div className="font-display text-accent mb-4 text-6xl">500</div>
        <h1 className="text-display-lg text-text-primary mb-4">Something went wrong</h1>
        <p className="text-text-secondary mb-8">An unexpected error occurred. Please try again.</p>
        <button onClick={reset} className="btn-primary">
          Try again
        </button>
      </div>
    </div>
  );
}
