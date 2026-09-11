<?php
include 'conexao.php';
header('Content-Type: application/json');

try {
    $stmt = $pdo->query("
        SELECT
            p.produto_id,
            p.nome,
            p.preco,
            p.status,
            p.descricao,
            p.quantidade,
            pm.url AS imagem_url,
            c.categoria AS categoria_nome
        FROM produto p
        LEFT JOIN produto_media pm ON pm.media_id = (SELECT MAX(media_id) FROM produto_media WHERE produto_id = p.produto_id)
        LEFT JOIN produto_categoria pc ON pc.produto_id = p.produto_id
        LEFT JOIN categoria c ON c.categoria_id = pc.categoria_id
    ");

    $produtos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($produtos);
} catch (PDOException $e) {
    echo json_encode(['erro' => 'Erro ao buscar produtos: ' . $e->getMessage()]);
}


