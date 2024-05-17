<?php
class Router {
    public static function route($conn) {
        $uri = $_SERVER['REQUEST_URI'];
        $method = $_SERVER['REQUEST_METHOD'];

        if (strstr($uri, '/api/index.php') && $method == 'GET') {
            require_once 'controllers/TaskController.php';
            $taskController = new TaskController($conn);
            $taskController->getTasks();
        } elseif (strstr($uri, '/api/index.php') && $method == 'POST') {
            require_once 'controllers/TaskController.php';
            $taskController = new TaskController($conn);
            $postData = json_decode(file_get_contents("php://input"), true);
            $taskController->createTask($postData);
        } elseif (strstr($uri, '/api/index.php') && $method == 'PUT') {
            require_once 'controllers/TaskController.php';
            $taskController = new TaskController($conn);
            $taskId = isset($_GET['id']) ? $_GET['id'] : die();
            $putData = json_decode(file_get_contents("php://input"), true);
            $taskController->updateTask($putData, $taskId);
        } elseif (strstr($uri, '/api/index.php') && $method == 'DELETE') {
            require_once 'controllers/TaskController.php';
            $taskController = new TaskController($conn);
            $taskId = isset($_GET['id']) ? $_GET['id'] : die();
            $taskController->deleteTask($taskId);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Invalid request."));
        }
    }
}
?>
