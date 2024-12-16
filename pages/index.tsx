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
    if (!formData.name) errs.name = 'Name is required';
    if (!formData.employeeId) errs.employeeId = 'Employee ID is required';
    if (!/^[a-zA-Z0-9]{1,10}$/.test(formData.employeeId)) errs.employeeId = 'Invalid Employee ID';
    
    
    if (!formData.joiningDate) errs.joiningDate = 'Joining date is required';
    if (new Date(formData.joiningDate) > new Date()) errs.joiningDate = 'Date cannot be in the future';
    if (!formData.role) errs.role = 'Role is required';
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
          // Redirect to the employee list page
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
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
  <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Add Employee</h1>
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
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />
      {errors.joiningDate && <p className="text-red-500 text-sm">{errors.joiningDate}</p>}
    </div>

    {/* Buttons */}
    <div className="flex space-x-4">
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 transition"
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
  {message && <p className="mt-4 text-green-600 font-medium">{message}</p>}
</div>

  );
};

export default AddEmployee;
