$(document).ready(function() {
    personnelList();
    departmentList();
    locationList();
});



//MENU OPTION STORAGE ON BROWSER
const selectedTab = localStorage.getItem('selectedTab');
if (selectedTab) {
    $('a[href="' + selectedTab + '"]').tab('show');
} else {
    $('#personnels-tab').tab('show');
}

$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    const tabId = e.target.getAttribute('href');
    localStorage.setItem('selectedTab', tabId);
});


//LOAD PERSONNEL TABLE AND OPTION
var loadIndPersonnel = document.getElementById("loadIndPersonnel");

function personnelList() {
    $.ajax({
        type: 'get',
        url: "api/getAll.php",
        dataType: 'json',
        success: function(get_data) {
            if (get_data.status && get_data.status.code === "200") {
                var response = get_data.data;
                var tr = '';
                for (var i = 0; i < response.length; i++) {
                    var firstName = response[i].firstName;
                    var lastName = response[i].lastName;
                    var jobTitle = response[i].jobTitle;
                    var email = response[i].email;
                    var department = response[i].department;
                    var location = response[i].location;
                    var idz = response[i].id;
                    tr += '<tr>';
                    tr += '<td><strong><a href="#viewPersonnelModal"  data-toggle="modal" onClick="viewPersonnel(\'' + idz +
                        '\')">' + firstName + ' ' + lastName + '</a></strong></td>';
                    tr += '<td class="d-none d-md-table-cell">' + jobTitle + '</td>';
                    tr += '<td class="d-none d-md-table-cell">' + email + '</td>';
                    tr += '<td>' + department + '</td>';
                    tr += '<td class="d-none d-md-table-cell">' + location + '</td>';
                    tr += '<td>' +
                        '<a href="#editPersonnelModal"  class="m-1 edit" data-toggle="modal" onClick="viewPersonnel(\'' +
                        idz +
                        '\')"><i class="fas fa-edit text-primary" data-toggle="tooltip" title="Edit"></i></a></td>';
                    tr += '<td><div class="d-flex">';


                    tr +=
                        '<a href="#deletePersonnelModal" class="m-1 delete" data-toggle="modal" onclick=$("#delete_id").val("' +
                        idz +
                        '")><i class="fas fa-trash text-danger" data-toggle="tooltip" title="Delete"></i></a>';
                    tr += '</div></td>';
                    tr += '</tr>';
                }
                loadIndPersonnel.style.display = "none";
                $('#personnel_data').html(tr);
            }
        }
    });
}


//ADD PERSONNEL FUNCTION
$("#addPersonnelButton").click(function() {
    var formData = $("#addPersonnelForm").serialize();
    $.ajax({
        url: "api/insertPersonnel.php",
        type: "POST",
        data: formData,
        dataType: "json",
        success: function(response) {
            if (response.status.code === "200") {
                alert("Personnel added successfully!");
                $("#addPersonnelModal").modal("hide");
                personnelList();
                departmentList();
                locationList();
            } else {
                alert("Error: " + response.status.description);
            }
        },
        error: function() {
            alert("Error: Unable to communicate with the server.");
        }
    });
});


// VIEW PERSONNEL
function viewPersonnel(id) {
    $.ajax({
        type: "GET",
        url: "api/getPersonnelByID.php?id=" + id,
        success: function(datax) {
            var response = datax.data.personnel[0];
            $('.edit_personnel #personnelIDInput').val(response.id);
            $('.edit_personnel #firstNameInput').val(response.firstName);
            $('.edit_personnel #lastNameInput').val(response.lastName);
            $('.edit_personnel #jobTitleInput').val(response.jobTitle);
            $('.edit_personnel #emailInput').val(response.email);
            var departmentID = response.departmentID;

            var departmentDropdown = $('.edit_personnel #departmentInput, .view_personnel #departmentInput');
            departmentDropdown.empty();

            datax.data.department.forEach(function(dept) {
                departmentDropdown.append($('<option>', {
                    value: dept.id,
                    text: dept.name + " (" + dept.locname + ")"
                }));
            });

            departmentDropdown.val(departmentID);

            $('.view_personnel #personnelIDInput').val(response.id);
            $('.view_personnel #firstNameInput').val(response.firstName);
            $('.view_personnel #lastNameInput').val(response.lastName);
            $('.view_personnel #jobTitleInput').val(response.jobTitle);
            $('.view_personnel #emailInput').val(response.email);
        }
    });
}



