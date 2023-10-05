  //LOAD ALL TABLES
  personnelList();
  departmentList();
  locationList();

//FILTER BUTTON CALLS MODAL
$("#filterBtn").click(function () {
  $.ajax({
    type: 'GET',
    url: "api/getAllDepartments.php",
    dataType: "json",
    success: function (get_data) {
      if (get_data.status && get_data.status.code === "200") {
        var response = get_data.data;
        var deptoption = '<option value="">Choose department</option>';
        for (var i = 0; i < response.length; i++) {
          var deptname = response[i].name;
          var departmentId = response[i].id;
          var locname = response[i].locname;
          deptoption += '<option value="' + departmentId + '">' + deptname + ' (' + locname + ')</option>';
        $('#filterDepartmentID').html(deptoption);
        }
      }
    }
  });
  $("#filterDepartmentModal").modal("show");
});


//FILTER PERSONNEL BY DEPARTMENT ID
$("#filterDepartmentForm").on("submit", function (e) {
  // stop the default browser behviour
  e.preventDefault();
  var filterDepartmentID = $('#filterDepartmentID').val();
  //var loadIndGeneral = document.getElementById('loadIndGeneral');
  //loadIndGeneral.style.display = 'block';
  $.ajax({
      type: 'POST',
      data: {
        filterDepartmentID: filterDepartmentID,
    },
    url: "api/filterByDepartment.php",
      dataType: "json",
      success: function (get_data) {
        if (get_data.status && get_data.status.code === "200") {
          var response = get_data.data;
          var tbody = $('.personnelTable tbody');
          tbody.empty();
          for (var i = 0; i < response.length; i++) {
            var firstName = response[i].firstName;
            var lastName = response[i].lastName;
            var email = response[i].email;
            var department = response[i].department;
            var locationName = response[i].location;
            var personnelId = response[i].id;
  
            var tr = '<tr>';
            tr += '<td class="align-middle text-nowrap">' + lastName + ' ' + firstName + '</td>';
            tr += '<td class="align-middle text-nowrap d-none d-md-table-cell">' + department + '</td>';
            tr += '<td class="align-middle text-nowrap d-none d-md-table-cell">' + locationName + '</td>';
            tr += '<td class="align-middle text-nowrap d-none d-md-table-cell">' + email + '</td>';
            tr += '<td class="text-end text-nowrap">';
            tr += '<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="' + personnelId + '"> <i class="fa-solid fa-pencil fa-fw"></i></button> '; 
            tr += '<button type="button" class="btn btn-primary btn-sm deletePersonnelBtn" data-id="' + personnelId + '"> <i class="fa-solid fa-trash fa-fw"></i></button>';
            tr += '</td>';
            tr += '</tr>';
            tbody.append(tr); 
          }
          $('#filterDepartmentModal').modal('hide');
        } else{
          $('#filterDepartmentModal').modal('hide');
        }
      },
      error: function(error) {
          //loadIndGeneral.style.display = 'none';
      }
  });
 // $('#editButton, #closeButton').hide();
});



//FUNCTION FOR ADD BUTTON - PERSONNEL, DEPARTMENT AND LOCATION
$("#addBtn").click(function () {
  if ($("#personnelBtn").hasClass("active")) {
    $.ajax({
      type: 'GET',
      url: "api/getAllDepartments.php",
      dataType: "json",
      success: function (get_data) {
        if (get_data.status && get_data.status.code === "200") {
          var response = get_data.data;
          var deptoption = '<option value="">Choose department</option>';
          for (var i = 0; i < response.length; i++) {
            var deptname = response[i].name;
            var departmentId = response[i].id;
            var locname = response[i].locname;
            deptoption += '<option value="' + departmentId + '">' + deptname + ' (' + locname + ')</option>';
          $('#addPersonnelDepartment').html(deptoption);
          }
        }
      }
    });
    $("#addPersonnelModal").modal("show");
  } else {
    if ($("#departmentsBtn").hasClass("active")) {
      $.ajax({
        type: 'GET',
        url: "api/getAllLocations.php",
        dataType: "json",
        success: function (get_data) {
          if (get_data.status && get_data.status.code === "200") {
            var response = get_data.data;
            var deptoption = '<option value="">Choose location</option>';
            for (var i = 0; i < response.length; i++) {
              var locname = response[i].name;
              var id = response[i].id;
              deptoption += '<option value="' + id + '">' + locname + '</option>';
            $('#addDepartmentLocation').html(deptoption);
            }
          }
        }
      });
      $("#addDepartmentModal").modal("show");
    } else {
      $("#addLocationModal").modal("show");
    }
  }
});




