import { NextApiRequest, NextApiResponse } from 'next';
import getDbConnection from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, employeeId, email, phone, department, joiningDate, role } = req.body;

    try {
      const db = getDbConnection(); 
      db.query(
        'SELECT * FROM employees WHERE employeeId = ? OR email = ?',
        [employeeId, email],
        (err, result: any[]) => { 
          if (err) {
            console.error('Database Error:', err.message, err.stack);
            return res.status(500).json({ error: 'Database error', details: err.message });
          }
          if (result && result.length > 0) {
            return res.status(400).json({ error: 'Employee ID or Email already exists' });
          }
          db.query(
            'INSERT INTO employees (name, employeeId, email, phone, department, joiningDate, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, employeeId, email, phone, department, joiningDate, role],
            (insertErr) => {
              if (insertErr) {
                console.error('Insert Error:', insertErr.message, insertErr.stack);
                return res.status(500).json({ error: 'Database error', details: insertErr.message });
              }

              res.status(201).json({ message: 'Employee added successfully!' });
            }
          );
        }
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Unknown Error:', error.message, error.stack);
        res.status(500).json({ error: 'An unknown error occurred', details: error.message });
      } else {
        console.error('Unexpected Error:', error);
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
