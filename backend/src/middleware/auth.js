import { getAuth, clerkClient } from '@clerk/express';
import prisma from '../config/db.js';

export const syncAndRequireAuth = async (req, res, next) => {
  console.log("Authorization:", req.headers.authorization);
  //const { userId } = getAuth(req);
  const auth = getAuth(req);

 console.log("AUTH OBJECT:", auth);

  const { userId } = auth;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: No active session' });
  }

  try {
    console.log("Incoming Clerk userId:", userId);

let dbUser = await prisma.user.findUnique({
  where: {
    clerkId: userId,
  },
});

console.log("Found dbUser:", dbUser);

    if (!dbUser) {
      // User not in DB, sync from Clerk
      const clerkUser = await clerkClient.users.getUser(userId);
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      if (!email) {
        return res.status(400).json({ error: 'User must have a primary email address' });
      }

      const name =
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
        clerkUser.username ||
        email.split('@')[0];
      
      const imageUrl = clerkUser.imageUrl;

      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          name,
          email,
          imageUrl,
        },
      });
      console.log(`Successfully synced and created user in local database: ${email}`);
    }

    req.user = dbUser;
    next();
  } catch (error) {
    console.error('Authentication & Sync Error:', error);
    return res.status(500).json({ error: 'Failed to authenticate and sync user details' });
  }
};

export const optionalAuth = async (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return next();
  }

  try {
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      const clerkUser = await clerkClient.users.getUser(userId);
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      if (email) {
        const name =
          [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
          clerkUser.username ||
          email.split('@')[0];
        
        const imageUrl = clerkUser.imageUrl;

        dbUser = await prisma.user.create({
          data: {
            clerkId: userId,
            name,
            email,
            imageUrl,
          },
        });
      }
    }
    req.user = dbUser;
  } catch (error) {
    console.error('Error in optional authentication sync:', error);
  }
  next();
};
