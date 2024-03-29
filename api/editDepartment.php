<?php
$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $deptID = $_POST['departmentIDInput'];
    $deptName = $_POST['deptNameInput'];
    $locationID = $_POST['locationInput'];

    $query = $conn->prepare('UPDATE department SET name=?, locationID=? WHERE id=?');
    $query->bind_param("sii", $deptName, $locationID, $deptID);

    if ($query->execute()) {
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "success";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];
    } else {
        $output['status']['code'] = "400";
        $output['status']['name'] = "error";
        $output['status']['description'] = "Query execution failed";
        $output['data'] = [];
    }

    $query->close();
} else {
    $output['status']['code'] = "400";
    $output['status']['name'] = "error";
    $output['status']['description'] = "Invalid request method";
    $output['data'] = [];
}

mysqli_close($conn);

echo json_encode($output);
?>
