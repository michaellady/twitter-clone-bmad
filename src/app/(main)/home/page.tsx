import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ComposeForm } from "@/components/tweet/compose-form";
import { TweetCard } from "@/components/tweet/tweet-card";
import { FollowButton } from "@/components/social/follow-button";

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const following = await db.follow.findMany({
    where: { followerId: session.user.id },
    select: { followingId: true },
  });

  const followingIds = following.map((f) => f.followingId);

  const tweets = followingIds.length > 0
    ? await db.tweet.findMany({
        where: {
          authorId: { in: followingIds },
          parentId: null,
        },
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
          quoteTweet: {
            include: { author: { select: { id: true, name: true } } },
          },
          _count: { select: { replies: true, likes: true } },
          likes: { where: { userId: session.user.id }, select: { id: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      })
    : [];

  const suggestedUsers = tweets.length === 0
    ? await db.user.findMany({
        where: {
          id: { notIn: [...followingIds, session.user.id] },
        },
        select: { id: true, name: true, bio: true, avatarUrl: true },
        take: 5,
      })
    : [];

  return (
    <div>
      <div className="border-b px-4 py-3">
        <h1 className="text-xl font-bold">Home</h1>
      </div>
      <ComposeForm />
      {tweets.length === 0 ? (
        <div className="p-6">
          <p className="text-center text-muted-foreground mb-4">
            Your timeline is empty. Follow some users to see their tweets here.
          </p>
          {suggestedUsers.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3">Suggested accounts</h2>
              <div className="space-y-3">
                {suggestedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full bg-muted" />
                      <div>
                        <p className="font-bold">{user.name}</p>
                        {user.bio && <p className="text-sm text-muted-foreground">{user.bio}</p>}
                      </div>
                    </div>
                    <FollowButton userId={user.id} isFollowing={false} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        tweets.map((tweet) => (
          <TweetCard
            key={tweet.id}
            tweet={{
              ...tweet,
              likeCount: tweet._count.likes,
              isLiked: tweet.likes.length > 0,
            }}
          />
        ))
      )}
    </div>
  );
}
