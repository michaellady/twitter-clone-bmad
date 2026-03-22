import { z } from "zod";

export const MAX_TWEET_LENGTH = 280;

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const tweetSchema = z.object({
  content: z
    .string()
    .min(1, "Tweet cannot be empty")
    .max(MAX_TWEET_LENGTH, `Tweet cannot exceed ${MAX_TWEET_LENGTH} characters`),
  parentId: z.string().optional(),
  quoteTweetId: z.string().optional(),
});
