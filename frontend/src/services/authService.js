const API_BASE_URL = 'http://localhost:3000/api/auth';

class AuthService {
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

  static async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await this.handleResponse(response);
      
      // Trigger auth change event
      window.dispatchEvent(new Event('authChange'));
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(`Failed to login: ${error.message}`);
    }
  }

  static async register(username, email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      const data = await this.handleResponse(response);
      
      // Trigger auth change event
      window.dispatchEvent(new Event('authChange'));
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(`Failed to register: ${error.message}`);
    }
  }

  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('authChange'));
    return Promise.resolve();
  }

  static getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export default AuthService;