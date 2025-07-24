import Project from '../models/project.js';
import { validationResult } from 'express-validator';

const projectController = {
  // Get all projects (with optional user filter)
  async getAll(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      // Jika ada user yang login, hanya ambil project miliknya
      const userId = req.user?.id;
      const projects = await Project.getAll(userId);

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

  // Get projects by logged in user
  async getMyProjects(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const projects = await Project.getUserProjects(req.user.id);

      res.json({
        success: true,
        message: 'User projects retrieved successfully',
        data: projects
      });
    } catch (error) {
      console.error('Error in getMyProjects:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving user projects',
        error: error.message
      });
    }
  },

  // Get project by ID
  async getById(req, res) {
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
      const project = await Project.getById(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      // Optional: Verifikasi kepemilikan project
      if (req.user && req.user.id !== project.user_id) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to access this project'
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

  // Create new project
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

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const payload = {
        ...req.body,
        image: req.body.image || null,
        user_id: req.user.id // Tambahkan user_id dari user yang login
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

  // Update project
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

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { id } = req.params;
      
      // Verifikasi kepemilikan project sebelum update
      const existingProject = await Project.getById(id);
      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      if (existingProject.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to update this project'
        });
      }

      const payload = {
        ...req.body,
        image: req.body.image || null
      };

      const project = await Project.update(id, payload);
      
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

  // Soft delete project
  async softDelete(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { id } = req.params;
      
      // Verifikasi kepemilikan project sebelum delete
      const existingProject = await Project.getById(id);
      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      if (existingProject.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to delete this project'
        });
      }

      const project = await Project.softDelete(id);
      
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

  // Restore deleted project
  async restore(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { id } = req.params;
      
      // Verifikasi kepemilikan project sebelum restore
      const existingProject = await Project.getById(id);
      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      if (existingProject.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to restore this project'
        });
      }

      const project = await Project.restore(id);
      
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

  // Hard delete project (permanent)
  async hardDelete(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { id } = req.params;
      
      // Verifikasi kepemilikan project sebelum permanent delete
      const existingProject = await Project.getById(id);
      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      if (existingProject.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to permanently delete this project'
        });
      }

      const project = await Project.hardDelete(id);
      
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

  // Get deleted projects
  async getDeleted(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Hanya ambil deleted projects milik user yang login
      const projects = await Project.getDeleted(req.user.id);
      
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