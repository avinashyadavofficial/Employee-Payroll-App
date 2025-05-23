const BASE_URL = 'http://localhost:3000/employees';
let employees = [], currentFilteredEmployees = [], currentEditId = null;

$(document).ready(() => {
    loadEmployees();
    bindEvents();
});

function bindEvents() {
    $('#add_employee_button').click(showForm);
    $('#back_to_dashboard').click(showDashboard);
    $('#add_employee_form').submit(handleFormSubmit);
    $('#search_form').submit(e => handleSearchFilterSort(e, 'search'));
    $('#filter_department').change(() => handleSearchFilterSort(null, 'filter'));
    $('#sort_select').change(() => handleSearchFilterSort(null, 'sort'));
    $('#add_employee_form button[type="reset"]').click(resetForm);
    $(document).on('click', '.edit-btn', e => editEmployee($(e.target).closest('tr').data('id')));
    $(document).on('click', '.delete-btn', e => deleteEmployee($(e.target).closest('tr').data('id')));
}

async function loadEmployees() {
    try {
        employees = await $.get(BASE_URL);
        console.log(`Loaded ${employees.length} employees`);
        currentFilteredEmployees = [...employees];
        renderEmployees();
        updateStats();
    } catch (error) {
        console.log('Error: Failed to load employees',error);
        showMessage('Failed to load employees. Ensure JSON Server is running.', 'error');
    }
}

function renderEmployees() {
    console.log(`Rendering ${currentFilteredEmployees.length} employees in table`);
    const table = $('#employee_record_body').empty();
    if (!currentFilteredEmployees.length) {
        console.log('No employees to display');
        table.append('<tr><td colspan="8" style="text-align: center;">No employees found</td></tr>');
        return;
    }
    currentFilteredEmployees.forEach(emp => {
        table.append(`
            <tr data-id="${emp.id}">
                <td>${emp.employeeId || emp.id}</td>
                <td>${emp.name || ''}</td>
                <td>${emp.email_address || emp.email || ''}</td>
                <td>${emp.phone_number || emp.phone || ''}</td>
                <td>${emp.department || ''}</td>
                <td>₹${parseFloat(emp.salary || 0).toLocaleString()}</td>
                <td>${formatDate(emp.joinDate || emp.joiningDate)}</td>
                <td>
                    <button class="action-btn edit-btn">Edit</button>
                    <button class="action-btn delete-btn">Delete</button>
                </td>
            </tr>
        `);
    });
}

function updateStats() {
    console.log('Updating dashboard stats');
    const total = employees.length;
    const salaries = employees.map(emp => parseFloat(emp.salary || 0));
    $('#total_employee h2').text(total);
    $('#total_payroll h2').text(`₹${salaries.reduce((sum, s) => sum + s, 0).toLocaleString()}`);
    $('#average_salary h2').text(`₹${total ? Math.round(salaries.reduce((sum, s) => sum + s, 0) / total).toLocaleString() : 0}`);
    $('#highest_salary h2').text(`₹${salaries.length ? Math.max(...salaries).toLocaleString() : 0}`);
    $('#lowest_salary h2').text(`₹${salaries.length ? Math.min(...salaries).toLocaleString() : 0}`);
    $('#total_department h2').text([...new Set(employees.map(emp => emp.department).filter(Boolean))].length);
    console.log(`Stats updated: ${total} employees, ${salaries.length} salaries`);
}

function showForm() {
    console.log(`Showing form for ${currentEditId ? 'editing' : 'adding'} employee`);
    $('#dashboard').hide();
    $('#add_employee_section').show();
    $('#form_title').text(currentEditId ? 'Edit Employee' : 'Add New Employee');
    if (!currentEditId) resetForm();
}

function showDashboard() {
    console.log('Showing dashboard');
    $('#add_employee_section').hide();
    $('#dashboard').show();
    resetForm();
}

async function handleFormSubmit(e) {
    e.preventDefault();
    console.log('Form submitted');
    if (!validateForm()) {
        console.log('Form validation failed');
        return;
    }
    const formData = getFormData();
    console.log('Form data:', formData);
    try {
        if (currentEditId) {
            console.log(`Updating employee ID ${currentEditId}`);
            await $.ajax({ url: `${BASE_URL}/${currentEditId}`, method: 'PUT', contentType: 'application/json', data: JSON.stringify(formData) });
            showMessage('Employee updated successfully!', 'success');
        } else {
            if (employees.some(emp => (emp.employeeId || emp.id) === formData.employeeId)) {
                console.log('Error: Duplicate employee ID');
                showMessage('Employee ID already exists!', 'error');
                return;
            }
            console.log('Adding new employee');
            await $.ajax({ url: BASE_URL, method: 'POST', contentType: 'application/json', data: JSON.stringify(formData) });
            showMessage('Employee added successfully!', 'success');
        }
        await loadEmployees();
        setTimeout(showDashboard, 1500);
    } catch (error) {
        console.log('Error: Failed to save employee',error);
        showMessage('Failed to save employee', 'error');
    }
}

