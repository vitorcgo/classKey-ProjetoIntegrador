<?php
require 'conexao.php';
header('Content-Type: application/json');

// Validação dos dados vindos do formulário
if (
    empty($_POST['produtoId']) ||
    empty($_POST['nome']) ||
    !isset($_POST['preco']) || !is_numeric($_POST['preco']) || $_POST['preco'] < 0 ||
    empty($_POST['descricao']) ||
    !isset($_POST['quantidade']) || filter_var($_POST['quantidade'], FILTER_VALIDATE_INT) === false || $_POST['quantidade'] < 0 ||
    empty($_POST['categoria_id'])
) {
    http_response_code(400);
    echo json_encode(['erro' => 'Dados incompletos']);
    exit;
}

$id = intval($_POST['produtoId']);
$nome = trim($_POST['nome']);
$preco = floatval($_POST['preco']);
$descricao = trim($_POST['descricao']);
$quantidade = intval($_POST['quantidade']);
$categoria_id = intval($_POST['categoria_id']);

// Atualiza os dados na tabela 'produto'
$stmt = $pdo->prepare("UPDATE produto SET nome = ?, preco = ?, descricao = ?, quantidade = ? WHERE produto_id = ?");
$produtoOK = $stmt->execute([$nome, $preco, $descricao, $quantidade, $id]);

// Atualiza categoria na tabela 'produto_categoria'
$stmt2 = $pdo->prepare("UPDATE produto_categoria SET categoria_id = ? WHERE produto_id = ?");
$categoriaOK = $stmt2->execute([$categoria_id, $id]);

// Se imagem foi enviada, processa o upload
if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] === UPLOAD_ERR_OK) {
    $extensao = pathinfo($_FILES['imagem']['name'], PATHINFO_EXTENSION);
    $nomeArquivo = uniqid('produto_', true) . '.' . $extensao;
    $destino = __DIR__ . '/../images/' . $nomeArquivo;

    if (move_uploaded_file($_FILES['imagem']['tmp_name'], $destino)) {
        $urlImagem = 'src/images/' . $nomeArquivo;

        // Atualiza ou insere na tabela produto_media
        $check = $pdo->prepare("SELECT * FROM produto_media WHERE produto_id = ?");
        $check->execute([$id]);

        if ($check->fetch()) {
            $update = $pdo->prepare("UPDATE produto_media SET url = ? WHERE produto_id = ?");
            $update->execute([$urlImagem, $id]);
        } else {
            $insert = $pdo->prepare("INSERT INTO produto_media (produto_id, url) VALUES (?, ?)");
            $insert->execute([$id, $urlImagem]);
        }
    }
}

if ($produtoOK && $categoriaOK) {
    echo json_encode(['mensagem' => 'Produto atualizado com sucesso']);
} else {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao atualizar produto']);
}
