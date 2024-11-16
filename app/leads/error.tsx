'use client';

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="text-lg font-semibold">
        {error.message || "Something went wrong!"}
      </h2>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
} 