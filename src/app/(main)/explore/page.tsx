import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TweetCard } from "@/components/tweet/tweet-card";

export default async function ExplorePage() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);

  const tweets = await db.tweet.findMany({
    where: { parentId: null },
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
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <div className="border-b px-4 py-3">
        <h1 className="text-xl font-bold">Explore</h1>
      </div>
      {!session && (
        <div className="border-b bg-muted/30 px-4 py-3 text-center">
          <p className="text-sm text-muted-foreground">
            <a href="/register" className="text-primary underline">Sign up</a> or{" "}
            <a href="/login" className="text-primary underline">log in</a> to interact with tweets.
          </p>
        </div>
      )}
      {tweets.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          <p>No tweets yet. Be the first to post!</p>
        </div>
      ) : (
        tweets.map((tweet) => (
          <TweetCard
            key={tweet.id}
            tweet={{
              ...tweet,
              likeCount: tweet._count.likes,
              isLiked: "likes" in tweet && Array.isArray(tweet.likes)
                ? tweet.likes.length > 0
                : false,
            }}
          />
        ))
      )}
    </div>
  );
}
