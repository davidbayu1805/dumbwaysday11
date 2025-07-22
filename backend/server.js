import express, { json, urlencoded } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/project.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ extended: true }));


app.use('/api/projects', projectRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'DW Project Backend API',
    version: '1.0.0',
    endpoints: {
      'GET /api/projects': 'Get all projects',
      'GET /api/projects/:id': 'Get project by ID',
      'POST /api/projects': 'Create new project',
      'PUT /api/projects/:id': 'Update project',
      'DELETE /api/projects/:id': 'Soft delete project',
      'POST /api/projects/:id/restore': 'Restore deleted project',
      'DELETE /api/projects/:id/permanent': 'Permanently delete project',
      'GET /api/projects/deleted': 'Get deleted projects'
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}`);
});

export default app;
