<?php
	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');
	header("Cache-Control: no-cache, must-revalidate");
    header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");

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

	
$id = $_POST['id'];

$checkQuery = $conn->prepare('SELECT 1 FROM department WHERE locationID = ? LIMIT 1');
$checkQuery->bind_param("i", $id);
$checkQuery->execute();
$result = $checkQuery->get_result();

if ($result->num_rows > 0) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "Location is associated with one or more departments. Cannot delete location.";
    $output['data'] = [];

    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

$deleteQuery = $conn->prepare('DELETE FROM location WHERE id = ?');
$deleteQuery->bind_param("i", $id);
$deleteQuery->execute();

if ($deleteQuery->error) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "Error deleting location: " . $deleteQuery->error;
    $output['data'] = [];
} else {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "Location deleted successfully.";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
}

mysqli_close($conn);
echo json_encode($output);
?>