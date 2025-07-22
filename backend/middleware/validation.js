import { body, param } from 'express-validator';

const projectValidation = {
  create: [
    body('project_name')
      .notEmpty()
      .withMessage('Project name is required')
      .isLength({ min: 1, max: 255 })
      .withMessage('Project name must be between 1-255 characters'),

    body('start_date')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid date (YYYY-MM-DD)'),

    body('end_date')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid date (YYYY-MM-DD)'),

    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Description must be max 1000 characters'),

    body('technologies')
      .optional()
      .isArray()
      .withMessage('Technologies must be an array'),

    body('image')
      .optional()
      .custom((value) => {
        if (value === null || value === '' || value === undefined) {
          return true;
        }
        if (typeof value === 'string' && value.startsWith('data:image/')) {
          return true;
        }
        throw new Error('Image must be a valid base64 data URL');
      })
  ],

  update: [
    param('id')
      .custom((value) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const isInteger = /^\d+$/.test(value) && parseInt(value) > 0;
        if (uuidRegex.test(value) || isInteger) return true;
        throw new Error('Project ID must be a valid UUID or positive integer');
      }),

    body('project_name')
      .optional()
      .notEmpty()
      .withMessage('Project name cannot be empty')
      .isLength({ min: 1, max: 255 })
      .withMessage('Project name must be between 1-255 characters'),

    body('start_date')
      .optional({ nullable: true })
      .custom((value) => {
        if (value === null || value === '' || value === undefined) return true;
        const date = new Date(value);
        if (isNaN(date.getTime())) throw new Error('Start date must be a valid date (YYYY-MM-DD)');
        return true;
      }),

    body('end_date')
      .optional({ nullable: true })
      .custom((value) => {
        if (value === null || value === '' || value === undefined) return true;
        const date = new Date(value);
        if (isNaN(date.getTime())) throw new Error('End date must be a valid date (YYYY-MM-DD)');
        return true;
      }),

    body('description')
      .optional({ nullable: true })
      .custom((value) => {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string' && value.length <= 1000) return true;
        throw new Error('Description must be max 1000 characters');
      }),

    body('technologies')
      .optional()
      .isArray()
      .withMessage('Technologies must be an array'),

    body('image')
      .optional({ nullable: true })
      .custom((value) => {
        if (value === null || value === '' || value === undefined) return true;
        if (typeof value === 'string' && value.startsWith('data:image/')) return true;
        throw new Error('Image must be a valid base64 data URL');
      })
  ],

  validateId: [
    param('id')
      .custom((value) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const isInteger = /^\d+$/.test(value) && parseInt(value) > 0;
        if (uuidRegex.test(value) || isInteger) return true;
        throw new Error('Project ID must be a valid UUID or positive integer');
      })
  ]
};

export default projectValidation;
