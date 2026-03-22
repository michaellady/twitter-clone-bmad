"use client";

import { useOptimistic, useTransition } from "react";
import { toggleLike } from "@/app/actions/social-actions";

interface LikeButtonProps {
  tweetId: string;
  likeCount: number;
  isLiked: boolean;
}

export function LikeButton({ tweetId, likeCount, isLiked }: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(
    { liked: isLiked, count: likeCount },
    (state) => ({
      liked: !state.liked,
      count: state.liked ? state.count - 1 : state.count + 1,
    })
  );

  function handleClick() {
    startTransition(async () => {
      setOptimistic(optimistic);
      await toggleLike(tweetId);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`flex items-center gap-1 text-sm transition-colors ${
        optimistic.liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
      }`}
    >
      {optimistic.liked ? "♥" : "♡"} {optimistic.count}
    </button>
  );
}
