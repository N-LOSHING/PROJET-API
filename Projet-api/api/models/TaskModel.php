<?php
class TaskModel {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAllTasks() {
        $query = "SELECT * FROM tasks ORDER BY id DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
        exit();
    }

    public function addTask($data) {
        $query = "INSERT INTO tasks (date, time, description, skills, comment, rating, difficulty, completed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $success = $stmt->execute([$data['date'], $data['time'], $data['description'], $data['skills'], $data['comment'], $data['rating'], $data['difficulty'], $data['completed']]);
        
        if ($success) {
            return true;
        } else {
            return false;
        }
        exit();
    }

    public function updateTask($data, $id) {
        $id = (int) $id;
        $query ="UPDATE tasks SET date = ?, time = ?, description = ?, skills = ?, comment = ?, rating = ?, difficulty = ?, completed = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $success = $stmt->execute([$data['date'], $data['time'], $data['description'], $data['skills'], $data['comment'], $data['rating'], $data['difficulty'], $data['completed'], $id]);
    
        if ($success) {
            return true;
        } else {
            return false;
        }
        exit();
    }
    

    public function deleteTask($id) {
        $query = "DELETE FROM tasks WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $success = $stmt->execute([$id]);

        if ($success) {
            return true;
        } else {
            return false;
        }
        exit();
    }
}
?>
