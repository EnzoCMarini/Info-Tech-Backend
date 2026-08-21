import type { Request, Response } from "express";
import { Router } from "express";
import { ProdutoController } from "./controller/ProdutoController.js";

const router = Router();

router.get("/api", (req: Request, res: Response) => {
    res.status(200).json({ mensagem: "Ola Mundo!" });
});

router.get("/api/produtos",ProdutoController.todos);
router.post("/api/produtos", ProdutoController.novo);
router.get("/api/produtos/:idProduto",ProdutoController.Produto);
router.delete("/api/produtos/:idProduto",ProdutoController.remover);
router.put("/api/produtos/:idProduto",ProdutoController.atualizar);

export { router };