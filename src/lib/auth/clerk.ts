import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../db/prisma";

export async function getOrcreateprismaUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const email = clerkUser.primaryEmailAddress?.emailAddress
    ?.trim()
    .toLowerCase();

  if (!email) {
    throw new Error("Authenticated clerk user had no primary email.");
  }

  const clerkUserId = clerkUser.id;

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join("") || null;

  const existingClerkuser = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (existingClerkuser) {
    return prisma.user.update({
      where: { id: existingClerkuser.id },
      data: {
        email,
        name,
      },
    });
  }

  const existingEmailuser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingEmailuser) {
    return prisma.user.update({
      where: { id: existingEmailuser.id },
      data: {
        clerkUserId,
        name: name ?? existingEmailuser.name,
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