//TABLE SEARCH FOR EMPLOYEE, DEPARTMENTS AND LOCATION
$(document).ready(function() {
  //Default Search
   $("#searchLocationId, #searchDepartmentId").hide();
   $("#searchPersonnelId").on("keyup", function() {
    var searchValue = $(this).val().toLowerCase();
    $(".personnelTable tbody tr").each(function() {
      var rowData = $(this).text().toLowerCase();
      if (rowData.indexOf(searchValue) === -1) {
        $(this).hide();
      } else {
        $(this).show();
      }
    });
  });

  //Personnel Search
   $("#personnelBtn").click(function() {
       $("#searchLocationId, #searchDepartmentId").hide();
       $("#searchPersonnelId").show();
       $("#searchPersonnelId").on("keyup", function() {
        var searchValue = $(this).val().toLowerCase();
        $(".personnelTable tbody tr").each(function() {
          var rowData = $(this).text().toLowerCase();
          if (rowData.indexOf(searchValue) === -1) {
            $(this).hide();
          } else {
            $(this).show();
          }
        });
      });
   });

   //Department Search
   $("#departmentsBtn").click(function() {
       $("#searchLocationId, #searchPersonnelId").hide();
       $("#searchDepartmentId").show();
       $("#searchDepartmentId").on("keyup", function() {
        var searchValue2 = $(this).val().toLowerCase();
        $(".departmentTable tbody tr").each(function() {
          var rowData2 = $(this).text().toLowerCase();
          if (rowData2.indexOf(searchValue2) === -1) {
            $(this).hide();
          } else {
            $(this).show();
          }
        });
      });
   });

    //Location Search
   $("#locationsBtn").click(function() {
    $("#searchDepartmentId, #searchPersonnelId").hide();
    $("#searchLocationId").show();
    $("#searchLocationId").on("keyup", function() {
      var searchValue = $(this).val().toLowerCase();
      $(".locationTable tbody tr").each(function() {
        var rowData = $(this).text().toLowerCase();
        if (rowData.indexOf(searchValue) === -1) {
          $(this).hide();
        } else {
          $(this).show();
        }
      });
    });
  });
 
});


 
//REFRESH TABLE WHEN TAB IS CLICKED
$("#personnelBtn").click(function () {
  document.querySelector('#filterBtn').disabled = false;
  personnelList();
});

$("#departmentsBtn").click(function () {
  document.querySelector('#filterBtn').disabled = true;
  departmentList();
});

$("#locationsBtn").click(function () {
  document.querySelector('#filterBtn').disabled = true;

  locationList();
});

