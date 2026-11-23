import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../db/prisma";

export async function getOrCreatePrismaUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) return null;

  const email = clerkUser.primaryEmailAddress?.emailAddress
    ?.trim()
    .toLowerCase();

  if (!email) {
    throw new Error("Authenticated Clerk user has no primary email.");
  }

  const clerkUserId = clerkUser.id;
  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;

  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (existingUser) {
    return prisma.user.update({
      where: { id: existingUser.id },
      data: { email, name },
    });
  }

  const emailUser = await prisma.user.findUnique({
    where: { email },
  });

  if (emailUser) {
    return prisma.user.update({
      where: { id: emailUser.id },
      data: {
        clerkUserId,
        name: name ?? emailUser.name,
      },
    });
  }

  return prisma.user.create({
    data: {
      clerkUserId,
      email,
      name,
      role: "USER",
    },
  });
}
