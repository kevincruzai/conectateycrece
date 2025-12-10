import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

// Obtener todas las inscripciones
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, programId, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (programId) where.programId = parseInt(programId as string);
    if (status) where.status = status as string;

    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          company: true,
          program: true,
          attendance: true,
          evaluations: true,
        },
        orderBy: { enrollmentDate: 'desc' },
      }),
      prisma.enrollment.count({ where }),
    ]);

    // Calcular porcentajes de asistencia y avance
    const enrollmentsWithStats = enrollments.map((enrollment: any) => {
      const totalSessions = enrollment.program.sessions?.length || 0;
      const attendedSessions = enrollment.attendance.filter((a: any) => a.status === 'PRESENTE').length;
      const attendancePercentage = totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0;

      const completionPercentage = enrollment.status === 'COMPLETADO' ? 100 : 
                                    enrollment.status === 'EN_CURSO' ? 50 : 0;

      const avgGrade = enrollment.evaluations.length > 0
        ? enrollment.evaluations.reduce((sum: number, e: any) => sum + (e.grade / e.maxGrade) * 100, 0) / enrollment.evaluations.length
        : null;

      return {
        ...enrollment,
        attendancePercentage: Math.round(attendancePercentage),
        completionPercentage,
        finalGrade: avgGrade ? Math.round(avgGrade) : null,
      };
    });

    res.json({
      enrollments: enrollmentsWithStats,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ error: 'Error al obtener inscripciones' });
  }
});

// Crear inscripción
router.post('/', async (req, res) => {
  try {
    const { companyId, programId, status = 'INSCRITO' } = req.body;

    // Verificar que no exista ya una inscripción
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        companyId,
        programId,
      },
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'La empresa ya está inscrita en este programa' });
    }

    // Verificar capacidad del programa
    const program = await prisma.program.findUnique({
      where: { id: programId },
      include: {
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!program) {
      return res.status(404).json({ error: 'Programa no encontrado' });
    }

    if (program._count.enrollments >= program.maxCapacity) {
      return res.status(400).json({ error: 'El programa ha alcanzado su capacidad máxima' });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        companyId,
        programId,
        status,
        enrollmentDate: new Date(),
      },
      include: {
        company: true,
        program: true,
      },
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.error('Error creating enrollment:', error);
    res.status(500).json({ error: 'Error al crear inscripción' });
  }
});

// Actualizar inscripción (principalmente estado)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const enrollment = await prisma.enrollment.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        company: true,
        program: true,
      },
    });

    res.json(enrollment);
  } catch (error) {
    console.error('Error updating enrollment:', error);
    res.status(500).json({ error: 'Error al actualizar inscripción' });
  }
});

// Eliminar inscripción
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.enrollment.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Inscripción eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting enrollment:', error);
    res.status(500).json({ error: 'Error al eliminar inscripción' });
  }
});

export default router;
