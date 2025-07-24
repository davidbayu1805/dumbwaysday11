import pool from '../config/database.js';

class Project {
  static prepareImageData(imageData) {
    if (!imageData) return null;
  
    if (Buffer.isBuffer(imageData)) return imageData;
    
    if (typeof imageData === 'string') {
      if (imageData.startsWith('data:')) {
        const base64Data = imageData.split(',')[1];
        if (!base64Data) return null;
        return Buffer.from(base64Data, 'base64');
      }
      return Buffer.from(imageData, 'base64');
    }
    
    return null;
  }

  static async getAll(userId = null) {
    let query = `SELECT 
                  p.id, 
                  p.project_name, 
                  p.start_date, 
                  p.end_date, 
                  p.description, 
                  p.technologies, 
                  CASE 
                    WHEN p.image IS NOT NULL THEN CONCAT('data:image/jpeg;base64,', encode(p.image, 'base64'))
                    ELSE NULL 
                  END as image,
                  p.created_at, 
                  p.updated_at,
                  u.username as author
                FROM projects p
                JOIN users u ON p.user_id = u.id
                WHERE p.deleted_at IS NULL`;
    
    const params = [];
    
    if (userId) {
      query += ` AND p.user_id = $1`;
      params.push(userId);
    }
    
    query += ` ORDER BY p.created_at DESC`;
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query(
      `SELECT 
        p.id, 
        p.project_name, 
        p.start_date, 
        p.end_date, 
        p.description, 
        p.technologies,
        CASE 
          WHEN p.image IS NOT NULL THEN CONCAT('data:image/jpeg;base64,', encode(p.image, 'base64'))
          ELSE NULL 
        END as image,
        p.created_at, 
        p.updated_at,
        u.username as author
      FROM projects p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1 AND p.deleted_at IS NULL`,
      [id]
    );
    return result.rows[0];
  }

  static async create(projectData) {
    const {
      project_name,
      start_date,
      end_date,
      description,
      technologies,
      image,
      user_id
    } = projectData;

    const preparedImage = this.prepareImageData(image);

    const technologiesJson = Array.isArray(technologies)
      ? JSON.stringify(technologies)
      : technologies;

    const result = await pool.query(
      `INSERT INTO projects 
       (project_name, start_date, end_date, description, technologies, image, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, project_name, start_date, end_date, description, technologies,
                 CASE 
                   WHEN image IS NOT NULL THEN CONCAT('data:image/jpeg;base64,', encode(image, 'base64'))
                   ELSE NULL 
                 END as image,
                 created_at, updated_at`,
      [
        project_name, 
        start_date, 
        end_date, 
        description, 
        technologiesJson,
        preparedImage,
        user_id
      ]
    );
    return result.rows[0];
  }

  static async update(id, projectData) {
    const {
      project_name,
      start_date,
      end_date,
      description,
      technologies,
      image
    } = projectData;

    const preparedImage = this.prepareImageData(image);

    let technologiesJson;
    try {
      if (Array.isArray(technologies)) {
        technologiesJson = JSON.stringify(technologies);
      } else if (typeof technologies === 'string') {
        JSON.parse(technologies);
        technologiesJson = technologies;
      } else {
        throw new Error('Invalid technologies format');
      }
    } catch (err) {
      console.error('Invalid technologies format:', technologies);
      throw new Error('Technologies must be a valid JSON array or JSON string');
    }

    const result = await pool.query(
      `UPDATE projects 
       SET project_name = $1, start_date = $2, end_date = $3, 
           description = $4, technologies = $5, 
           image = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND deleted_at IS NULL
       RETURNING id, project_name, start_date, end_date, description, technologies,
                 CASE 
                   WHEN image IS NOT NULL THEN CONCAT('data:image/jpeg;base64,', encode(image, 'base64'))
                   ELSE NULL 
                 END as image,
                 created_at, updated_at`,
      [
        project_name, 
        start_date, 
        end_date, 
        description, 
        technologiesJson,
        preparedImage,
        id
      ]
    );
    return result.rows[0];
  }

  static async softDelete(id) {
    const result = await pool.query(
      `UPDATE projects 
       SET deleted_at = CURRENT_TIMESTAMP 
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, project_name`,
      [id]
    );
    return result.rows[0];
  }

  static async restore(id) {
    const result = await pool.query(
      `UPDATE projects 
       SET deleted_at = NULL 
       WHERE id = $1
       RETURNING id, project_name`,
      [id]
    );
    return result.rows[0];
  }

  static async hardDelete(id) {
    const result = await pool.query(
      'DELETE FROM projects WHERE id = $1 RETURNING id, project_name',
      [id]
    );
    return result.rows[0];
  }

  static async getDeleted() {
    const result = await pool.query(
      `SELECT 
        p.id, 
        p.project_name, 
        p.start_date, 
        p.end_date, 
        p.description, 
        p.technologies,
        CASE 
          WHEN p.image IS NOT NULL THEN CONCAT('data:image/jpeg;base64,', encode(p.image, 'base64'))
          ELSE NULL 
        END as image,
        p.created_at, 
        p.updated_at, 
        p.deleted_at,
        u.username as author
      FROM projects p
      JOIN users u ON p.user_id = u.id
      WHERE p.deleted_at IS NOT NULL 
      ORDER BY p.deleted_at DESC`
    );
    return result.rows;
  }

  static async getUserProjects(userId) {
    const result = await pool.query(
      `SELECT 
        id, 
        project_name, 
        start_date, 
        end_date, 
        description, 
        technologies,
        CASE 
          WHEN image IS NOT NULL THEN CONCAT('data:image/jpeg;base64,', encode(image, 'base64'))
          ELSE NULL 
        END as image,
        created_at, 
        updated_at
      FROM projects
      WHERE user_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  }
}

export default Project;