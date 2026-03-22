import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TweetCard } from "@/components/tweet/tweet-card";
import { ComposeForm } from "@/components/tweet/compose-form";

export default async function TweetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);

  const tweet = await db.tweet.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
      quoteTweet: {
        include: { author: { select: { id: true, name: true } } },
      },
      _count: { select: { replies: true, likes: true } },
      ...(session
        ? { likes: { where: { userId: session.user.id }, select: { id: true } } }
        : {}),
      parent: {
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
          _count: { select: { replies: true, likes: true } },
          ...(session
            ? { likes: { where: { userId: session.user.id }, select: { id: true } } }
            : {}),
        },
      },
    },
  });

  if (!tweet) notFound();

  const replies = await db.tweet.findMany({
    where: { parentId: id },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
      quoteTweet: {
        include: { author: { select: { id: true, name: true } } },
      },
      _count: { select: { replies: true, likes: true } },
      ...(session
        ? { likes: { where: { userId: session.user.id }, select: { id: true } } }
        : {}),
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <div className="border-b px-4 py-3">
        <h1 className="text-xl font-bold">Thread</h1>
      </div>

      {tweet.parent && (
        <div className="opacity-75">
          <TweetCard
            tweet={{
              ...tweet.parent,
              likeCount: tweet.parent._count.likes,
              isLiked: "likes" in tweet.parent && Array.isArray(tweet.parent.likes)
                ? tweet.parent.likes.length > 0
                : false,
            }}
          />
        </div>
      )}

      <TweetCard
        tweet={{
          ...tweet,
          likeCount: tweet._count.likes,
          isLiked: "likes" in tweet && Array.isArray(tweet.likes)
            ? tweet.likes.length > 0
            : false,
        }}
      />

      {session && (
        <ComposeForm parentId={id} placeholder="Post your reply..." />
      )}

      {replies.length > 0 && (
        <div>
          <div className="border-b px-4 py-2">
            <h2 className="text-sm font-bold text-muted-foreground">Replies</h2>
          </div>
          {replies.map((reply) => (
            <TweetCard
              key={reply.id}
              tweet={{
                ...reply,
                likeCount: reply._count.likes,
                isLiked: "likes" in reply && Array.isArray(reply.likes)
                  ? reply.likes.length > 0
                  : false,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
