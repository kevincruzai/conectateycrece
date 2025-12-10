import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

// Dashboard principal - Estadísticas generales
router.get('/stats', async (req, res) => {
  try {
    // KPIs básicos
    const totalCompanies = await prisma.company.count();
    const activePrograms = await prisma.program.count({ where: { status: 'EN_CURSO' } });
    const totalEnrollments = await prisma.enrollment.count();
    const completedEnrollments = await prisma.enrollment.count({ where: { status: 'COMPLETADO' } });
    const completionRate = totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;

    // Tendencia de inscripciones (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const enrollments = await prisma.enrollment.findMany({
      where: {
        enrollmentDate: { gte: sixMonthsAgo },
      },
      select: {
        enrollmentDate: true,
      },
    });

    const enrollmentsTrend = enrollments.reduce((acc: any, enrollment: any) => {
      const month = new Date(enrollment.enrollmentDate).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
      if (!acc[month]) {
        acc[month] = { month, inscripciones: 0 };
      }
      acc[month].inscripciones++;
      return acc;
    }, {});

    // Empresas por sector
    const companies = await prisma.company.findMany({
      select: { sector: true },
    });

    const companiesBySector = companies.reduce((acc: any, company: any) => {
      const sector = company.sector || 'Sin especificar';
      if (!acc[sector]) {
        acc[sector] = { name: sector, value: 0 };
      }
      acc[sector].value++;
      return acc;
    }, {});

    // Asistencia por programa
    const programs = await prisma.program.findMany({
      include: {
        sessions: {
          include: {
            attendance: true,
          },
        },
      },
    });

    const attendanceByProgram = programs.map((program: any) => {
      const totalAttendance = program.sessions.reduce((sum: number, session: any) => {
        return sum + session.attendance.filter((a: any) => a.status === 'PRESENTE').length;
      }, 0);

      return {
        program: program.name.substring(0, 20),
        asistencia: totalAttendance,
      };
    }).slice(0, 10);

    res.json({
      totalCompanies,
      activePrograms,
      totalEnrollments,
      completionRate,
      enrollmentsTrend: Object.values(enrollmentsTrend),
      companiesBySector: Object.values(companiesBySector),
      attendanceByProgram,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

export default router;
