import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

// Obtener todas las sesiones
router.get('/', async (req, res) => {
  try {
    const { programId, limit = 1000 } = req.query;

    const where: any = {};
    if (programId) where.programId = parseInt(programId as string);

    const sessions = await prisma.session.findMany({
      where,
      take: Number(limit),
      include: {
        program: true,
        attendance: true,
      },
      orderBy: { date: 'desc' },
    });

    res.json({ sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Error al obtener sesiones' });
  }
});

// Crear sesión
router.post('/', async (req, res) => {
  try {
    const { programId, title, description, date, duration, location } = req.body;

    const session = await prisma.session.create({
      data: {
        programId,
        title,
        description,
        date: new Date(date),
        duration,
        location,
      },
      include: {
        program: true,
      },
    });

    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Error al crear sesión' });
  }
});

// Actualizar sesión
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, duration, location } = req.body;

    const session = await prisma.session.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        duration,
        location,
      },
      include: {
        program: true,
      },
    });

    res.json(session);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Error al actualizar sesión' });
  }
});

// Eliminar sesión
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.session.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Sesión eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Error al eliminar sesión' });
  }
});

export default router;
