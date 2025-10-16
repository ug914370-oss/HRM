class EmployeeManagementSystem {
    constructor() {
        this.employees = JSON.parse(localStorage.getItem('employees')) || [];
        this.currentEditId = null;
        this.nextId = this.getNextId();
        
        this.initializeEventListeners();
        this.displayEmployees();
        this.updateStats();
    }

    getNextId() {
        if (this.employees.length === 0) return 1;
        return Math.max(...this.employees.map(emp => emp.id)) + 1;
    }

    initializeEventListeners() {
        // Form submission
        document.getElementById('employee-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Cancel button
        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.resetForm();
        });

        // Search functionality
        document.getElementById('search-input').addEventListener('input', () => {
            this.filterEmployees();
        });

        // Filter functionality
        document.getElementById('department-filter').addEventListener('change', () => {
            this.filterEmployees();
        });

        document.getElementById('status-filter').addEventListener('change', () => {
            this.filterEmployees();
        });

        // Modal event listeners
        document.getElementById('confirm-delete').addEventListener('click', () => {
            this.confirmDelete();
        });

        document.getElementById('cancel-delete').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal when clicking outside
        document.getElementById('modal').addEventListener('click', (e) => {
            if (e.target.id === 'modal') {
                this.closeModal();
            }
        });
    }

    handleFormSubmit() {
        const formData = new FormData(document.getElementById('employee-form'));
        const employeeData = {
            firstName: formData.get('firstName').trim(),
            lastName: formData.get('lastName').trim(),
            email: formData.get('email').trim(),
            phone: formData.get('phone').trim(),
            position: formData.get('position').trim(),
            department: formData.get('department'),
            salary: parseFloat(formData.get('salary')),
            hireDate: formData.get('hireDate'),
            status: formData.get('status')
        };

        // Validation
        if (!this.validateEmployeeData(employeeData)) {
            return;
        }

        if (this.currentEditId) {
            // Update existing employee
            this.updateEmployee(this.currentEditId, employeeData);
        } else {
            // Add new employee
            this.addEmployee(employeeData);
        }

        this.resetForm();
        this.displayEmployees();
        this.updateStats();
        this.saveToLocalStorage();
    }

    validateEmployeeData(data) {
        // Check for duplicate email (excluding current employee if editing)
        const existingEmployee = this.employees.find(emp => 
            emp.email.toLowerCase() === data.email.toLowerCase() && 
            emp.id !== this.currentEditId
        );

        if (existingEmployee) {
            alert('An employee with this email already exists!');
            return false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Please enter a valid email address!');
            return false;
        }

        // Validate phone format (basic validation)
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(data.phone)) {
            alert('Please enter a valid phone number!');
            return false;
        }

        // Validate salary
        if (data.salary < 0) {
            alert('Salary cannot be negative!');
            return false;
        }

        return true;
    }

    addEmployee(employeeData) {
        const newEmployee = {
            id: this.nextId++,
            ...employeeData,
            createdAt: new Date().toISOString()
        };

        this.employees.push(newEmployee);
        alert('Employee added successfully!');
    }

    updateEmployee(id, employeeData) {
        const index = this.employees.findIndex(emp => emp.id === id);
        if (index !== -1) {
            this.employees[index] = {
                ...this.employees[index],
                ...employeeData,
                updatedAt: new Date().toISOString()
            };
            alert('Employee updated successfully!');
        }
    }

    editEmployee(id) {
        const employee = this.employees.find(emp => emp.id === id);
        if (!employee) return;

        // Populate form with employee data
        document.getElementById('firstName').value = employee.firstName;
        document.getElementById('lastName').value = employee.lastName;
        document.getElementById('email').value = employee.email;
        document.getElementById('phone').value = employee.phone;
        document.getElementById('position').value = employee.position;
        document.getElementById('department').value = employee.department;
        document.getElementById('salary').value = employee.salary;
        document.getElementById('hireDate').value = employee.hireDate;
        document.getElementById('status').value = employee.status;

        // Update form UI
        this.currentEditId = id;
        document.getElementById('form-title').textContent = 'Edit Employee';
        document.getElementById('submit-btn').textContent = 'Update Employee';
        document.getElementById('cancel-btn').style.display = 'inline-block';

        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    }

    deleteEmployee(id) {
        this.employeeToDelete = id;
        document.getElementById('modal').style.display = 'block';
    }

    confirmDelete() {
        if (this.employeeToDelete) {
            this.employees = this.employees.filter(emp => emp.id !== this.employeeToDelete);
            this.displayEmployees();
            this.updateStats();
            this.saveToLocalStorage();
            alert('Employee deleted successfully!');
        }
        this.closeModal();
    }

    closeModal() {
        document.getElementById('modal').style.display = 'none';
        this.employeeToDelete = null;
    }

    resetForm() {
        document.getElementById('employee-form').reset();
        this.currentEditId = null;
        document.getElementById('form-title').textContent = 'Add New Employee';
        document.getElementById('submit-btn').textContent = 'Add Employee';
        document.getElementById('cancel-btn').style.display = 'none';
    }

    displayEmployees(employeesToShow = this.employees) {
        const tbody = document.getElementById('employee-tbody');
        tbody.innerHTML = '';

        if (employeesToShow.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 2rem; color: #666;">No employees found</td></tr>';
            return;
        }

        employeesToShow.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.id}</td>
                <td>${employee.firstName} ${employee.lastName}</td>
                <td>${employee.email}</td>
                <td>${employee.phone}</td>
                <td>${employee.position}</td>
                <td>${employee.department}</td>
                <td>$${employee.salary.toLocaleString()}</td>
                <td>${new Date(employee.hireDate).toLocaleDateString()}</td>
                <td><span class="status-${employee.status.toLowerCase().replace(' ', '-')}">${employee.status}</span></td>
                <td>
                    <button class="btn-edit" onclick="ems.editEmployee(${employee.id})">Edit</button>
                    <button class="btn-delete" onclick="ems.deleteEmployee(${employee.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    filterEmployees() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const departmentFilter = document.getElementById('department-filter').value;
        const statusFilter = document.getElementById('status-filter').value;

        let filteredEmployees = this.employees.filter(employee => {
            const matchesSearch = 
                employee.firstName.toLowerCase().includes(searchTerm) ||
                employee.lastName.toLowerCase().includes(searchTerm) ||
                employee.email.toLowerCase().includes(searchTerm) ||
                employee.position.toLowerCase().includes(searchTerm) ||
                employee.phone.includes(searchTerm);

            const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
            const matchesStatus = !statusFilter || employee.status === statusFilter;

            return matchesSearch && matchesDepartment && matchesStatus;
        });

        this.displayEmployees(filteredEmployees);
    }

    updateStats() {
        document.getElementById('total-employees').textContent = `Total Employees: ${this.employees.length}`;
    }

    saveToLocalStorage() {
        localStorage.setItem('employees', JSON.stringify(this.employees));
    }

    // Export data to CSV
    exportToCSV() {
        if (this.employees.length === 0) {
            alert('No employees to export!');
            return;
        }

        const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Position', 'Department', 'Salary', 'Hire Date', 'Status'];
        const csvContent = [
            headers.join(','),
            ...this.employees.map(emp => [
                emp.id,
                emp.firstName,
                emp.lastName,
                emp.email,
                emp.phone,
                emp.position,
                emp.department,
                emp.salary,
                emp.hireDate,
                emp.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'employees.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

// Initialize the Employee Management System
const ems = new EmployeeManagementSystem();

// Add export button functionality (you can add this button to your HTML if needed)
function exportEmployees() {
    ems.exportToCSV();
}