//EDIT PERSONNEL
function editPersonnel() {
    var personnelIDInput = $('.edit_personnel #personnelIDInput').val();
    var firstNameInput = $('.edit_personnel #firstNameInput').val();
    var lastNameInput = $('.edit_personnel #lastNameInput').val();
    var jobTitleInput = $('.edit_personnel #jobTitleInput').val();
    var emailInput = $('.edit_personnel #emailInput').val();
    var departmentInput = $('.edit_personnel #departmentInput').val();
    viewPersonnel(personnelIDInput);
    $.ajax({
        type: 'POST',
        data: {
            personnelIDInput: personnelIDInput,
            firstNameInput: firstNameInput,
            lastNameInput: lastNameInput,
            jobTitleInput: jobTitleInput,
            emailInput: emailInput,
            departmentInput: departmentInput,
        },
        url: "api/editPersonnel.php",
        success: function(data) {
            var response = data.status;
            if (data.status.code === "200") {
                $('#editPersonnelModal').modal('hide');
                personnelList();
                departmentList();
                locationList();
                alert(response.description);
            } else {
                $('#editPersonnelModal').modal('hide');
                alert(response.description);
            }
        }

    })
}


//DELETE PERSONNEL
function deletePersonnel() {
    var id = $('#delete_id').val();
    $('#deletePersonnelModal').modal('hide');
    $.ajax({
        type: 'POST',
        data: {
            id: id,
        },
        url: "api/deletePersonnelByID.php",
        success: function(data) {
            var response = data.status;
            if (data.status.code === "200") {
                personnelList();
                departmentList();
                locationList();
                alert(response.description);
            } else {
                alert(response.description);
            }
        }
    })
}


// LOAD DEPARTMENT TABLE AND OPTIONS
var loadIndDepartment = document.getElementById("loadIndDepartment");

function departmentList() {
    $.ajax({
        type: 'GET',
        url: "api/getAllDepartments.php",
        dataType: 'json',
        success: function(get_data) {
            if (get_data.status && get_data.status.code === "200") {
                var response = get_data.data;
                var tr = '';
                var deptoption = '<option value="">Choose Department</option>';
                for (var i = 0; i < response.length; i++) {
                    var deptname = response[i].name;
                    var locid = response[i].locationID;
                    var locname = response[i].locname;
                    var idz = response[i].id;
                    tr += '<tr>';
                    tr += '<td><strong><a href="#viewDepartmentModal"  data-toggle="modal" onClick="viewDepartment(\'' + idz +
                        '\')">' + deptname + '</a></strong></td>';
                    tr += '<td class="d-none d-md-table-cell">' + locname + '</td>';
                    tr += '<td>' + '<a href="#editDepartmentModal"  class="m-1 edit" data-toggle="modal" onClick="viewDepartment(\'' +
                        idz +
                        '\')"><i class="fas fa-edit text-primary" data-toggle="tooltip" title="Edit"></i></a></td>';
                    tr += '<td><div class="d-flex">';
                    tr +=
                        '<a href="#deleteDepartmentModal" class="m-1 delete" data-toggle="modal" onclick=$("#department_id").val("' +
                        idz +
                        '")><i class="fas fa-trash text-danger" data-toggle="tooltip" title="Delete"></i></a>';
                    tr += '</div></td>';
                    tr += '</tr>';
                    deptoption += '<option value="' + idz + '">' + deptname + ' (' + locname + ')</option>';
                }
                loadIndDepartment.style.display = "none";
                $('#department_data').html(tr);
                $('.add_personnel #departmentInput').html(deptoption);
            }
        }
    });
}


