import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

// Obtener catálogos por tipo (con query param)
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;

    const where: any = {};
    if (type) {
      where.type = type as string;
    }

    const catalogs = await prisma.catalog.findMany({
      where: {
        ...where,
        isActive: true,
      },
      orderBy: { name: 'asc' },
    });

    res.json(catalogs);
  } catch (error) {
    console.error('Error fetching catalogs:', error);
    res.status(500).json({ error: 'Error al obtener catálogos' });
  }
});

// Obtener catálogo por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const catalog = await prisma.catalog.findUnique({
      where: { id: parseInt(id) },
    });

    if (!catalog) {
      return res.status(404).json({ error: 'Catálogo no encontrado' });
    }

    res.json(catalog);
  } catch (error) {
    console.error('Error fetching catalog:', error);
    res.status(500).json({ error: 'Error al obtener catálogo' });
  }
});

// Crear nuevo elemento de catálogo
router.post('/', async (req, res) => {
  try {
    const { type, name, description, isActive } = req.body;

    const catalog = await prisma.catalog.create({
      data: {
        type,
        name,
        description,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    res.status(201).json(catalog);
  } catch (error) {
    console.error('Error creating catalog:', error);
    res.status(500).json({ error: 'Error al crear catálogo' });
  }
});

// Actualizar catálogo
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, name, description, isActive } = req.body;

    const catalog = await prisma.catalog.update({
      where: { id: parseInt(id) },
      data: {
        type,
        name,
        description,
        isActive,
      },
    });

    res.json(catalog);
  } catch (error) {
    console.error('Error updating catalog:', error);
    res.status(500).json({ error: 'Error al actualizar catálogo' });
  }
});

// Eliminar catálogo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.catalog.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Catálogo eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting catalog:', error);
    res.status(500).json({ error: 'Error al eliminar catálogo' });
  }
});

export default router;