function getFormData() {
    const formData = {
        employeeId: currentEditId ? employees.find(emp => emp.id == currentEditId).employeeId || currentEditId : (Math.max(0, ...employees.map(emp => parseInt(emp.employeeId || emp.id) || 0)) + 1).toString(),
        name: $('#name').val().trim(),
        email_address: $('#email_address').val().trim(),
        phone_number: $('#phone_number').val().trim(),
        department: $('#department').val(),
        salary: $('#salary').val(),
        joinDate: $('#joinDate').val(),
        address: $('#address').val().trim()
    };
    console.log('Generated form data:', formData);
    return formData;
}

function validateForm() {
    console.log('Validating form');
    $('.error_message').hide();
    $('input, select, textarea').css('border-color', '#e1e5e9');
    let isValid = true;

    const fields = [
        { id: 'name', validate: v => v && v.length >= 2 && v.length <= 50, error: 'Name must be 2-50 characters' },
        { id: 'email_address', validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), error: 'Invalid email' },
        { id: 'phone_number', validate: v => /^[6-9]\d{9}$/.test(v), error: 'Phone must be 10 digits starting with 6-9' },
        { id: 'department', validate: v => v, error: 'Select a department' },
        { id: 'salary', validate: v => v >= 25000 && v <= 200000, error: 'Salary must be ₹25,000-₹2,00,000' },
        { id: 'joinDate', validate: v => v && new Date(v) <= new Date(), error: 'Join date cannot be in future' },
        { id: 'address', validate: v => v && v.length >= 10, error: 'Address must be at least 10 characters' }
    ];

    fields.forEach(({ id, validate, error }) => {
        const value = $(`#${id}`).val().trim();
        if (!validate(value)) {
            console.log(`Validation error for ${id}: ${error}`);
            $(`#${id}`).css('border-color', '#dc3545');
            $(`#${id}_error`).text(error).show();
            isValid = false;
        }
    });
    console.log(`Form validation result: ${isValid ? 'Valid' : 'Invalid'}`);
    return isValid;
}

function showMessage(message, type) {
    console.log(`${type.toUpperCase()}: ${message}`);
    $(`#${type}_message`).text(message).show();
    setTimeout(() => $(`#${type}_message`).hide(), 3000);
}

async function editEmployee(id) {
    console.log(`Editing employee with ID ${id}`);
    const emp = employees.find(e => e.id == id);
    if (!emp) {
        console.log('Error: Employee not found');
        return showMessage('Employee not found', 'error');
    }
    currentEditId = id;
    showForm();
    setTimeout(() => {
        $('#employee_id').val(emp.id);
        $('#name').val(emp.name || '');
        $('#email_address').val(emp.email_address || emp.email || '');
        $('#phone_number').val(emp.phone_number || emp.phone || '');
        $('#department').val(emp.department || '');
        $('#salary').val(emp.salary || '');
        $('#joinDate').val(emp.joinDate || emp.joiningDate || '');
        $('#address').val(emp.address || '');
        console.log('Form filled with employee data:', emp);
    }, 100);
}

async function deleteEmployee(id) {
    console.log(`Attempting to delete employee with ID ${id}`);
    if (!confirm('Are you sure you want to delete this employee?')) {
        console.log('Delete cancelled by user');
        return;
    }
    try {
        await $.ajax({ url: `${BASE_URL}/${id}`, method: 'DELETE' });
        console.log(`Employee ID ${id} deleted successfully`);
        showMessage('Employee deleted successfully!', 'success');
        await loadEmployees();
    } catch (error) {
        console.log('Error: Failed to delete employee',error);
        showMessage('Failed to delete employee', 'error');
    }
}

function handleSearchFilterSort(e, action) {
    if (e) e.preventDefault();
    const search = $('#search_input').val().toLowerCase().trim();
    const dept = $('#filter_department').val();
    const sort = $('#sort_select').val();
    console.log(`Handling ${action}: search='${search}', dept='${dept}', sort='${sort}'`);

    currentFilteredEmployees = employees.filter(emp => {
        if (dept !== 'all_department' && emp.department !== dept) return false;
        if (!search) return true;
        return (emp.name || '').toLowerCase().includes(search) ||
               (emp.email_address || emp.email || '').toLowerCase().includes(search) ||
               (emp.department || '').toLowerCase().includes(search) ||
               (emp.employeeId || emp.id || '').toString().includes(search);
    });
    console.log(`Filtered to ${currentFilteredEmployees.length} employees`);

    if (sort) {
        currentFilteredEmployees.sort((a, b) => {
            if (sort === 'sort_name') return (a.name || '').localeCompare(b.name || '');
            if (sort === 'sort_salary') return parseFloat(b.salary || 0) - parseFloat(a.salary || 0);
            if (sort === 'sort_joinDate') return new Date(b.joinDate || b.joiningDate || 0) - new Date(a.joinDate || a.joiningDate || 0);
            if (sort === 'sort_department') return (a.department || '').localeCompare(b.department || '');
            return 0;
        });
        console.log(`Sorted employees by ${sort}`);
    }
    renderEmployees();
}

function resetForm() {
    console.log('Resetting form');
    $('#add_employee_form')[0].reset();
    currentEditId = null;
    $('.error_message').hide();
    $('input, select, textarea').css('border-color', '#e1e5e9');
    $('#success_message, #error_message').hide();
}

function formatDate(dateString) {
    const formatted = dateString ? new Date(dateString).toLocaleDateString('en-IN') : '';
    console.log(`Formatted date ${dateString} to ${formatted}`);
    return formatted;
}