//ADD DEPARTMENT
function addDepartment() {
    var deptNameInput = $('.add_department #deptNameInput').val();
    var locationInput = $('.add_department #locationInput').val();
    $.ajax({
        type: 'POST',
        data: {
            deptNameInput: deptNameInput,
            locationInput: locationInput,
        },
        url: "api/insertDepartment.php",
        success: function(data) {
            var response = data.status;
            if (data.status.code === "200") {
                $('#addDepartmentModal').modal('hide');
                personnelList();
                departmentList();
                locationList();
                alert(response.description);
            } else {
                $('#addDepartmentModal').modal('hide');
                alert(response.description);
            }
        }

    })
}


//VIEW DEPARTMENT
function viewDepartment(id) {
    $.ajax({
        type: "GET",
        url: "api/getDepartmentByID.php?id=" + id,
        success: function(datax) {
            var response = datax.data.department[0];
            var locationID = response.locationID;
            console.log(response)
            var locationDropdown = $('.edit_department #locationInput, .view_department #locationInput');
            locationDropdown.empty();

            datax.data.location.forEach(function(dept) {
                locationDropdown.append($('<option>', {
                    value: dept.id,
                    text: dept.name
                }));
            });
            locationDropdown.val(locationID);
            $('.view_department #deptNameInput').val(response.name);
            $('.view_department #locationInput').val(response.locationID);
            $('.edit_department #deptNameInput').val(response.name);
            $('.edit_department #locationInput').val(response.locationID);
            $('.edit_department #departmentIDInput').val(response.id);
        }
    });
}



// EDIT DEPARTMENT
function editDepartment() {
    var deptNameInput = $('.edit_department #deptNameInput').val();
    var locationInput = $('.edit_department #locationInput').val();
    var departmentIDInput = $('.edit_department #departmentIDInput').val();

    $.ajax({
        type: 'POST',
        data: {
            departmentIDInput: departmentIDInput,
            deptNameInput: deptNameInput,
            locationInput: locationInput,
        },
        url: "api/editDepartment.php",
        success: function(data) {
            var response = data.status;
            if (data.status.code === "200") {
                $('#editDepartmentModal').modal('hide');
                personnelList();
                departmentList();
                locationList();
                alert(response.description);
            } else {
                $('#editDepartmentModal').modal('hide');
                alert(response.description);
            }
        }

    })
}




//DELETE DEPARTMENT
function deleteDepartment() {
    var id = $('#department_id').val();
    console.log(id);
    $('#deleteDepartmentModal').modal('hide');
    $.ajax({
        type: 'POST',
        data: {
            id: id,
        },
        url: "api/deleteDepartmentByID.php",
        success: function(data) {
            var response = data.status;
            if (data.status.code === "200") {
                personnelList();
                departmentList();
                locationList();
                alert(response.description);
            } else {
                alert(response.description);
            }
        }
    })
}



//LOAD LOCATION TABLE AND OPTIONS
var loadIndLocation = document.getElementById("loadIndLocation");

function locationList() {
    $.ajax({
        type: 'GET',
        url: "api/getAllLocations.php",
        dataType: 'json',
        success: function(get_data) {
            if (get_data.status && get_data.status.code === "200") {
                var response = get_data.data;
                var tr = '';
                var deptoption = '<option value="">Choose Location</option>';
                for (var i = 0; i < response.length; i++) {
                    var locname = response[i].name;
                    var idz = response[i].id;
                    tr += '<tr>';
                    tr += '<td><strong><a href="#viewLocationModal"  data-toggle="modal" onClick="viewLocation(\'' + idz +
                        '\')">' + locname + '</a></strong></td>';
                    tr += '<td>' + '<a href="#editLocationModal"  class="m-1 edit" data-toggle="modal" onClick="viewLocation(\'' +
                        idz +
                        '\')"><i class="fas fa-edit text-primary" data-toggle="tooltip" title="Edit"></i></a></td>';
                    tr += '<td><div class="d-flex">';
                    tr +=
                        '<a href="#deleteLocationModal" class="m-1 delete" data-toggle="modal" onclick=$("#location_id").val("' +
                        idz +
                        '")><i class="fas fa-trash text-danger" data-toggle="tooltip" title="Delete"></i></a>';
                    tr += '</div></td>';
                    tr += '</tr>';
                    deptoption += '<option value="' + idz + '">' + locname + '</option>';
                }
                loadIndLocation.style.display = "none";
                $('#location_data').html(tr);
                $('.add_department #locationInput').html(deptoption);
            }
        }
    });
}



