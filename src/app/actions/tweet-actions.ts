"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { tweetSchema } from "@/lib/validators";
import type { ActionResult } from "@/types";

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}

export async function createTweet(formData: {
  content: string;
  parentId?: string;
  quoteTweetId?: string;
}): Promise<ActionResult<{ id: string }>> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  const parsed = tweetSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const tweet = await db.tweet.create({
    data: {
      content: parsed.data.content,
      authorId: session.user.id,
      parentId: parsed.data.parentId || null,
      quoteTweetId: parsed.data.quoteTweetId || null,
    },
  });

  revalidatePath("/home");
  revalidatePath("/explore");

  return { success: true, data: { id: tweet.id } };
}
