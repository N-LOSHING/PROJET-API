<?php
require_once 'routes/router.php';
require_once 'config/database.php';

$db = (new Database())->getConnection();
Router::route($db);
?>
