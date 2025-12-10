import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Formulario público - no requiere autenticación
router.post('/public', async (req, res) => {
  try {
    const entrepreneurData = req.body;

    // Validar campos requeridos
    const requiredFields = [
      'fullName', 'age', 'sex', 'email', 'phone', 'municipality', 'department', 'zone',
      'businessName', 'startYear', 'businessStage', 'productiveSector', 'employeeCount',
      'legalStatus', 'motivation', 'mission', 'desiredImpact', 'fundingSources',
      'hasTaxId', 'monthlySales', 'challenges', 'usesDigitalTools', 'interestedInTraining',
      'hasInnovation', 'supportNeeded', 'willingToParticipate', 'acceptsTerms'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field] && req.body[field] !== false);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: 'Campos requeridos faltantes', 
        missingFields 
      });
    }

    // Verificar que acepte los términos
    if (!entrepreneurData.acceptsTerms) {
      return res.status(400).json({ 
        error: 'Debes aceptar los términos y condiciones' 
      });
    }

    // Verificar si el email ya existe
    const existingEntrepreneur = await prisma.entrepreneur.findUnique({
      where: { email: entrepreneurData.email }
    });

    if (existingEntrepreneur) {
      return res.status(400).json({ 
        error: 'Este correo electrónico ya ha sido registrado' 
      });
    }

    // Crear emprendedor
    const entrepreneur = await prisma.entrepreneur.create({
      data: {
        ...entrepreneurData,
        // Convertir arrays a JSON strings
        fundingSources: JSON.stringify(entrepreneurData.fundingSources),
        challenges: JSON.stringify(entrepreneurData.challenges),
        supportNeeded: JSON.stringify(entrepreneurData.supportNeeded),
      },
    });

    res.status(201).json({
      message: '¡Registro exitoso! Gracias por tu participación.',
      entrepreneurId: entrepreneur.id
    });
  } catch (error) {
    console.error('Error creating entrepreneur:', error);
    res.status(500).json({ error: 'Error al registrar emprendedor' });
  }
});

// Aplicar autenticación a todas las demás rutas
router.use(authenticate);

// Obtener todos los emprendedores (requiere autenticación)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '',
      department,
      businessStage,
      productiveSector
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};

    // Búsqueda
    if (search) {
      where.OR = [
        { fullName: { contains: search as string } },
        { email: { contains: search as string } },
        { businessName: { contains: search as string } },
      ];
    }

    // Filtros
    if (department) where.department = department;
    if (businessStage) where.businessStage = businessStage;
    if (productiveSector) where.productiveSector = productiveSector;

    const [entrepreneurs, total] = await Promise.all([
      prisma.entrepreneur.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.entrepreneur.count({ where }),
    ]);

    // Parsear JSON strings de vuelta a arrays
    const parsedEntrepreneurs = entrepreneurs.map((e: any) => ({
      ...e,
      fundingSources: JSON.parse(e.fundingSources),
      challenges: JSON.parse(e.challenges),
      supportNeeded: JSON.parse(e.supportNeeded),
    }));

    res.json({
      data: parsedEntrepreneurs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching entrepreneurs:', error);
    res.status(500).json({ error: 'Error al obtener emprendedores' });
  }
});

// Obtener emprendedor por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const entrepreneur = await prisma.entrepreneur.findUnique({
      where: { id },
    });

    if (!entrepreneur) {
      return res.status(404).json({ error: 'Emprendedor no encontrado' });
    }

    // Parsear JSON strings
    const parsedEntrepreneur = {
      ...entrepreneur,
      fundingSources: JSON.parse(entrepreneur.fundingSources),
      challenges: JSON.parse(entrepreneur.challenges),
      supportNeeded: JSON.parse(entrepreneur.supportNeeded),
    };

    res.json(parsedEntrepreneur);
  } catch (error) {
    console.error('Error fetching entrepreneur:', error);
    res.status(500).json({ error: 'Error al obtener emprendedor' });
  }
});

// Actualizar emprendedor
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Convertir arrays a JSON strings si existen
    if (updateData.fundingSources) {
      updateData.fundingSources = JSON.stringify(updateData.fundingSources);
    }
    if (updateData.challenges) {
      updateData.challenges = JSON.stringify(updateData.challenges);
    }
    if (updateData.supportNeeded) {
      updateData.supportNeeded = JSON.stringify(updateData.supportNeeded);
    }

    const entrepreneur = await prisma.entrepreneur.update({
      where: { id },
      data: updateData,
    });

    res.json(entrepreneur);
  } catch (error) {
    console.error('Error updating entrepreneur:', error);
    res.status(500).json({ error: 'Error al actualizar emprendedor' });
  }
});

// Eliminar emprendedor
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.entrepreneur.delete({
      where: { id },
    });

    res.json({ message: 'Emprendedor eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting entrepreneur:', error);
    res.status(500).json({ error: 'Error al eliminar emprendedor' });
  }
});

// Obtener estadísticas de emprendedores
router.get('/stats/overview', async (req, res) => {
  try {
    const [
      total,
      byDepartment,
      byStage,
      bySector,
      byZone
    ] = await Promise.all([
      prisma.entrepreneur.count(),
      prisma.entrepreneur.groupBy({
        by: ['department'],
        _count: true,
      }),
      prisma.entrepreneur.groupBy({
        by: ['businessStage'],
        _count: true,
      }),
      prisma.entrepreneur.groupBy({
        by: ['productiveSector'],
        _count: true,
      }),
      prisma.entrepreneur.groupBy({
        by: ['zone'],
        _count: true,
      }),
    ]);

    res.json({
      total,
      byDepartment,
      byStage,
      bySector,
      byZone,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

export default router;
