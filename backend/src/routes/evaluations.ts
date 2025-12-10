import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

// Obtener todas las evaluaciones
router.get('/', async (req, res) => {
  try {
    const evaluations = await prisma.evaluation.findMany({
      include: {
        enrollment: {
          include: {
            company: true,
            program: true,
          },
        },
      },
      orderBy: { evaluationDate: 'desc' },
    });

    // Calcular competencies desde el JSON
    const evaluationsWithCompetencies = evaluations.map((evaluation: any) => ({
      ...evaluation,
      competencies: evaluation.competencyScores || [],
    }));

    res.json({ evaluations: evaluationsWithCompetencies });
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    res.status(500).json({ error: 'Error al obtener evaluaciones' });
  }
});

// Obtener evaluaciones por programa
router.get('/program/:programId', async (req, res) => {
  try {
    const { programId } = req.params;

    const evaluations = await prisma.evaluation.findMany({
      where: {
        enrollment: {
          programId: parseInt(programId),
        },
      },
      include: {
        enrollment: {
          include: {
            company: true,
          },
        },
      },
    });

    res.json({ evaluations });
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    res.status(500).json({ error: 'Error al obtener evaluaciones' });
  }
});

// Crear evaluación
router.post('/', async (req, res) => {
  try {
    const { enrollmentId, evaluationType, evaluationDate, grade, maxGrade, feedback, competencyScores } = req.body;

    const passed = (grade / maxGrade) >= 0.6; // 60% para aprobar

    const evaluation = await prisma.evaluation.create({
      data: {
        enrollmentId,
        evaluationType,
        evaluationDate: new Date(evaluationDate),
        grade,
        maxGrade,
        passed,
        feedback,
        competencyScores: competencyScores || [],
      },
      include: {
        enrollment: {
          include: {
            company: true,
            program: true,
          },
        },
      },
    });

    res.status(201).json(evaluation);
  } catch (error) {
    console.error('Error creating evaluation:', error);
    res.status(500).json({ error: 'Error al crear evaluación' });
  }
});

// Actualizar evaluación
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { evaluationType, evaluationDate, grade, maxGrade, feedback, competencyScores } = req.body;

    const passed = grade && maxGrade ? (grade / maxGrade) >= 0.6 : undefined;

    const evaluation = await prisma.evaluation.update({
      where: { id: parseInt(id) },
      data: {
        evaluationType,
        evaluationDate: evaluationDate ? new Date(evaluationDate) : undefined,
        grade,
        maxGrade,
        passed,
        feedback,
        competencyScores,
      },
      include: {
        enrollment: {
          include: {
            company: true,
            program: true,
          },
        },
      },
    });

    res.json(evaluation);
  } catch (error) {
    console.error('Error updating evaluation:', error);
    res.status(500).json({ error: 'Error al actualizar evaluación' });
  }
});

// Eliminar evaluación
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.evaluation.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Evaluación eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting evaluation:', error);
    res.status(500).json({ error: 'Error al eliminar evaluación' });
  }
});

export default router;