//REFRESH BUTTON
$("#refreshBtn").click(function () {
  if ($("#personnelBtn").hasClass("active")) {
      personnelList();
  } else {
    if ($("#departmentsBtn").hasClass("active")) {
      departmentList();
    } else {
      locationList();
    }
  }
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


// GET PERSONNEL LIST
function personnelList() {
  $.ajax({
    type: 'get',
    url: "api/getAll.php",
    dataType: "json",
    success: function (get_data) {
      if (get_data.status && get_data.status.code === "200") {
        var response = get_data.data;
        var tbody = $('.personnelTable tbody');
        tbody.empty();
        for (var i = 0; i < response.length; i++) {
          var firstName = response[i].firstName;
          var lastName = response[i].lastName;
          var email = response[i].email;
          var department = response[i].department;
          var locationName = response[i].location;
          var personnelId = response[i].id;

          var tr = '<tr>';
          tr += '<td class="align-middle text-nowrap">' + lastName + ' ' + firstName + '</td>';
          tr += '<td class="align-middle text-nowrap d-none d-md-table-cell">' + department + '</td>';
          tr += '<td class="align-middle text-nowrap d-none d-md-table-cell">' + locationName + '</td>';
          tr += '<td class="align-middle text-nowrap d-none d-md-table-cell">' + email + '</td>';
          tr += '<td class="text-end text-nowrap">';
          tr += '<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="' + personnelId + '"> <i class="fa-solid fa-pencil fa-fw"></i></button> '; 
          tr += '<button type="button" class="btn btn-primary btn-sm deletePersonnelBtn" data-id="' + personnelId + '"> <i class="fa-solid fa-trash fa-fw"></i></button>';
          tr += '</td>';
          tr += '</tr>';
          tbody.append(tr); 
        }
      }
    }
  });
}


//GET DEPARTMENT LIST
function departmentList() {
  $.ajax({
    type: 'GET',
    url: "api/getAllDepartments.php",
    dataType: "json",
    success: function (get_data) {
      if (get_data.status && get_data.status.code === "200") {
        var response = get_data.data;
        var tbody = $('.departmentTable tbody'); // Select the table body
        tbody.empty(); // Clear existing rows
        for (var i = 0; i < response.length; i++) {
          var deptname = response[i].name;
          var locname = response[i].locname;
          var departmentId = response[i].id;
          var tr = '<tr>';
          tr += '<td class="align-middle text-nowrap">' + deptname + '</td>';
          tr += '<td class="align-middle text-nowrap d-none d-md-table-cell">' + locname + '</td>';
          tr += '<td class="text-end text-nowrap"><button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="' + departmentId + '"> <i class="fa-solid fa-pencil fa-fw"></i> </button> <button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" data-id="' + departmentId + '"> <i class="fa-solid fa-trash fa-fw"></i></button></td>';
          tr += '</tr>';
          tbody.append(tr);
        }
        
      }
    }
  });
}


//GET LOCATION LIST
function locationList() {
  $.ajax({
    type: 'GET',
    url: "api/getAllLocations.php",
    dataType: "json",
    success: function (get_data) {
      if (get_data.status && get_data.status.code === "200") {
        var response = get_data.data;
        var tbody = $('.locationTable tbody'); // Select the table body
        tbody.empty(); // Clear existing rows
        for (var i = 0; i < response.length; i++) {
          var locname = response[i].name;
          var id = response[i].id;
          var tr = '<tr>';
          tr += '<td class="align-middle text-nowrap">' + locname + '</td>';
          tr += '<td class="text-end text-nowrap">';
          tr += '<button type="button" class="btn btn-primary btn-sm"  data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="' + id + '"><i class="fa-solid fa-pencil fa-fw"></i></button> ';
          tr += '<button type="button" class="btn btn-primary btn-sm deleteLocationBtn" data-id="' + id + '"><i class="fa-solid fa-trash fa-fw"></i></button>';
          tr += '</td>';
          tr += '</tr>';
          tbody.append(tr);
        }
      }
    }
  });
}


//ADD EMPLOYEE
$("#addPersonnelForm").on("submit", function (e) {
  // stop the default browser behviour
  e.preventDefault();
  var firstNameInput = toTitleCase($('#addPersonnelFirstName').val());
  var lastNameInput = toTitleCase($('#addPersonnelLastName').val());
  var jobTitleInput = toTitleCase($('#addPersonnelJobTitle').val());
  var emailInput = $('#addPersonnelEmailAddress').val();
  var departmentInput = $('#addPersonnelDepartment').val();

  //var loadIndGeneral = document.getElementById('loadIndGeneral');
  //loadIndGeneral.style.display = 'block';
  $.ajax({
      type: 'POST',
      data: {
        firstNameInput: firstNameInput,
        lastNameInput: lastNameInput,
        jobTitleInput: jobTitleInput,
        emailInput: emailInput,
        departmentInput: departmentInput,
    },
    url: "api/insertPersonnel.php",
      dataType: "json",
      success: function(data) {
          var response = data.status;
          if (data.status.code === "200") {
              $('#addPersonnelModal').modal('hide');
              personnelList();
              //showSuccessAlert(response.description);
          } else {
              $('#addPersonnelModal').modal('hide');
              //showErrorAlert(response.description);
          }
          //loadIndGeneral.style.display = 'none';
      },
      error: function(error) {
          //loadIndGeneral.style.display = 'none';
      }
  });
 // $('#editButton, #closeButton').hide();
});



$("#editPersonnelModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: "api/getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id") // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted

        $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);

        $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
        $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
        $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
        $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);

        $("#editPersonnelDepartment").html("");

        $.each(result.data.department, function () {
          $("#editPersonnelDepartment").append(
          $("<option>", {
            value: this.id,
            text: this.name }));
        });

        $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);

      } else {
        $("#editPersonnelModal .modal-title").replaceWith(
        "Error retrieving data");

      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editPersonnelModal .modal-title").replaceWith(
      "Error retrieving data");

    } });

});

