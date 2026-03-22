import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function ActivityPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const activities = await db.activity.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Fetch actor details and tweet previews
  const actorIds = [...new Set(activities.map((a) => a.actorId))];
  const tweetIds = [...new Set(activities.filter((a) => a.tweetId).map((a) => a.tweetId!))];

  const [actors, tweets] = await Promise.all([
    db.user.findMany({
      where: { id: { in: actorIds } },
      select: { id: true, name: true, avatarUrl: true },
    }),
    db.tweet.findMany({
      where: { id: { in: tweetIds } },
      select: { id: true, content: true },
    }),
  ]);

  const actorMap = new Map(actors.map((a) => [a.id, a]));
  const tweetMap = new Map(tweets.map((t) => [t.id, t]));

  function typeLabel(type: string) {
    switch (type) {
      case "like": return "liked your tweet";
      case "reply": return "replied to your tweet";
      case "quote": return "quoted your tweet";
      default: return "interacted with your tweet";
    }
  }

  return (
    <div>
      <div className="border-b px-4 py-3">
        <h1 className="text-xl font-bold">Activity</h1>
      </div>
      {activities.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          <p>No activity yet. Post some tweets and get engagement!</p>
        </div>
      ) : (
        activities.map((activity) => {
          const actor = actorMap.get(activity.actorId);
          const tweet = activity.tweetId ? tweetMap.get(activity.tweetId) : null;
          if (!actor) return null;

          return (
            <div key={activity.id} className="border-b px-4 py-3 hover:bg-muted/50">
              <div className="flex items-start gap-3">
                <Link href={`/profile/${actor.id}`}>
                  <img
                    src={actor.avatarUrl}
                    alt={actor.name}
                    className="h-8 w-8 rounded-full bg-muted"
                  />
                </Link>
                <div>
                  <p className="text-sm">
                    <Link href={`/profile/${actor.id}`} className="font-bold hover:underline">
                      {actor.name}
                    </Link>{" "}
                    {typeLabel(activity.type)}
                  </p>
                  {tweet && (
                    <Link
                      href={`/tweet/${tweet.id}`}
                      className="mt-1 block text-sm text-muted-foreground hover:underline"
                    >
                      {tweet.content.length > 100
                        ? tweet.content.slice(0, 100) + "..."
                        : tweet.content}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
