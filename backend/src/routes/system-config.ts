import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

// Obtener todas las configuraciones
router.get('/', async (req, res) => {
  try {
    const configs = await prisma.systemConfig.findMany({
      orderBy: { key: 'asc' },
    });
    res.json(configs);
  } catch (error) {
    console.error('Error fetching system configs:', error);
    res.status(500).json({ error: 'Error al obtener configuraciones' });
  }
});

// Obtener configuración por clave
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const config = await prisma.systemConfig.findUnique({
      where: { key },
    });

    if (!config) {
      return res.status(404).json({ error: 'Configuración no encontrada' });
    }

    res.json(config);
  } catch (error) {
    console.error('Error fetching system config:', error);
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
});

// Crear configuración
router.post('/', async (req, res) => {
  try {
    const { key, value, description } = req.body;

    const config = await prisma.systemConfig.create({
      data: {
        key,
        value,
        description,
      },
    });

    res.status(201).json(config);
  } catch (error) {
    console.error('Error creating system config:', error);
    res.status(500).json({ error: 'Error al crear configuración' });
  }
});

// Actualizar configuración
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { value, description } = req.body;

    const config = await prisma.systemConfig.update({
      where: { id: parseInt(id) },
      data: {
        value,
        description,
      },
    });

    res.json(config);
  } catch (error) {
    console.error('Error updating system config:', error);
    res.status(500).json({ error: 'Error al actualizar configuración' });
  }
});

// Eliminar configuración
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.systemConfig.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Configuración eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting system config:', error);
    res.status(500).json({ error: 'Error al eliminar configuración' });
  }
});

export default router;
