import { Router } from 'express';
const router = Router();
import projectController from '../controllers/projectController.js';
import projectValidation from '../middleware/validation.js';
import authMiddleware from '../middleware/auth.js';

router.get('/', authMiddleware.authenticate, projectController.getAll);
router.get('/deleted', authMiddleware.authenticate, projectController.getDeleted);
router.get('/:id', authMiddleware.authenticate, projectValidation.validateId, projectController.getById);
router.post('/', authMiddleware.authenticate, projectValidation.create, projectController.create);
router.put('/:id', authMiddleware.authenticate, projectValidation.update, projectController.update);
router.delete('/:id', authMiddleware.authenticate, projectValidation.validateId, projectController.softDelete);
router.post('/:id/restore', authMiddleware.authenticate, projectValidation.validateId, projectController.restore);
router.delete('/:id/permanent', authMiddleware.authenticate, projectValidation.validateId, projectController.hardDelete);

export default router;