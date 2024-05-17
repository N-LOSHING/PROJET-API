<?php
class TaskController {
    private $conn;
    private $taskModel;

    public function __construct($db) {
        $this->conn = $db;
        require_once 'models/TaskModel.php';
        $this->taskModel = new TaskModel($db);
    }

    public function getTasks() {
        $tasks = $this->taskModel->getAllTasks();
        echo json_encode($tasks);
    }

    public function createTask($data) {
        $success = $this->taskModel->addTask($data);
        
        if ($success) {
            echo json_encode(['message' => 'Nouvelle tâche créée avec succès']);
        } else {
            echo json_encode(['error' => 'Erreur lors de la création de la tâche']);
        }
    }

    public function updateTask($data, $id) {
    $taskModel = new TaskModel($this->conn);
    $success = $taskModel->updateTask($data, $id);

    if ($success) {
        echo json_encode(['message' => 'Tâche mise à jour avec succès']);
    } else {
        echo json_encode(['error' => 'Erreur lors de la mise à jour de la tâche']);
    }
}

    public function deleteTask($id) {
        $deleted = $this->taskModel->deleteTask($id);
        
        if ($deleted) {
            echo json_encode(['message' => 'Tâche supprimée avec succès']);
        } else {
            echo json_encode(['error' => 'Erreur lors de la suppression de la tâche']);
        }
    }
}
?>
