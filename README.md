# Employee Payroll Application

A **web-based employee payroll application** that allows users to **add**, **edit**, **delete**, **search**, **filter**, and **sort** employee records. It uses **jQuery**, **HTML/CSS**, and **JSON Server** to simulate a real-time backend environment.

---

## Features

- View employee list in a dynamic table  
-  Add new employee records with form validation  
-  Edit existing employee details  
- Delete employee records with confirmation  
- Search employees by name, email, ID, or department  
- Filter by department  
- Sort employees by name, salary, or joining date  

### Dashboard with Live Stats
- Total Employees  
- Total Payroll  
- Average Salary  
- Highest Salary 
- Lowest Salary 
- Total Departments  

---

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (jQuery)  
- **Backend:** JSON Server (REST API simulation)

---

## Getting Started


###  Install JSON Server

```bash
npm install -g json-server
```

###  Start JSON Server

```bash
json-server --watch db.json --port 3000
```

> The backend will be running at: [http://localhost:3000/employees](http://localhost:3000/employees)

---

## Sample `db.json`

```json
{
  "employees": [
    {
      "id": "da7e",
      "employeeId": "1",
      "name": "Avinash Yadav",
      "email_address": "avinash@epa.com",
      "phone_number": "9999999998",
      "department": "Engineering",
      "salary": "120000",
      "joinDate": "2025-05-01",
      "address": "Chennai, India"
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
      "address": "Mumbai, India"
    }
  ]
}
```

---

## 📸 Application Screenshots

![Screenshot 1](a.png)  
![Screenshot 2](b.png)  
![Screenshot 3](c.png)