// Executes when the form button with type="submit" is clicked

$("#editPersonnelForm").on("submit", function (e) {
  // stop the default browser behviour
  e.preventDefault();
  var personnelIDInput = $('#editPersonnelEmployeeID').val();
  var firstNameInput = toTitleCase($('#editPersonnelFirstName').val());
  var lastNameInput = toTitleCase($('#editPersonnelLastName').val());
  var jobTitleInput = toTitleCase($('#editPersonnelJobTitle').val());
  var emailInput = $('#editPersonnelEmailAddress').val();
  var departmentInput = $('#editPersonnelDepartment').val();

  //var loadIndGeneral = document.getElementById('loadIndGeneral');
  //loadIndGeneral.style.display = 'block';
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
      dataType: "json",
      success: function(data) {
          var response = data.status;
          if (data.status.code === "200") {
              $('#editPersonnelModal').modal('hide');
              personnelList();
              //showSuccessAlert(response.description);
          } else {
              $('#editPersonnelModal').modal('hide');
              //showErrorAlert(response.description);
          }
          //loadIndGeneral.style.display = 'none';
      },
      error: function(error) {
          //loadIndGeneral.style.display = 'none';
      }
  });
 // $('#editButton, #closeButton').hide();
});


$(document).on("click", ".deletePersonnelBtn", function () {
  $.ajax({
    url: "api/getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(this).attr("data-id") // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        
        $('#areYouSurePersonnelID').val(result.data.personnel[0].id);
        $("#areYouSurePersonnelName").text(
          result.data["personnel"][0].firstName +
            " " +
            result.data["personnel"][0].lastName
        );

        $("#areYouSurePersonnelModal").modal("show");
      } else {
        $("#areYouSurePersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deleteEmployeeName .modal-title").replaceWith(
        "Error retrieving data"
      );
    }
  });
});


$("#deletePersonnelForm").on("submit", function (e) {
  e.preventDefault();
  var deletePersonnelID = $('#areYouSurePersonnelID').val();

  //var loadIndGeneral = document.getElementById('loadIndGeneral');
  //loadIndGeneral.style.display = 'block';
  $.ajax({
      type: 'POST',
      data: {
          id: deletePersonnelID,
      },
      url: "api/deletePersonnelByID.php",
      dataType: "json",
      success: function(data) {
          var response = data.status;
          if (data.status.code === "200") {
            $('#areYouSurePersonnelModal').modal('hide');
              personnelList();
              //showSuccessAlert(response.description);
          } else {
            $('#areYouSurePersonnelModal').modal('hide');
              //showErrorAlert(response.description);
          }
          //loadIndGeneral.style.display = 'none';
      },
      error: function(error) {
          //loadIndGeneral.style.display = 'none';
      }
  });
});




$("#addDepartmentForm").on("submit", function (e) {
  // stop the default browser behviour
  e.preventDefault();
  var addDepartmentName = toTitleCase($('#addDepartmentName').val());
  var addDepartmentLocation = $('#addDepartmentLocation').val();

  //var loadIndGeneral = document.getElementById('loadIndGeneral');
  //loadIndGeneral.style.display = 'block';
  $.ajax({
      type: 'POST',
      data: {
          deptNameInput: addDepartmentName,
          locationInput: addDepartmentLocation,
      },
      url: "api/insertDepartment.php",
      dataType: "json",
      success: function(data) {
          var response = data.status;
          if (data.status.code === "200") {
              $('#addDepartmentModal').modal('hide');
              departmentList();
              //showSuccessAlert(response.description);
          } else {
              $('#addDepartmentModal').modal('hide');
              //showErrorAlert(response.description);
          }
          //loadIndGeneral.style.display = 'none';
      },
      error: function(error) {
          //loadIndGeneral.style.display = 'none';
      }
  });
 // $('#editButton, #closeButton').hide();
});



