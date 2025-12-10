import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

// Obtener datos para reportes
router.get('/', async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;

    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate as string);
    if (endDate) dateFilter.lte = new Date(endDate as string);

    // Empresas por sector
    const companies = await prisma.company.findMany({
      select: { sector: true },
    });
    const companiesBySector = companies.reduce((acc: any, company: any) => {
      const sector = company.sector || 'Sin especificar';
      acc[sector] = (acc[sector] || 0) + 1;
      return acc;
    }, {});

    // Inscripciones por programa
    const programs = await prisma.program.findMany({
      include: {
        _count: {
          select: {
            enrollments: true,
          },
        },
        enrollments: {
          where: {
            status: 'COMPLETADO',
          },
        },
      },
    });

    const enrollmentsByProgram = programs.map((program: any) => ({
      name: program.name,
      inscripciones: program._count.enrollments,
      completados: program.enrollments.length,
    }));

    // Asistencia por mes (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const attendances = await prisma.attendance.findMany({
      where: {
        recordedAt: { gte: sixMonthsAgo },
      },
      include: {
        session: true,
      },
    });

    const attendanceByMonth = attendances.reduce((acc: any, attendance: any) => {
      const month = new Date(attendance.recordedAt).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = { month, asistencia: 0, ausencias: 0 };
      }
      if (attendance.status === 'PRESENTE' || attendance.status === 'TARDE') {
        acc[month].asistencia++;
      } else {
        acc[month].ausencias++;
      }
      return acc;
    }, {});

    // Estadísticas de evaluaciones por programa
    const evaluations = await prisma.evaluation.findMany({
      include: {
        enrollment: {
          include: {
            program: true,
          },
        },
      },
    });

    const evaluationStats = programs.map((program: any) => {
      const programEvals = evaluations.filter((e: any) => e.enrollment.programId === program.id);
      const avgGrade = programEvals.length > 0
        ? programEvals.reduce((sum: number, e: any) => sum + (e.grade / e.maxGrade) * 100, 0) / programEvals.length
        : 0;
      const passed = programEvals.filter((e: any) => e.passed).length;
      const failed = programEvals.filter((e: any) => !e.passed).length;

      return {
        programa: program.name.substring(0, 20),
        promedio: Math.round(avgGrade),
        aprobados: passed,
        reprobados: failed,
      };
    });

    // Top 10 empresas
    const enrollmentsWithStats = await prisma.enrollment.findMany({
      include: {
        company: true,
        attendance: true,
        evaluations: true,
      },
    });

    const companyStats: any = {};
    enrollmentsWithStats.forEach((enrollment: any) => {
      const companyId = enrollment.company.id;
      if (!companyStats[companyId]) {
        companyStats[companyId] = {
          name: enrollment.company.name,
          programsCount: 0,
          totalAttendance: 0,
          attendanceCount: 0,
          totalGrade: 0,
          gradeCount: 0,
        };
      }
      companyStats[companyId].programsCount++;
      
      const presentCount = enrollment.attendance.filter((a: any) => a.status === 'PRESENTE').length;
      const totalCount = enrollment.attendance.length;
      if (totalCount > 0) {
        companyStats[companyId].totalAttendance += (presentCount / totalCount) * 100;
        companyStats[companyId].attendanceCount++;
      }

      if (enrollment.evaluations.length > 0) {
        const avgGrade = enrollment.evaluations.reduce((sum: number, e: any) => sum + (e.grade / e.maxGrade) * 100, 0) / enrollment.evaluations.length;
        companyStats[companyId].totalGrade += avgGrade;
        companyStats[companyId].gradeCount++;
      }
    });

    const topCompanies = Object.values(companyStats)
      .map((company: any) => ({
        name: company.name,
        programsCount: company.programsCount,
        attendance: company.attendanceCount > 0 ? Math.round(company.totalAttendance / company.attendanceCount) : 0,
        averageGrade: company.gradeCount > 0 ? Math.round(company.totalGrade / company.gradeCount) : 0,
      }))
      .sort((a: any, b: any) => b.averageGrade - a.averageGrade)
      .slice(0, 10);

    res.json({
      companiesBySector: Object.entries(companiesBySector).map(([name, value]) => ({ name, value })),
      enrollmentsByProgram,
      attendanceByMonth: Object.values(attendanceByMonth),
      evaluationStats,
      topCompanies,
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Error al generar reporte' });
  }
});

// Exportar a Excel (stub - requiere librería adicional)
router.get('/export/excel', async (req, res) => {
  try {
    // TODO: Implementar exportación a Excel con librería como 'exceljs'
    res.status(501).json({ message: 'Exportación a Excel pendiente de implementar' });
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    res.status(500).json({ error: 'Error al exportar a Excel' });
  }
});

// Exportar a PDF (stub - requiere librería adicional)
router.get('/export/pdf', async (req, res) => {
  try {
    // TODO: Implementar exportación a PDF con librería como 'pdfkit'
    res.status(501).json({ message: 'Exportación a PDF pendiente de implementar' });
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    res.status(500).json({ error: 'Error al exportar a PDF' });
  }
});

export default router;
