import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

// Obtener asistencia por sesión
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const attendances = await prisma.attendance.findMany({
      where: { sessionId: parseInt(sessionId) },
      include: {
        enrollment: {
          include: {
            company: true,
          },
        },
        session: {
          include: {
            program: true,
          },
        },
      },
      orderBy: { recordedAt: 'desc' },
    });

    res.json({ attendances });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Error al obtener asistencia' });
  }
});

// Registrar asistencia
router.post('/', async (req, res) => {
  try {
    const { sessionId, enrollmentId, status, notes } = req.body;

    // Verificar si ya existe registro de asistencia
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        sessionId,
        enrollmentId,
      },
    });

    if (existingAttendance) {
      return res.status(400).json({ error: 'Ya existe un registro de asistencia para esta sesión' });
    }

    const attendance = await prisma.attendance.create({
      data: {
        sessionId,
        enrollmentId,
        status,
        notes,
        recordedAt: new Date(),
      },
      include: {
        enrollment: {
          include: {
            company: true,
          },
        },
        session: true,
      },
    });

    res.status(201).json(attendance);
  } catch (error) {
    console.error('Error creating attendance:', error);
    res.status(500).json({ error: 'Error al registrar asistencia' });
  }
});

// Actualizar asistencia
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const attendance = await prisma.attendance.update({
      where: { id: parseInt(id) },
      data: { status, notes },
      include: {
        enrollment: {
          include: {
            company: true,
          },
        },
        session: true,
      },
    });

    res.json(attendance);
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ error: 'Error al actualizar asistencia' });
  }
});

// Obtener reporte de asistencia por programa
router.get('/program/:programId/report', async (req, res) => {
  try {
    const { programId } = req.params;

    const program = await prisma.program.findUnique({
      where: { id: parseInt(programId) },
      include: {
        sessions: {
          include: {
            attendance: {
              include: {
                enrollment: {
                  include: {
                    company: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!program) {
      return res.status(404).json({ error: 'Programa no encontrado' });
    }

    const report = {
      program: {
        id: program.id,
        name: program.name,
      },
      sessions: program.sessions.map((session: any) => {
        const totalAttendance = session.attendance.length;
        const present = session.attendance.filter((a: any) => a.status === 'PRESENTE').length;
        const late = session.attendance.filter((a: any) => a.status === 'TARDE').length;
        const absent = session.attendance.filter((a: any) => a.status === 'AUSENTE').length;

        return {
          id: session.id,
          title: session.title,
          date: session.date,
          statistics: {
            total: totalAttendance,
            present,
            late,
            absent,
            attendanceRate: totalAttendance > 0 ? ((present + late) / totalAttendance) * 100 : 0,
          },
        };
      }),
    };

    res.json(report);
  } catch (error) {
    console.error('Error generating attendance report:', error);
    res.status(500).json({ error: 'Error al generar reporte de asistencia' });
  }
});

export default router;