$("#editDepartmentModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: "api/getDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id") // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        $("#editDepartmentID").val(result.data.department[0].id);
        $("#editDepartmentName").val(result.data.department[0].name);
        $("#editDepartmentLocation").html("");

        $.each(result.data.location, function () {
          $("#editDepartmentLocation").append(
          $("<option>", {
            value: this.id,
            text: this.name }));
        });

        $("#editDepartmentLocation").val(result.data.department[0].locationID);

      } else {
        $("#editDepartmentModal .modal-title").replaceWith(
        "Error retrieving data");

      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editDepartmentModal .modal-title").replaceWith(
      "Error retrieving data");

    } });

});



$("#editDepartmentForm").on("submit", function (e) {
  // stop the default browser behviour
  e.preventDefault();
  var editDepartmentID = $('#editDepartmentID').val();
  var editDepartmentName = toTitleCase($('#editDepartmentName').val());
  var editDepartmentLocation = $('#editDepartmentLocation').val();

  //var loadIndGeneral = document.getElementById('loadIndGeneral');
  //loadIndGeneral.style.display = 'block';
  $.ajax({
      type: 'POST',
      data: {
          departmentIDInput: editDepartmentID,
          deptNameInput: editDepartmentName,
          locationInput: editDepartmentLocation,
      },
      url: "api/editDepartment.php",
      dataType: "json",
      success: function(data) {
          var response = data.status;
          if (data.status.code === "200") {
              $('#editDepartmentModal').modal('hide');
              departmentList();
              //showSuccessAlert(response.description);
          } else {
              $('#editDepartmentModal').modal('hide');
              //showErrorAlert(response.description);
          }
          //loadIndGeneral.style.display = 'none';
      },
      error: function(error) {
          //loadIndGeneral.style.display = 'none';
      }
  });
 // $('#editButton, #closeButton').hide();
});




$(document).on("click", ".deleteDepartmentBtn", function () {
  $.ajax({
    url: "api/checkDepartmentUse.php",
    // SELECT count(p.id) as departmentCount, d.name as departmentName FROM personnel p LEFT JOIN department d ON ( d.id = p.departmentID) WHERE d.id = ?
    type: "POST",
    dataType: "json",
    data: {
      id: $(this).attr("data-id") // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      if (result.status.code == 200) {
        $("#areYouSureDepartmentID").val(result.data[0].deptid);
        if (result.data[0].departmentCount == 0) {
          $("#areYouSureDeptName").text(result.data[0].departmentName);
          $("#areYouSureDeleteDepartmentModal").modal("show");
        } else {
          $("#cantDeleteDeptName").text(result.data[0].departmentName);
          $("#pc").text(result.data[0].departmentCount);

          $("#cantDeleteDepartmentModal").modal("show");
        }
      } else {
        $("#exampleModal .modal-title").replaceWith("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#exampleModal .modal-title").replaceWith("Error retrieving data");
    } });

});




$("#deleteDepartmentForm").on("submit", function (e) {
  e.preventDefault();
  var deleteDepartmentID = $('#areYouSureDepartmentID').val();

  //var loadIndGeneral = document.getElementById('loadIndGeneral');
  //loadIndGeneral.style.display = 'block';
  $.ajax({
      type: 'POST',
      data: {
          id: deleteDepartmentID,
      },
      url: "api/deleteDepartmentByID.php",
      dataType: "json",
      success: function(data) {
          if (data.status.code === "200") {
            $('#areYouSureDeleteDepartmentModal').modal('hide');
              departmentList();
              //showSuccessAlert(response.description);
          } else {
            $('#areYouSureDeleteDepartmentModal').modal('hide');
              //showErrorAlert(response.description);
          }
          //loadIndGeneral.style.display = 'none';
      },
      error: function(error) {
          //loadIndGeneral.style.display = 'none';
      }
  });
});




