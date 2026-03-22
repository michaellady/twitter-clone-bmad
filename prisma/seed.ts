import path from "path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hashPassword } from "better-auth/crypto";

const dbPath = path.resolve(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const db = new PrismaClient({ adapter });

const users = [
  { name: "Alice Chen", email: "alice@example.com", bio: "Software engineer and coffee enthusiast" },
  { name: "Bob Martinez", email: "bob@example.com", bio: "Product manager by day, musician by night" },
  { name: "Carol Kim", email: "carol@example.com", bio: "UX designer | cat lover | minimalist" },
  { name: "Dave Johnson", email: "dave@example.com", bio: "Full-stack dev. Building cool things." },
  { name: "Eve Williams", email: "eve@example.com", bio: "Data scientist exploring the world of AI" },
  { name: "Frank Brown", email: "frank@example.com", bio: "DevOps engineer | automation fan" },
  { name: "Grace Lee", email: "grace@example.com", bio: "Frontend developer and accessibility advocate" },
  { name: "Henry Davis", email: "henry@example.com", bio: "Startup founder | angel investor" },
  { name: "Iris Patel", email: "iris@example.com", bio: "Mobile developer and open source contributor" },
  { name: "Jack Wilson", email: "jack@example.com", bio: "Backend engineer | distributed systems" },
];

const tweetContents = [
  "Just shipped a new feature! The feeling never gets old.",
  "Hot take: TypeScript is the best thing that happened to JavaScript.",
  "Anyone else feel like Monday mornings are actually productive?",
  "The best code is the code you never have to write.",
  "Just discovered a bug that's been in production for 6 months. Nobody noticed.",
  "Coffee count today: 4. Productivity: questionable.",
  "Pair programming is underrated. Learned so much today.",
  "Reading about distributed systems and my brain hurts in a good way.",
  "The future of development is AI-assisted, not AI-replaced.",
  "Deployed to production on a Friday. Living dangerously.",
  "Simple > clever. Every single time.",
  "Code reviews are love letters to your future self.",
  "Spent 3 hours debugging. The issue was a missing comma.",
  "React Server Components are changing how I think about architecture.",
  "Documentation is not optional. Document while you build.",
  "SQLite is seriously underrated for small-to-medium projects.",
  "Just hit 1000 commits on my side project. Small steps compound.",
  "The best meetings are the ones that could have been an async message.",
  "Learning in public is scary but worth it.",
  "Every senior dev was once a junior who didn't give up.",
  "Just tried the new Next.js features. App Router is growing on me.",
  "Tailwind CSS converted me. I was wrong to resist.",
  "Testing is not about finding bugs. It's about building confidence.",
  "The best architecture is the one your team can understand.",
  "Shipping > perfecting. You can always iterate.",
  "Dark mode isn't a feature, it's a lifestyle.",
  "Just mentored a junior dev today. Reminded me why I love this field.",
  "Refactoring old code is like archaeology. Fascinating and terrifying.",
  "APIs should be boring. Boring is reliable.",
  "Weekend project turned into a weekend of debugging. Classic.",
];

async function seed() {
  console.log("Seeding database...");

  // Create users with Better Auth compatible accounts
  const createdUsers = [];
  for (const userData of users) {
    const user = await db.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        bio: userData.bio,
        emailVerified: true,
      },
    });

    // Create credential account using Better Auth's password hasher
    const hashedPassword = await hashPassword("password123");
    await db.account.create({
      data: {
        accountId: user.id,
        providerId: "credential",
        userId: user.id,
        password: hashedPassword,
      },
    });

    createdUsers.push(user);
  }

  // Create tweets
  const createdTweets = [];
  for (let i = 0; i < tweetContents.length; i++) {
    const author = createdUsers[i % createdUsers.length];
    const tweet = await db.tweet.create({
      data: {
        content: tweetContents[i],
        authorId: author.id,
        createdAt: new Date(Date.now() - (tweetContents.length - i) * 3600000),
      },
    });
    createdTweets.push(tweet);
  }

  // Create some reply threads
  const replies = [
    { content: "Couldn't agree more!", parentIdx: 0, authorIdx: 2 },
    { content: "This is so true. Simple wins every time.", parentIdx: 10, authorIdx: 4 },
    { content: "I had the same experience last week!", parentIdx: 12, authorIdx: 1 },
    { content: "The comma strikes again 😄", parentIdx: 12, authorIdx: 5 },
    { content: "React Server Components are game changing.", parentIdx: 13, authorIdx: 3 },
    { content: "SQLite + Prisma is my go-to now.", parentIdx: 15, authorIdx: 6 },
  ];

  for (const reply of replies) {
    await db.tweet.create({
      data: {
        content: reply.content,
        authorId: createdUsers[reply.authorIdx].id,
        parentId: createdTweets[reply.parentIdx].id,
      },
    });
  }

  // Create follows (build a social graph)
  const followPairs = [
    [0, 1], [0, 2], [0, 3], [1, 0], [1, 4], [2, 0], [2, 5],
    [3, 0], [3, 1], [3, 6], [4, 2], [4, 7], [5, 0], [5, 3],
    [6, 1], [6, 8], [7, 0], [7, 9], [8, 2], [9, 4],
  ];

  for (const [followerIdx, followingIdx] of followPairs) {
    await db.follow.create({
      data: {
        followerId: createdUsers[followerIdx].id,
        followingId: createdUsers[followingIdx].id,
      },
    });
  }

  // Create likes
  const likePairs = [
    [0, 1], [0, 5], [1, 0], [1, 10], [2, 3], [2, 15],
    [3, 0], [3, 8], [4, 12], [5, 0], [5, 20], [6, 10],
    [7, 1], [8, 5], [9, 0], [9, 15],
  ];

  for (const [userIdx, tweetIdx] of likePairs) {
    if (createdTweets[tweetIdx]) {
      await db.like.create({
        data: {
          userId: createdUsers[userIdx].id,
          tweetId: createdTweets[tweetIdx].id,
        },
      });
    }
  }

  console.log(`Seeded: ${createdUsers.length} users, ${createdTweets.length + replies.length} tweets, ${followPairs.length} follows, ${likePairs.length} likes`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
