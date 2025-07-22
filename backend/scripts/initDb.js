import pool from '../config/database.js';

const createProjectsTable = async () => {
  try {

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        project_name VARCHAR(255) NOT NULL,
        start_date DATE,
        end_date DATE,
        description TEXT,
        technologies TEXT[],
        image BYTEA,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL
      );
    `;

    await pool.query(createTableQuery);
    console.log('Table "projects" berhasil dibuat atau sudah ada');

    const createTriggerQuery = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
      
      CREATE TRIGGER update_projects_updated_at
          BEFORE UPDATE ON projects
          FOR EACH ROW
          EXECUTE PROCEDURE update_updated_at_column();
    `;

    await pool.query(createTriggerQuery);
    console.log('Trigger untuk update timestamp berhasil dibuat');

    console.log('Testing table structure...');
    const tableInfo = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'projects' 
      ORDER BY ordinal_position;
    `);
    
    console.log('Table structure:');
    tableInfo.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });

    console.log('Database initialization completed successfully');

  } catch (error) {
    console.error('Error creating table:', error.message);
    console.error('Full error:', error);
  } finally {
    pool.end();
  }
};

createProjectsTable();
