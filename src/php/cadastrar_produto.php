<?php
include 'conexao.php';

$nome = $_POST['nome'];
$preco = $_POST['preco'];
$categoria_id = $_POST['categoria_id'];
$quantidade = $_POST['quantidade'];
$descricao = $_POST['descricao'];
$status = 'ativo'; // padrão ao cadastrar

// Inserir produto com quantidade
$stmt = $pdo->prepare("INSERT INTO produto (nome, preco, status, descricao, quantidade) VALUES (?, ?, ?, ?, ?)");
$stmt->execute([$nome, $preco, $status, $descricao, $quantidade]);
$produto_id = $pdo->lastInsertId();

// Relacionar com categoria
$stmt = $pdo->prepare("INSERT INTO produto_categoria (produto_id, categoria_id) VALUES (?, ?)");
$stmt->execute([$produto_id, $categoria_id]);

// Salvar imagem
if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] === UPLOAD_ERR_OK) {
    $img_tmp = $_FILES['imagem']['tmp_name'];
    $img_nome = uniqid() . '-' . $_FILES['imagem']['name'];
    $destino = '../../src/images/' . $img_nome;

    if (move_uploaded_file($img_tmp, $destino)) {
        $url = '/src/images/' . $img_nome;
        $stmt = $pdo->prepare("INSERT INTO produto_media (produto_id, url) VALUES (?, ?)");
        $stmt->execute([$produto_id, $url]);
    }
}

echo "<script>alert('Produto cadastrado com sucesso!'); location.href='../../listadeprodutos.html';</script>";
