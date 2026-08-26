import type { Request, Response } from "express";
import { Router } from "express";
import ProdutoController from "./controller/ProdutoController.js";

const router = Router();

router.get("/api", (req: Request, res: Response) => {
    res.status(200).json({ mensagem: "Ola Mundo!" });
});

// Lista todos os produtos 
router.get("/api/produtos",ProdutoController.todos);
// Adiciona um novo Produto
router.post("/api/produtos", ProdutoController.novo);
// Lista um Produto por ID
router.get("/api/produtos/:idProduto",ProdutoController.Produto);
// Remove um Produto
router.delete("/api/produtos/:idProduto",ProdutoController.remover);
// Atualiza um Produto
router.put("/api/produtos/:idProduto",ProdutoController.atualizar);

export { router };