import { useEffect, useState } from 'react';

// Define Employee type
interface Employee {
  id: number;
  name: string;
  employeeId: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  joiningDate: string;
}

const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Partial<Employee> | null>(null);
  const [message, setMessage] = useState('');

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees');
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      } else {
        setMessage('Failed to fetch employees');
      }
    } catch (err) {
      setMessage('Error fetching employees');
    }
  };

  useEffect(() => {
    fetchEmployees(); // Fetch employees when page loads
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEmployees(employees.filter((employee) => employee.id !== id)); // Remove deleted employee from UI
        setMessage('Employee deleted successfully!');
      } else {
        setMessage('Failed to delete employee');
      }
    } catch (err) {
      setMessage('Server error');
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee); // Set the employee being edited
  };

  const handleSave = async () => {
    if (!editingEmployee) return;

    try {
      const res = await fetch(`/api/employees/${editingEmployee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEmployee),
      });

      if (res.ok) {
        setMessage('Employee updated successfully!');
        fetchEmployees(); // Refresh employee list
        setEditingEmployee(null); // Reset editing state
      } else {
        setMessage('Failed to update employee');
      }
    } catch (err) {
      setMessage('Server error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof Employee) => {
    if (!editingEmployee) return;
    setEditingEmployee({ ...editingEmployee, [field]: e.target.value });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-50 shadow-md rounded-lg">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Employee List</h1>
      {message && <p className="mb-4 text-green-600 font-medium">{message}</p>}

      <ul className="space-y-4">
        {employees.map((employee) => (
          <li key={employee.id} className="p-4 bg-white rounded-lg shadow-md flex flex-col space-y-2">
            {editingEmployee?.id === employee.id ? (
              <>
                <input
                  type="text"
                  value={editingEmployee.name || ''}
                  onChange={(e) => handleInputChange(e, 'name')}
                  placeholder="Name"
                  className="border px-2 py-1 rounded"
                />
                <input
                  type="text"
                  value={editingEmployee.employeeId || ''}
                  onChange={(e) => handleInputChange(e, 'employeeId')}
                  placeholder="Employee ID"
                  className="border px-2 py-1 rounded"
                />
                <input
                  type="email"
                  value={editingEmployee.email || ''}
                  onChange={(e) => handleInputChange(e, 'email')}
                  placeholder="Email"
                  className="border px-2 py-1 rounded"
                />
                <input
                  type="text"
                  value={editingEmployee.phone || ''}
                  onChange={(e) => handleInputChange(e, 'phone')}
                  placeholder="Phone"
                  className="border px-2 py-1 rounded"
                />
                <input
                  type="text"
                  value={editingEmployee.department || ''}
                  onChange={(e) => handleInputChange(e, 'department')}
                  placeholder="Department"
                  className="border px-2 py-1 rounded"
                />
                <input
                  type="text"
                  value={editingEmployee.role || ''}
                  onChange={(e) => handleInputChange(e, 'role')}
                  placeholder="Role"
                  className="border px-2 py-1 rounded"
                />
                <input
                  type="date"
                  value={editingEmployee.joiningDate?.split('T')[0] || ''}
                  onChange={(e) => handleInputChange(e, 'joiningDate')}
                  className="border px-2 py-1 rounded"
                />
                <div className="flex space-x-2">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md font-medium hover:bg-green-400 transition"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-400 transition"
                    onClick={() => setEditingEmployee(null)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-lg font-semibold text-gray-800">{employee.name}</p>
                  <p className="text-sm text-gray-600">{employee.role} - {employee.department}</p>
                  <p className="text-sm text-gray-600">{employee.email} | {employee.phone}</p>
                  <p className="text-sm text-gray-600">Joining Date: {employee.joiningDate.split('T')[0]}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-400 transition"
                    onClick={() => handleEdit(employee)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-400 transition"
                    onClick={() => handleDelete(employee.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
