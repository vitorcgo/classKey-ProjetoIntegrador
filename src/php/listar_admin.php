<?php
include 'conexao.php';
header('Content-Type: application/json');

date_default_timezone_set('America/Sao_Paulo');  // Define o fuso horário para São Paulo

try {
    // Buscar administradores com data de criação, último acesso e status
    $stmt = $pdo->query("SELECT admin_id, usuario, data_criacao, data_ultimo_acesso, COALESCE(status, 'ATIVO') as status FROM admin");
    $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($admins);
} catch (PDOException $e) {
    echo json_encode(['erro' => 'Erro ao buscar administradores: ' . $e->getMessage()]);
}
?>
