"use client";

import { useOptimistic, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleFollow } from "@/app/actions/social-actions";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
}

export function FollowButton({ userId, isFollowing }: FollowButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(
    { following: isFollowing },
    (state) => ({ following: !state.following })
  );

  function handleClick() {
    startTransition(async () => {
      setOptimistic(optimistic);
      await toggleFollow(userId);
    });
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      variant={optimistic.following ? "outline" : "default"}
      size="sm"
    >
      {optimistic.following ? "Unfollow" : "Follow"}
    </Button>
  );
}
