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
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-r from-teal-50 to-white">
      {/* Navbar */}
      <nav className="bg-teal-600 text-white shadow-md sticky top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-3xl font-semibold text-white font-poppins">Employee Manager</div>
          <div className="space-x-6 flex items-center">
            <button className="text-white hover:bg-teal-500 px-6 py-2 rounded-md transition-all ease-in-out duration-300 transform hover:scale-105">Dashboard</button>
            <button className="text-white hover:bg-teal-500 px-6 py-2 rounded-md transition-all ease-in-out duration-300 transform hover:scale-105">Profile</button>
            <button className="text-white hover:bg-teal-500 px-6 py-2 rounded-md transition-all ease-in-out duration-300 transform hover:scale-105">Settings</button>
            <div className="relative">
              <button className="text-white px-6 py-2 rounded-md bg-teal-500 hover:bg-teal-400 transition-all ease-in-out duration-300 transform hover:scale-105">Menu</button>
              <div className="absolute right-0 hidden mt-2 bg-white shadow-lg rounded-lg w-48">
                <button className="w-full text-gray-800 px-4 py-2 hover:bg-teal-100">Option 1</button>
                <button className="w-full text-gray-800 px-4 py-2 hover:bg-teal-100">Option 2</button>
                <button className="w-full text-gray-800 px-4 py-2 hover:bg-teal-100">Option 3</button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="w-full flex justify-center py-6">
        <div className="w-full max-w-6xl p-6">
          {/* Search and Title Section */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-extrabold text-gray-800">Employee List</h1>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search employees"
              className="w-1/3 border px-4 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {message && <p className="mb-4 text-green-600 font-medium">{message}</p>}

          {/* Employee Cards */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEmployees.map((employee) => (
              <div key={employee.id} className="p-6 bg-white rounded-lg shadow-xl flex flex-col h-full transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                {editingEmployee?.id === employee.id ? (
                  <>
                    <input
                      type="text"
                      value={editingEmployee.name || ''}
                      onChange={(e) => handleInputChange(e, 'name')}
                      placeholder="Name"
                      className="w-full border px-4 py-2 rounded-lg mb-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="text"
                      value={editingEmployee.employeeId || ''}
                      onChange={(e) => handleInputChange(e, 'employeeId')}
                      placeholder="Employee ID"
                      className="w-full border px-4 py-2 rounded-lg mb-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="email"
                      value={editingEmployee.email || ''}
                      onChange={(e) => handleInputChange(e, 'email')}
                      placeholder="Email"
                      className="w-full border px-4 py-2 rounded-lg mb-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="text"
                      value={editingEmployee.phone || ''}
                      onChange={(e) => handleInputChange(e, 'phone')}
                      placeholder="Phone"
                      className="w-full border px-4 py-2 rounded-lg mb-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="text"
                      value={editingEmployee.department || ''}
                      onChange={(e) => handleInputChange(e, 'department')}
                      placeholder="Department"
                      className="w-full border px-4 py-2 rounded-lg mb-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="text"
                      value={editingEmployee.role || ''}
                      onChange={(e) => handleInputChange(e, 'role')}
                      placeholder="Role"
                      className="w-full border px-4 py-2 rounded-lg mb-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="date"
                      value={editingEmployee.joiningDate?.split('T')[0] || ''}
                      onChange={(e) => handleInputChange(e, 'joiningDate')}
                      className="w-full border px-4 py-2 rounded-lg mb-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <div className="flex space-x-3 mt-4">
                      <button
                        className="w-full bg-teal-500 text-white px-4 py-2 rounded-md font-medium hover:bg-teal-400 transition"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      <button
                        className="w-full bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-400 transition"
                        onClick={() => setEditingEmployee(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-semibold text-teal-700 truncate">{employee.name}</p>
                    <p className="text-sm text-gray-600 truncate">{employee.employeeId}</p>
                    <p className="text-sm text-gray-600 truncate">{employee.email}</p>
                    <p className="text-sm text-gray-600">{employee.phone}</p>
                    <p className="text-sm text-gray-600">{employee.department}</p>
                    <p className="text-sm text-gray-600">{employee.role}</p>
                    <p className="text-sm text-gray-600">{employee.joiningDate}</p>
                    <div className="flex justify-between mt-4">
                      <button
                        className="text-teal-500 hover:text-teal-700 font-medium"
                        onClick={() => handleEdit(employee)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 font-medium"
                        onClick={() => handleDelete(employee.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
