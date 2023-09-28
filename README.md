# Company Directory
## Screenshots

![App Screenshot](https://victorsebiotimo.co.uk/companydirectory/images/companyscr.png)
## Introduction
This is a Company Directory application that allows you to manage and view information about employees within your company. It utilizes a MySQL database to store employee data and provides an API endpoint using PHP for retrieving and updating this information using AJAX.

## Features
* View a list of employees, departments and locations with their details.
* Search for employees, departments and locations, by name or other criteria.
* Add new employees, departments and locations to the database.
* Edit and update existing employees, departments and locations information.
* Delete employees, departments and locations from the directory.

## Technologies Used
* MySQL: Used to store and manage employee data.
* PHP: Provides the API endpoints for interacting with the MySQL database.
* AJAX: Used for making asynchronous requests to the PHP API from the front-end.

## API Endpoints
* **GET /api/getAll.php:** Retrieve a list of all employees.
* **GET /api/getPersonnelByID.php?id={employee_id}:** Retrieve details of a specific employee.
* **POST /api/insertPersonnel.php:** Add a new employee to the database.
* **POST /api/editPersonnel.php.php?id={employee_id}:** Update employee information.
* **POST /api/deletePersonnelByID.php?id={employee_id}:** Delete an employee from the database.

* **GET /api/getAllDepartments.php:** Retrieve a list of all departments.
* **GET /api/getDepartmentByID.php?id={department_id}:** Retrieve details of a specific department.
* **POST /api/insertDepartment.php:** Add a new department to the database.
* **POST /api/editDepartment.php.php?id={department_id}:** Update department information.
* **POST /api/deleteDepartmentByID.php?id={department_id}:** Delete a department from the database.


* **GET /api/getAllLocations.php:** Retrieve a list of all locations.
* **GET /api/getLocationByID.php?id={location_id}:** Retrieve details of a specific location.
* **POST /api/insertLocation.php:** Add a new location to the database.
* **POST /api/editLocation.php.php?id={location_id}:** Update location information.
* **POST /api/deletePersonnelByID.php?id={location_id}:** Delete a location from the database.

## License
This Company Directory project is open-source and available under the MIT License.



