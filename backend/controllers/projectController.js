import Project from '../models/project.js';
import { validationResult } from 'express-validator';

const projectController = {
  async getAll(req, res) {
    try {
      const projects = await Project.getAll();
      res.json({
        success: true,
        message: 'Projects retrieved successfully',
        data: projects
      });
    } catch (error) {
      console.error('Error in getAll:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving projects',
        error: error.message
      });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const project = await Project.getById(id);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }
      res.json({
        success: true,
        message: 'Project retrieved successfully',
        data: project
      });
    } catch (error) {
      console.error('Error in getById:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving project',
        error: error.message
      });
    }
  },

  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const payload = {
        ...req.body,
        image: req.body.image || null
      };

      const project = await Project.create(payload);
      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project
      });
    } catch (error) {
      console.error('Error in create:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating project',
        error: error.message
      });
    }
  },

  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const payload = {
        ...req.body,
        image: req.body.image || null
      };

      const project = await Project.update(id, payload);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      res.json({
        success: true,
        message: 'Project updated successfully',
        data: project
      });
    } catch (error) {
      console.error('Error in update:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating project',
        error: error.message
      });
    }
  },

  async softDelete(req, res) {
    try {
      const { id } = req.params;
      const project = await Project.softDelete(id);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      res.json({
        success: true,
        message: 'Project soft-deleted successfully',
        data: project
      });
    } catch (error) {
      console.error('Error in softDelete:', error);
      res.status(500).json({
        success: false,
        message: 'Error soft-deleting project',
        error: error.message
      });
    }
  },

  async restore(req, res) {
    try {
      const { id } = req.params;
      const project = await Project.restore(id);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      res.json({
        success: true,
        message: 'Project restored successfully',
        data: project
      });
    } catch (error) {
      console.error('Error in restore:', error);
      res.status(500).json({
        success: false,
        message: 'Error restoring project',
        error: error.message
      });
    }
  },

  async hardDelete(req, res) {
    try {
      const { id } = req.params;
      const project = await Project.hardDelete(id);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      res.json({
        success: true,
        message: 'Project permanently deleted',
        data: project
      });
    } catch (error) {
      console.error('Error in hardDelete:', error);
      res.status(500).json({
        success: false,
        message: 'Error permanently deleting project',
        error: error.message
      });
    }
  },

  async getDeleted(req, res) {
    try {
      const projects = await Project.getDeleted();
      res.json({
        success: true,
        message: 'Deleted projects retrieved successfully',
        data: projects
      });
    } catch (error) {
      console.error('Error in getDeleted:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving deleted projects',
        error: error.message
      });
    }
  }
};

export default projectController;
