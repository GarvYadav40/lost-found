import prisma from '../config/db.js';

// GET /api/users/me
// Returns current authenticated user and their stats
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const [totalPosts, lostPosts, foundPosts] = await Promise.all([
      prisma.item.count({ where: { userId } }),
      prisma.item.count({ where: { userId, status: 'Lost' } }),
      prisma.item.count({ where: { userId, status: 'Found' } }),
    ]);

    return res.json({
      id: req.user.id,
      clerkId: req.user.clerkId,
      name: req.user.name,
      email: req.user.email,
      imageUrl: req.user.imageUrl,
      createdAt: req.user.createdAt,
      stats: {
        totalPosts,
        lostPosts,
        foundPosts,
      },
    });
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    return res.status(500).json({ error: 'Internal server error fetching profile data' });
  }
};

// GET /api/dashboard/items
// Returns all items posted by the current user
export const getDashboardItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const items = await prisma.item.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            clerkId: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    });

    return res.json(items);
  } catch (error) {
    console.error('Error fetching dashboard items:', error);
    return res.status(500).json({ error: 'Internal server error fetching dashboard items' });
  }
};
