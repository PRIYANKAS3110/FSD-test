import { NextApiRequest, NextApiResponse } from 'next';
import getDbConnection from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      const pool = getDbConnection(); // Get the connection pool
      await pool.promise().query('DELETE FROM employees WHERE id = ?', [id]);

      res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
      console.error('Database Error:', error);
      res.status(500).json({ error: 'Database error' });
    }
  } else if (req.method === 'PUT') {
    const { name, employeeId, email, phone, department, role, joiningDate } = req.body;

    try {
      const pool = getDbConnection();
      // Convert joiningDate to MySQL-compatible format
      const formattedDate = new Date(joiningDate).toISOString().split('T')[0];

      const [result]: any = await pool
        .promise()
        .query(
          'UPDATE employees SET name = ?, employeeId = ?, email = ?, phone = ?, department = ?, role = ?, joiningDate = ? WHERE id = ?',
          [name, employeeId, email, phone, department, role, formattedDate, id]
        );

      res.status(200).json({ message: 'Employee updated successfully', result });
    } catch (error) {
      console.error('Database Error:', error);
      res.status(500).json({ error: 'Database error' });
    }
  } else if (req.method === 'GET') {
    const { query } = req.query;

    if (query) {
      try {
        const pool = getDbConnection(); // Get the connection pool
        // SQL query to search employees based on the query
        const [results]: any = await pool.promise().query(
          'SELECT * FROM employees WHERE name LIKE ? OR employeeId LIKE ? OR email LIKE ? OR phone LIKE ? OR department LIKE ? OR role LIKE ?',
          [
            `%${query}%`, // name
            `%${query}%`, // employeeId
            `%${query}%`, // email
            `%${query}%`, // phone
            `%${query}%`, // department
            `%${query}%`, // role
          ]
        );

        res.status(200).json({ results });
      } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Database error' });
      }
    } else {
      res.status(400).json({ error: 'Query parameter is missing' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
