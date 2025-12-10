import { Router } from 'express';
import prisma from '../utils/database';
import { authenticate, authorize, ROLES } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// Obtener todos los usuarios (solo ADMIN)
router.get('/', authorize(ROLES.ADMIN_OEI), async (req: any, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        role: true,
        isActive: true,
        isApproved: true,
        createdAt: true,
        lastLogin: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Aprobar usuario
router.patch('/:id/approve', authorize(ROLES.ADMIN_OEI), async (req: any, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.update({
      where: { id },
      data: {
        isApproved: true,
        isActive: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'USER',
        entityId: id,
        userId: req.user.userId,
        changes: JSON.stringify({ action: 'user_approved' }),
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    res.json({ message: 'Usuario aprobado exitosamente', user });
  } catch (error) {
    next(error);
  }
});

// Desactivar usuario
router.patch('/:id/deactivate', authorize(ROLES.ADMIN_OEI), async (req: any, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'USER',
        entityId: id,
        userId: req.user.userId,
        changes: JSON.stringify({ action: 'user_deactivated' }),
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    res.json({ message: 'Usuario desactivado exitosamente', user });
  } catch (error) {
    next(error);
  }
});

export default router;
