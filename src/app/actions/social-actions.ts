"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ActionResult } from "@/types";

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}

export async function toggleLike(tweetId: string): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  const existing = await db.like.findUnique({
    where: { userId_tweetId: { userId: session.user.id, tweetId } },
  });

  if (existing) {
    await db.like.delete({ where: { id: existing.id } });
  } else {
    const tweet = await db.tweet.findUnique({ where: { id: tweetId } });
    if (!tweet) return { success: false, error: "Tweet not found" };

    await db.like.create({
      data: { userId: session.user.id, tweetId },
    });

    if (tweet.authorId !== session.user.id) {
      await db.activity.create({
        data: {
          type: "like",
          userId: tweet.authorId,
          actorId: session.user.id,
          tweetId,
        },
      });
    }
  }

  revalidatePath("/home");
  revalidatePath("/explore");
  return { success: true, data: undefined };
}

export async function toggleFollow(targetUserId: string): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };
  if (session.user.id === targetUserId) return { success: false, error: "Cannot follow yourself" };

  const existing = await db.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: session.user.id,
        followingId: targetUserId,
      },
    },
  });

  if (existing) {
    await db.follow.delete({ where: { id: existing.id } });
  } else {
    await db.follow.create({
      data: { followerId: session.user.id, followingId: targetUserId },
    });
  }

  revalidatePath("/home");
  revalidatePath(`/profile/${targetUserId}`);
  return { success: true, data: undefined };
}
