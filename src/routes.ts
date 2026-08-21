import type { Request, Response } from "express";
import { Router } from "express";
import { ProdutoController } from "./controller/ProdutoController.js";
import { Auth } from "./middlewares/Auth.js";

const router = Router();

router.get("/api", (req: Request, res: Response) => {
    res.status(200).json({ mensagem: "Ola Mundo!" });
});

router.get("/api/produtos", Auth.verifyToken ,ProdutoController.todos);
router.post("/api/produtos", ProdutoController.novo);
router.get("/api/produtos/:idProduto", Auth.verifyToken ,ProdutoController.Produto);
router.delete("/api/produtos/:idProduto", Auth.verifyToken ,ProdutoController.remover);
router.put("/api/produtos/:idProduto", Auth.verifyToken ,ProdutoController.atualizar);

export { router };