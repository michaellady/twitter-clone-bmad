import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TweetCard } from "@/components/tweet/tweet-card";
import { FollowButton } from "@/components/social/follow-button";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  const user = await db.user.findUnique({
    where: { id },
  });

  if (!user) notFound();

  const tweets = await db.tweet.findMany({
    where: { authorId: id, parentId: null },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
      quoteTweet: {
        include: { author: { select: { id: true, name: true } } },
      },
      _count: { select: { replies: true, likes: true } },
      likes: session
        ? { where: { userId: session.user.id }, select: { id: true } }
        : false,
    },
    orderBy: { createdAt: "desc" },
  });

  const isOwnProfile = session?.user.id === id;
  const isFollowing = session
    ? !!(await db.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: session.user.id,
            followingId: id,
          },
        },
      }))
    : false;

  return (
    <div>
      <div className="border-b px-4 py-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-16 w-16 rounded-full bg-muted"
            />
            <div>
              <h1 className="text-xl font-bold">{user.name}</h1>
              {user.bio && <p className="mt-1 text-muted-foreground">{user.bio}</p>}
            </div>
          </div>
          {session && !isOwnProfile && (
            <FollowButton userId={id} isFollowing={isFollowing} />
          )}
        </div>
      </div>

      {tweets.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          <p>No tweets yet.</p>
        </div>
      ) : (
        tweets.map((tweet) => (
          <TweetCard
            key={tweet.id}
            tweet={{
              ...tweet,
              likeCount: tweet._count.likes,
              isLiked: Array.isArray(tweet.likes) ? tweet.likes.length > 0 : false,
            }}
          />
        ))
      )}
    </div>
  );
}
