import { useState } from 'react';
import { useRouter } from 'next/router';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    department: '',
    joiningDate: '',
    role: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.name) {
        errs.name = 'Name is required';
    } else if (!/^[a-zA-Z\s]{3,50}$/.test(formData.name)) {
        errs.name = 'Name must be 3-50 characters long and should not contain numbers';
    }

    if (!formData.employeeId) {
        errs.employeeId = 'Employee ID is required';
    } else if (!/^[a-zA-Z0-9]{1,10}$/.test(formData.employeeId)) {
        errs.employeeId = 'Invalid Employee ID (1-10 alphanumeric characters)';
    }

    if (!formData.joiningDate) {
        errs.joiningDate = 'Joining date is required';
    } else if (new Date(formData.joiningDate) > new Date()) {
        errs.joiningDate = 'Joining date cannot be in the future';
    }

    if (!formData.role) {
        errs.role = 'Role is required';
    }

    if (!formData.email) {
        errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errs.email = 'Invalid email format';
    }

    if (!formData.phone) {
        errs.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
        errs.phone = 'Phone number must be exactly 10 digits';
    } else if (formData.phone === '0000000000') {
        errs.phone = 'Phone number cannot be all zeros';
    }

    if (!formData.department) {
        errs.department = 'Department is required';
    }

    return errs;
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const res = await fetch('/api/employees/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          setMessage('Employee added successfully!');
          setFormData({
            name: '',
            employeeId: '',
            email: '',
            phone: '',
            department: '',
            joiningDate: '',
            role: '',
          });
          router.push('/employees');
        } else {
          const data = await res.json();
          setMessage(data.error || 'Submission failed');
        }
      } catch (err) {
        setMessage('Server error');
      }
    }
  };

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
      <div className="flex justify-center items-center py-10">
        <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">Add Employee</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Fields */}
            {['name', 'employeeId', 'email', 'phone', 'role'].map((field) => (
              <div key={field}>
                <label className="block text-lg font-medium text-gray-600 capitalize">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder={`Enter ${field}`}
                />
                {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
              </div>
            ))}

            {/* Department Dropdown */}
            <div>
              <label className="block text-lg font-medium text-gray-600">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="">Select Department</option>
                {['HR', 'Engineering', 'Marketing'].map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-lg font-medium text-gray-600">Joining Date</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              {errors.joiningDate && <p className="text-red-500 text-sm">{errors.joiningDate}</p>}
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-500 transition"
              >
                Submit
              </button>
              <button
                type="reset"
                onClick={() =>
                  setFormData({
                    name: '',
                    employeeId: '',
                    email: '',
                    phone: '',
                    department: '',
                    joiningDate: '',
                    role: '',
                  })
                }
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Reset
              </button>
            </div>
          </form>
          {message && <p className="mt-4 text-green-600 font-medium text-center">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
