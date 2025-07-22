import { Router } from 'express';
const router = Router();
import projectController from '../controllers/projectController.js';
import projectValidation from '../middleware/validation.js';


router.get('/', projectController.getAll);
router.get('/deleted', projectController.getDeleted);
router.get('/:id', projectValidation.validateId, projectController.getById);
router.post('/', projectValidation.create, projectController.create);
router.put('/:id', projectValidation.update, projectController.update);
router.delete('/:id', projectValidation.validateId, projectController.softDelete);
router.post('/:id/restore', projectValidation.validateId, projectController.restore);
router.delete('/:id/permanent', projectValidation.validateId, projectController.hardDelete);

export default router;