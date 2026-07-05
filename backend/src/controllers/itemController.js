import prisma from '../config/db.js';

// GET /api/items
// Supports: search, status, category, sort, page
export const getItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const { search, status, category, sort } = req.query;

    const where = {};

    if (status) {
      where.status = status;
    }
    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy = {};
    if (sort === 'oldest') {
      orderBy.createdAt = 'asc';
    } else {
      orderBy.createdAt = 'desc'; // Default to newest
    }

    const [items, totalItems] = await Promise.all([
      prisma.item.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              imageUrl: true,
            },
          },
        },
      }),
      prisma.item.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return res.json({
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return res.status(500).json({ error: 'Internal server error fetching items' });
  }
};

// GET /api/items/:id
export const getItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const itemId = parseInt(id);
    if (isNaN(itemId)) {
      return res.status(400).json({ error: 'Invalid item ID format' });
    }

    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
            createdAt: true,
          },
        },
      },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    return res.json(item);
  } catch (error) {
    console.error('Error fetching item details:', error);
    return res.status(500).json({ error: 'Internal server error fetching item' });
  }
};

// POST /api/items
export const createItem = async (req, res) => {
  const { title, description, category, status, imageUrl, location, date, contactInfo } = req.body;

  try {
    const item = await prisma.item.create({
      data: {
        title,
        description,
        category,
        status,
        imageUrl: imageUrl || null,
        location,
        date: new Date(date),
        contactInfo,
        userId: req.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    });

    return res.status(201).json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    return res.status(500).json({ error: 'Internal server error creating item' });
  }
};

// PUT /api/items/:id
export const updateItem = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, status, imageUrl, location, date, contactInfo } = req.body;

  try {
    const itemId = parseInt(id);
    if (isNaN(itemId)) {
      return res.status(400).json({ error: 'Invalid item ID format' });
    }

    const existingItem = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Authorization check
    if (existingItem.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You do not own this item post' });
    }

    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: {
        title,
        description,
        category,
        status,
        imageUrl: imageUrl || null,
        location,
        date: new Date(date),
        contactInfo,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    });

    return res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    return res.status(500).json({ error: 'Internal server error updating item' });
  }
};

// DELETE /api/items/:id
export const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const itemId = parseInt(id);
    if (isNaN(itemId)) {
      return res.status(400).json({ error: 'Invalid item ID format' });
    }

    const existingItem = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Authorization check
    if (existingItem.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You do not own this item post' });
    }

    await prisma.item.delete({
      where: { id: itemId },
    });

    return res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return res.status(500).json({ error: 'Internal server error deleting item' });
  }
};