//ADD LOCATION
function addLocation() {
    var locationNameInput = $('.add_location #locationNameInput').val();
    $.ajax({
        type: 'POST',
        data: {
            locationNameInput: locationNameInput,
        },
        url: "api/insertLocation.php",
        success: function(data) {
            var response = data.status;
            if (data.status.code === "200") {
                $('#addLocationModal').modal('hide');
                personnelList();
                departmentList();
                locationList();
                alert(response.description);
            } else {
                $('#addLocationModal').modal('hide');
                alert(response.description);
            }
        }

    })
}


// VIEW LOCATION
function viewLocation(id) {
    $.ajax({
        type: "POST",
        data: {
            id: id,
        },
        url: "api/getLocationByID.php",
        success: function(datax) {
            var response = datax.data[0];
            $('.view_location #locationNameInput').val(response.name);
            $('.edit_location #locationNameInput').val(response.name);
            $('.edit_location #locationIDInput').val(response.id);
        }
    });
}



//EDIT LOCATION
function editLocation() {
    var locationIDInput = $('.edit_location #locationIDInput').val();
    var locationNameInput = $('.edit_location #locationNameInput').val();
    $.ajax({
        type: 'POST',
        data: {
            locationIDInput: locationIDInput,
            locationNameInput: locationNameInput,
        },
        url: "api/editLocation.php",
        success: function(data) {
            var response = data.status;
            if (data.status.code === "200") {
                $('#editLocationModal').modal('hide');
                personnelList();
                departmentList();
                locationList();
                alert(response.description);
            } else {
                $('#editLocationModal').modal('hide');
                alert(response.description);
            }
        }

    })
}


//DELETE LOCATION
function deleteLocation() {
    var id = $('#location_id').val();
    console.log(id);
    $('#deleteLocationModal').modal('hide');
    $.ajax({
        type: 'POST',
        data: {
            id: id,
        },
        url: "api/deleteLocationByID.php",
        success: function(data) {
            var response = data.status;
            if (data.status.code === "200") {
                personnelList();
                departmentList();
                locationList();
                alert(response.description);
            } else {
                alert(response.description);
            }
        }
    })
}


//SEARCH BAR FOR PERSONNEL, DEPARTMENT AND LOCATION TAB
$("#searchButtonPersonnel").click(function() {
    var searchValue = $("#searchInputPersonnel").val().toLowerCase();
    $("#tblpersonnel tbody tr").each(function() {
        var rowData = $(this).text().toLowerCase();
        if (rowData.indexOf(searchValue) === -1) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
});

$("#searchButtonDept").click(function() {
    var searchValue = $("#searchInputDept").val().toLowerCase();
    $("#tbldept tbody tr").each(function() {
        var rowData = $(this).text().toLowerCase();
        if (rowData.indexOf(searchValue) === -1) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
});

$("#searchButtonLoc").click(function() {
    var searchValue = $("#searchInputLoc").val().toLowerCase();
    $("#tbllocation tbody tr").each(function() {
        var rowData = $(this).text().toLowerCase();
        if (rowData.indexOf(searchValue) === -1) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
});


//FORMS RESET FUNCTION
function clearFormFields() {
    $("#addPersonnelForm")[0].reset();
    $("#addDepartmentForm")[0].reset();
    $("#addLocationForm")[0].reset();
}
$("#addPersonnelModal, #addDepartmentModal, #addLocationModal").on('hidden.bs.modal', function() {
    clearFormFields();
});