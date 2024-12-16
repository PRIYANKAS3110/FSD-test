import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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
  const [message, setMessage] = useState('');
  const router = useRouter();

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
      const res = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
      });
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

  const handleViewDetails = (employee: Employee) => {
    alert(`Employee Details:\nName: ${employee.name}\nEmployee ID: ${employee.employeeId}\nEmail: ${employee.email}\nPhone: ${employee.phone}\nDepartment: ${employee.department}\nRole: ${employee.role}\nJoining Date: ${employee.joiningDate}`);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-50 shadow-md rounded-lg">
    <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Employee List</h1>
  {message && <p className="mb-4 text-green-600 font-medium">{message}</p>}

  <ul className="space-y-4">
    {employees.map((employee) => (
      <li key={employee.id} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold text-gray-800">{employee.name}</p>
          <p className="text-sm text-gray-600">{employee.role} - {employee.department}</p>
        </div>
        <div className="flex space-x-3">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-400 transition"
            onClick={() => handleViewDetails(employee)}
          >
            View
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-400 transition"
            onClick={() => handleDelete(employee.id)}
          >
            Delete
          </button>
        </div>
      </li>
    ))}
  </ul>
</div>

  );
};

export default EmployeeList;
