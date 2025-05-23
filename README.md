# Employee Payroll App

A web-based employee payroll app that allows users to **add**, **edit**, **delete**, **search**, **filter**, and **sort** employee records. This project uses **jQuery**, **HTML/CSS**, and **JSON Server** to simulate a real-time backend.

---

## Features
- View employee list in a dynamic table
- Add new employee records with form validation
- Edit existing employee details
- Delete employee records with confirmation
- Search employees by name, email, ID, or department
- Filter by department
- Sort employees by name, salary, or joining date
- Dashboard with live statistics:
  - Total Employees
  - Total Payroll
  - Average Salary
  - Highest & Lowest Salaries
  - Total Departments
- Form validation and user-friendly error messages

## 🛠Tech Stack
- **Frontend**: HTML, CSS, JavaScript (jQuery)
- **Backend**: JSON Server (REST API simulation)

---

## 📁 Folder Structure
project-folder/
├── index.html
├── css/style.css
├── js/script.js
├── db.json # JSON Server database
├── README.md

## Getting Started
### 1. Clone the Repository
### 2. Install JSON Server
npm install -g json-server
### 3. Start JSON Server
json-server --watch db.json --port 3000
Your backend will be running at: http://localhost:3000/employees

## Sample db.json 
{
  "employees": [
    {
      "employeeId": "1",
      "name": "Avinash Yadav",
      "email_address": "avinash@epa.com",
      "phone_number": "9999999998",
      "department": "Engineering",
      "salary": "120000",
      "joinDate": "2025-05-01",
      "address": "Chennai, India",
      "id": "da7e"
    },
    {
      "id": "2b10",
      "employeeId": "5",
      "name": "Harshil Anand",
      "email_address": "harshil@epa.com",
      "phone_number": "6555555555",
      "department": "Sales",
      "salary": "80000",
      "joinDate": "2025-05-16",
      "address": "Mumbai,India"
    }
  ]
}






