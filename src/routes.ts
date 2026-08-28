import type { Request, Response } from "express";
import { Router } from "express";
import ProdutoController from "./controller/ProdutoController.js";
import CategoriaController from "./controller/CategoriaController.js";

const router = Router();

router.get("/api", (req: Request, res: Response) => {
    res.status(200).json({ mensagem: "Ola Mundo!" });
});

// Lista todos os produtos 
router.get("/api/produtos", ProdutoController.todos);
// Adiciona um novo Produto
router.post("/api/produtos", ProdutoController.novo);
// Lista um Produto por ID
router.get("/api/produtos/:idProduto", ProdutoController.produto);
// Remove um Produto
router.delete("/api/produtos/:idProduto", ProdutoController.remover);
// Atualiza um Produto
router.put("/api/produtos/:idProduto", ProdutoController.atualizar);

// Lista todas as categorias
router.get("/api/categorias", CategoriaController.todos);
// Adiciona uma nova Categoria
router.post("/api/categorias", CategoriaController.novo);
// Lista uma Categoria por ID
router.get("/api/categorias/:idCategoria", CategoriaController.categoria);
// Remove uma Categoria
router.get("/api/categorias/:idCategoria", CategoriaController.remover);
// Atuliza uma Categoria
router.put("/api/categorias/:idCategoria", CategoriaController.atualizar)

export { router };