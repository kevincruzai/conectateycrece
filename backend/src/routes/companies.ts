import { Router } from 'express';
import prisma from '../utils/database';
import { authenticate, authorize, ROLES } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Obtener todas las empresas (con paginación y filtros)
router.get('/', async (req: any, res, next) => {
  try {
    const { 
      page = '1', 
      limit = '20',
      search = '',
      sector = '',
      department = '',
      status = 'ACTIVO'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where: any = {};

    // Filtros
    if (search) {
      where.OR = [
        { companyName: { contains: search } },
        { legalRepresentative: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (sector) where.economicSector = sector;
    if (department) where.department = department;
    if (status) where.status = status;

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          enrollments: {
            select: {
              id: true,
              status: true,
              program: { select: { name: true } },
            },
          },
        },
      }),
      prisma.company.count({ where }),
    ]);

    res.json({
      data: companies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Obtener una empresa por ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            program: true,
          },
        },
      },
    });

    if (!company) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    res.json(company);
  } catch (error) {
    next(error);
  }
});

// Crear nueva empresa (solo ADMIN_OEI y COORDINADOR)
router.post('/', authorize(ROLES.ADMIN_OEI, ROLES.COORDINADOR), async (req: any, res, next) => {
  try {
    const companyData = req.body;

    // Validaciones básicas
    if (!companyData.companyName || !companyData.legalRepresentative) {
      return res.status(400).json({ error: 'Nombre de empresa y representante legal son requeridos' });
    }

    const company = await prisma.company.create({
      data: companyData,
    });

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'COMPANY',
        entityId: company.id,
        userId: req.user.userId,
        changes: JSON.stringify({ created: companyData }),
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    res.status(201).json({
      message: 'Empresa creada exitosamente',
      company,
    });
  } catch (error) {
    next(error);
  }
});

// Actualizar empresa
router.put('/:id', authorize(ROLES.ADMIN_OEI, ROLES.COORDINADOR), async (req: any, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingCompany = await prisma.company.findUnique({ where: { id } });

    if (!existingCompany) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    const company = await prisma.company.update({
      where: { id },
      data: updateData,
    });

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'COMPANY',
        entityId: company.id,
        userId: req.user.userId,
        changes: JSON.stringify({ before: existingCompany, after: updateData }),
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    res.json({
      message: 'Empresa actualizada exitosamente',
      company,
    });
  } catch (error) {
    next(error);
  }
});

// Eliminar empresa (soft delete - cambiar status)
router.delete('/:id', authorize(ROLES.ADMIN_OEI), async (req: any, res, next) => {
  try {
    const { id } = req.params;

    const company = await prisma.company.update({
      where: { id },
      data: { status: 'INACTIVO' },
    });

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        entity: 'COMPANY',
        entityId: company.id,
        userId: req.user.userId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    res.json({ message: 'Empresa desactivada exitosamente' });
  } catch (error) {
    next(error);
  }
});

// Obtener estadísticas de empresas
router.get('/stats/overview', async (req, res, next) => {
  try {
    const [
      totalCompanies,
      activeCompanies,
      bySize,
      bySector,
      byDepartment,
    ] = await Promise.all([
      prisma.company.count(),
      prisma.company.count({ where: { status: 'ACTIVO' } }),
      prisma.company.groupBy({
        by: ['companySize'],
        _count: true,
      }),
      prisma.company.groupBy({
        by: ['economicSector'],
        _count: true,
      }),
      prisma.company.groupBy({
        by: ['department'],
        _count: true,
      }),
    ]);

    res.json({
      total: totalCompanies,
      active: activeCompanies,
      bySize,
      bySector,
      byDepartment,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
