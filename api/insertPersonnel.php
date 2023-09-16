<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

// Check if the form data is set
if (
    isset($_POST['firstNameInput'], $_POST['lastNameInput'], $_POST['jobTitleInput'], $_POST['emailInput'], $_POST['departmentInput'])
) {
    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    if (mysqli_connect_errno()) {
        $output['status']['code'] = "300";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "database unavailable";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output);

        exit;
    }

    // Validate and sanitize form data
    $firstName = $_POST['firstNameInput'];
    $lastName = $_POST['lastNameInput'];
    $jobTitle = $_POST['jobTitleInput'];
    $email = filter_var($_POST['emailInput'], FILTER_SANITIZE_EMAIL);
    $departmentID = intval($_POST['departmentInput']);

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $output['status']['code'] = "400";
        $output['status']['name'] = "error";
        $output['status']['description'] = "Invalid email format";
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output);

        exit;
    }

    $query = $conn->prepare('INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES(?, ?, ?, ?, ?)');

    $query->bind_param("ssssi", $firstName, $lastName, $jobTitle, $email, $departmentID);

    if (!$query->execute()) {
        $output['status']['code'] = "400";
        $output['status']['name'] = "error";
        $output['status']['description'] = "Query execution failed";
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output);

        exit;
    }

    $query->close();

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);
} else {
    // Handle case where form data is missing
    $output['status']['code'] = "400";
    $output['status']['name'] = "error";
    $output['status']['description'] = "Form data missing";
    $output['data'] = [];

    echo json_encode($output);
}
?>
