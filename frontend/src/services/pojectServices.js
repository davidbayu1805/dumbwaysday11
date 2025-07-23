// services/projectService.js
const API_BASE_URL = 'http://localhost:3000/api/projects';

class ProjectService {
  // Helper method to handle response
  static async handleResponse(response) {
    if (!response.ok) {
      let errorMessage = 'Something went wrong';
      
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } else {
          errorMessage = await response.text() || `HTTP ${response.status}: ${response.statusText}`;
        }
      } catch (parseError) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }
    return response.json();
  }

  // Get all projects
  static async getAllProjects() {
    try {
      const response = await fetch(API_BASE_URL);
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error(`Failed to load projects: ${error.message}`);
    }
  }

  // Get project by ID
  static async getProjectById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw new Error(`Failed to load project: ${error.message}`);
    }
  }

  // Create new project with better image handling
  static async createProject(projectData) {
    try {
      // Process image data if exists
      const payload = {
        ...projectData,
        image: projectData.image || null
      };

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error(`Failed to create project: ${error.message}`);
    }
  }

  // Update project with improved error handling
  static async updateProject(id, projectData) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...projectData,
          image: projectData.image || null
        }),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw new Error(`Failed to update project: ${error.message}`);
    }
  }

  // Soft delete project
  static async deleteProject(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw new Error(`Failed to delete project: ${error.message}`);
    }
  }

  // Hard delete project (permanent)
  static async permanentDeleteProject(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/permanent`, {
        method: 'DELETE',
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Error permanently deleting project ${id}:`, error);
      throw new Error(`Failed to permanently delete project: ${error.message}`);
    }
  }

  // Restore deleted project
  static async restoreProject(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/restore`, {
        method: 'POST',
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Error restoring project ${id}:`, error);
      throw new Error(`Failed to restore project: ${error.message}`);
    }
  }

  // Get deleted projects
  static async getDeletedProjects() {
    try {
      const response = await fetch(`${API_BASE_URL}/deleted`);
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching deleted projects:', error);
      throw new Error(`Failed to load deleted projects: ${error.message}`);
    }
  }

  // Improved file to base64 conversion
  static async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      // Validate file type
      if (!file.type.match('image.*')) {
        reject(new Error('Only image files are allowed'));
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        reject(new Error('File size must be less than 2MB'));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  // Additional helper to get image preview URL
  static getImagePreviewUrl(imageData) {
    if (!imageData) return null;
    if (typeof imageData === 'string' && imageData.startsWith('data:')) {
      return imageData;
    }
    return `data:image/jpeg;base64,${imageData}`;
  }
}

export default ProjectService;