$("#addLocationForm").on("submit", function (e) {
  // stop the default browser behviour
  e.preventDefault();
  var addLocationName = toTitleCase($('#addLocationName').val());

  //var loadIndGeneral = document.getElementById('loadIndGeneral');
  //loadIndGeneral.style.display = 'block';
  $.ajax({
      type: 'POST',
      data: {
        locationNameInput: addLocationName,
      },
      url: "api/insertLocation.php",
      dataType: "json",
      success: function(data) {
          if (data.status.code === "200") {
              $('#addLocationModal').modal('hide');
              locationList();
              //showSuccessAlert(response.description);
          } else {
              $('#addLocationModal').modal('hide');
              //showErrorAlert(response.description);
          }
          //loadIndGeneral.style.display = 'none';
      },
      error: function(error) {
          //loadIndGeneral.style.display = 'none';
      }
  });
 // $('#editButton, #closeButton').hide();
});



$("#editLocationModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: "api/getLocationByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id") // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted

        $("#editLocationID").val(result.data[0].id);
        $("#editLocationName").val(result.data[0].name);
      } else {
        $("#editDepartmentModal .modal-title").replaceWith(
        "Error retrieving data");

      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editDepartmentModal .modal-title").replaceWith(
      "Error retrieving data");

    } });

});



$("#editLocationForm").on("submit", function (e) {
  // stop the default browser behviour
  e.preventDefault();
  var editLocationID = $('#editLocationID').val();
  var editLocationName = toTitleCase($('#editLocationName').val());

  //var loadIndGeneral = document.getElementById('loadIndGeneral');
  //loadIndGeneral.style.display = 'block';
  $.ajax({
      type: 'POST',
      data: {
        locationIDInput: editLocationID,
        locationNameInput: editLocationName,
      },
      url: "api/editLocation.php",
      dataType: "json",
      success: function(data) {
          if (data.status.code === "200") {
              $('#editLocationModal').modal('hide');
              locationList();
              //showSuccessAlert(response.description);
          } else {
              $('#editLocationModal').modal('hide');
              //showErrorAlert(response.description);
          }
          //loadIndGeneral.style.display = 'none';
      },
      error: function(error) {
          //loadIndGeneral.style.display = 'none';
      }
  });
 // $('#editButton, #closeButton').hide();
});




$(document).on("click", ".deleteLocationBtn", function () {
  $.ajax({
    url: "api/checkLocationUse.php",
    // SELECT count(p.id) as departmentCount, d.name as departmentName FROM personnel p LEFT JOIN department d ON ( d.id = p.departmentID) WHERE d.id = ?
    type: "POST",
    dataType: "json",
    data: {
      id: $(this).attr("data-id") // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      if (result.status.code == 200) {
        $("#areYouSureLocationID").val(result.data[0].locid);
        if (result.data[0].locationCount == 0) {
          $("#areYouSureLocName").text(result.data[0].locationName);
          $("#areYouSureDeleteLocationModal").modal("show");
        } else {
          $("#cantDeleteLocName").text(result.data[0].locationName);
          $("#lc").text(result.data[0].locationCount);

          $("#cantDeleteLocationModal").modal("show");
        }
      } else {
        $("#exampleModal .modal-title").replaceWith("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#exampleModal .modal-title").replaceWith("Error retrieving data");
    } });

});



$("#deleteLocationForm").on("submit", function (e) {
  e.preventDefault();
  var deleteLocationID = $('#areYouSureLocationID').val();

  //var loadIndGeneral = document.getElementById('loadIndGeneral');
  //loadIndGeneral.style.display = 'block';
  $.ajax({
      type: 'POST',
      data: {
          id: deleteLocationID,
      },
      url: "api/deleteLocationByID.php",
      dataType: "json",
      success: function(data) {
          if (data.status.code === "200") {
            $('#areYouSureDeleteLocationModal').modal('hide');
              locationList();
              //showSuccessAlert(response.description);
          } else {
            $('#areYouSureDeleteLocationModal').modal('hide');
              //showErrorAlert(response.description);
          }
          //loadIndGeneral.style.display = 'none';
      },
      error: function(error) {
          //loadIndGeneral.style.display = 'none';
      }
  });
});



// CONVERT A STRING TO TITLE CASE
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}