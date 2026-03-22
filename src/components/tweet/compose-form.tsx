"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createTweet } from "@/app/actions/tweet-actions";
import { MAX_TWEET_LENGTH } from "@/lib/validators";

interface ComposeFormProps {
  parentId?: string;
  quoteTweetId?: string;
  placeholder?: string;
  onSuccess?: () => void;
}

export function ComposeForm({
  parentId,
  quoteTweetId,
  placeholder = "What's happening?",
  onSuccess,
}: ComposeFormProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const remaining = MAX_TWEET_LENGTH - content.length;
  const isOverLimit = remaining < 0;
  const isEmpty = content.trim().length === 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isEmpty || isOverLimit) return;

    setError("");
    startTransition(async () => {
      const result = await createTweet({ content, parentId, quoteTweetId });
      if (result.success) {
        setContent("");
        onSuccess?.();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="border-b p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, MAX_TWEET_LENGTH))}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none bg-transparent text-lg outline-none placeholder:text-muted-foreground"
      />
      <div className="flex items-center justify-between pt-2">
        <span
          className={`text-sm ${
            remaining <= 20
              ? remaining < 0
                ? "text-destructive font-bold"
                : "text-orange-500"
              : "text-muted-foreground"
          }`}
        >
          {remaining}
        </span>
        {error && <span className="text-sm text-destructive">{error}</span>}
        <Button type="submit" disabled={isEmpty || isOverLimit || isPending} size="sm">
          {isPending ? "Posting..." : parentId ? "Reply" : "Post"}
        </Button>
      </div>
    </form>
  );
}
