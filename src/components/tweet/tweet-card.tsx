"use client";

import { useState } from "react";
import Link from "next/link";
import { ComposeForm } from "./compose-form";
import { LikeButton } from "@/components/social/like-button";

interface TweetCardProps {
  tweet: {
    id: string;
    content: string;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      avatarUrl: string;
    };
    quoteTweet?: {
      id: string;
      content: string;
      author: { id: string; name: string };
    } | null;
    _count?: {
      replies: number;
    };
    likeCount?: number;
    isLiked?: boolean;
  };
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function TweetCard({ tweet }: TweetCardProps) {
  const [showReply, setShowReply] = useState(false);
  const [showQuote, setShowQuote] = useState(false);

  return (
    <div className="border-b">
      <div className="px-4 py-3 hover:bg-muted/50 transition-colors">
        <div className="flex gap-3">
          <Link href={`/profile/${tweet.author.id}`}>
            <img
              src={tweet.author.avatarUrl}
              alt={tweet.author.name}
              className="h-10 w-10 rounded-full bg-muted"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link
                href={`/profile/${tweet.author.id}`}
                className="font-bold hover:underline truncate"
              >
                {tweet.author.name}
              </Link>
              <span className="text-sm text-muted-foreground">
                · {timeAgo(tweet.createdAt)}
              </span>
            </div>
            <Link href={`/tweet/${tweet.id}`}>
              <p className="whitespace-pre-wrap break-words">{tweet.content}</p>
            </Link>

            {tweet.quoteTweet && (
              <Link
                href={`/tweet/${tweet.quoteTweet.id}`}
                className="mt-2 block rounded-lg border p-3 hover:bg-muted/50"
              >
                <p className="text-sm font-bold">{tweet.quoteTweet.author.name}</p>
                <p className="text-sm">{tweet.quoteTweet.content}</p>
              </Link>
            )}

            <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
              <button
                onClick={() => { setShowReply(!showReply); setShowQuote(false); }}
                className="hover:text-primary"
              >
                {tweet._count?.replies ?? 0} replies
              </button>
              <button
                onClick={() => { setShowQuote(!showQuote); setShowReply(false); }}
                className="hover:text-primary"
              >
                Quote
              </button>
              <LikeButton
                tweetId={tweet.id}
                likeCount={tweet.likeCount ?? 0}
                isLiked={tweet.isLiked ?? false}
              />
            </div>
          </div>
        </div>
      </div>

      {showReply && (
        <div className="border-t bg-muted/30">
          <ComposeForm
            parentId={tweet.id}
            placeholder="Post your reply..."
            onSuccess={() => setShowReply(false)}
          />
        </div>
      )}

      {showQuote && (
        <div className="border-t bg-muted/30">
          <ComposeForm
            quoteTweetId={tweet.id}
            placeholder="Add your comment..."
            onSuccess={() => setShowQuote(false)}
          />
        </div>
      )}
    </div>
  );
}
