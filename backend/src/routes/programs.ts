import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

// Obtener todos los programas con paginación y búsqueda
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = search
      ? {
          OR: [
            { name: { contains: search as string, mode: 'insensitive' as const } },
            { description: { contains: search as string, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [programs, total] = await Promise.all([
      prisma.program.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          sessions: true,
          enrollments: true,
          _count: {
            select: {
              sessions: true,
              enrollments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.program.count({ where }),
    ]);

    const programsWithCounts = programs.map((program: any) => ({
      ...program,
      sessionsCount: program._count.sessions,
      enrolledCount: program._count.enrollments,
    }));

    res.json({
      programs: programsWithCounts,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ error: 'Error al obtener programas' });
  }
});

// Obtener programa por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const program = await prisma.program.findUnique({
      where: { id: parseInt(id) },
      include: {
        sessions: true,
        enrollments: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!program) {
      return res.status(404).json({ error: 'Programa no encontrado' });
    }

    res.json(program);
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ error: 'Error al obtener programa' });
  }
});

// Crear programa
router.post('/', async (req, res) => {
  try {
    const { name, description, startDate, endDate, duration, modality, maxCapacity, status } = req.body;

    const program = await prisma.program.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        duration,
        modality,
        maxCapacity,
        status,
      },
    });

    res.status(201).json(program);
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({ error: 'Error al crear programa' });
  }
});

// Actualizar programa
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate, duration, modality, maxCapacity, status } = req.body;

    const program = await prisma.program.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        duration,
        modality,
        maxCapacity,
        status,
      },
    });

    res.json(program);
  } catch (error) {
    console.error('Error updating program:', error);
    res.status(500).json({ error: 'Error al actualizar programa' });
  }
});

// Eliminar programa
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.program.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Programa eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ error: 'Error al eliminar programa' });
  }
});

export default router;
