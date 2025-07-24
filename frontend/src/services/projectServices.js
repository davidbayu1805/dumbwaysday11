import AuthService from './authService';

const API_BASE_URL = 'http://localhost:3000/api/projects';

class ProjectService {
  static getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': token,
      'Content-Type': 'application/json'
    };
  }

  static async handleResponse(response) {
    if (response.status === 401) {
      AuthService.logout();
      throw new Error('Session expired. Please login again.');
    }

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

  static async getAllProjects() {
    try {
      const response = await fetch(API_BASE_URL, {
        headers: this.getAuthHeader()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error(`Failed to load projects: ${error.message}`);
    }
  }

  static async getProjectById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        headers: this.getAuthHeader()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw new Error(`Failed to load project: ${error.message}`);
    }
  }

  static async createProject(projectData) {
    try {
      const payload = {
        ...projectData,
        image: projectData.image || null
      };

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify(payload),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error(`Failed to create project: ${error.message}`);
    }
  }

  static async updateProject(id, projectData) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeader(),
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

  static async deleteProject(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeader()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw new Error(`Failed to delete project: ${error.message}`);
    }
  }

  static async permanentDeleteProject(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/permanent`, {
        method: 'DELETE',
        headers: this.getAuthHeader()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Error permanently deleting project ${id}:`, error);
      throw new Error(`Failed to permanently delete project: ${error.message}`);
    }
  }

  static async restoreProject(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/restore`, {
        method: 'POST',
        headers: this.getAuthHeader()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Error restoring project ${id}:`, error);
      throw new Error(`Failed to restore project: ${error.message}`);
    }
  }

  static async getDeletedProjects() {
    try {
      const response = await fetch(`${API_BASE_URL}/deleted`, {
        headers: this.getAuthHeader()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching deleted projects:', error);
      throw new Error(`Failed to load deleted projects: ${error.message}`);
    }
  }

  static async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      if (!file.type.match('image.*')) {
        reject(new Error('Only image files are allowed'));
        return;
      }

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

  static getImagePreviewUrl(imageData) {
    if (!imageData) return null;
    if (typeof imageData === 'string' && imageData.startsWith('data:')) {
      return imageData;
    }
    return `data:image/jpeg;base64,${imageData}`;
  }
}

export default ProjectService;