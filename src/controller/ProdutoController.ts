import type { Request, Response } from "express";
import Produto from "../model/Produto.js";
import type { ProdutoDTO } from "../interface/ProdutoDTO.js";

class ProdutoController {
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listarProdutos: Array<Produto> | null = await Produto.listarProdutos();

            return res.status(200).json(listarProdutos ?? []);
        } catch (error) {
            console.error(`Erro ao consultar modelo: ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível acessar a lista de Produtos." });
        }
    }

    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidosProduto: ProdutoDTO = req.body;

            if (!dadosRecebidosProduto?.idCategoria || !dadosRecebidosProduto?.codigo || !dadosRecebidosProduto?.nome || dadosRecebidosProduto?.precoUnitario === undefined || dadosRecebidosProduto?.quantidadeDisponivel === undefined || !dadosRecebidosProduto?.dataCadastro) {
                return res.status(400).json({ mensagem: "Dados do produto inválidos. Verifique categoria, código, nome, preço, quantidade e data de cadastro." });
            }

            const respostaModelo = await Produto.cadastrarProduto(dadosRecebidosProduto);

            if (respostaModelo) {
                return res.status(201).json({ mensagem: "Produto cadastrado com sucesso." });
            }

            return res.status(400).json({ mensagem: "Erro ao cadastrar Produto. Verifique os dados." });
        } catch (error) {
            console.error(`Erro no processamento do modelo: ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível inserir o Produto devido a um erro interno." });
        }
    }

    static async Produto(req: Request, res: Response): Promise<Response> {
        try {
            const idProduto = Number(req.params.idProduto);

            if (Number.isNaN(idProduto) || idProduto <= 0) {
                return res.status(400).json({ mensagem: "ID do produto inválido." });
            }

            const respostaModelo = await Produto.listarProduto(idProduto);
            return res.status(200).json(respostaModelo);
        } catch (error) {
            console.error(`Erro ao consultar modelo: ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível obter informação de Produto" });
        }
    }

    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const idProduto = Number(req.params.idProduto);

            if (Number.isNaN(idProduto) || idProduto <= 0) {
                return res.status(400).json({ mensagem: "ID do produto inválido." });
            }

            const result = await Produto.deletarProduto(idProduto);

            if (result) {
                return res.status(200).json({ mensagem: "Produto removido com sucesso." });
            }

            return res.status(404).json({ mensagem: "Produto não encontrado para exclusão." });
        } catch (error) {
            console.error(`Erro ao remover o Produto. ${error}`);
            return res.status(500).json({ mensagem: "Erro ao remover o Produto." });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const idProduto = Number(req.params.idProduto ?? req.params.id);

            if (Number.isNaN(idProduto) || idProduto <= 0) {
                return res.status(400).json({
                    mensagem: "ID inválido. A atualização requer um identificador numérico válido."
                });
            }

            const {
                idCategoria,
                codigo,
                nome,
                descricao,
                precoUnitario,
                quantidadeDisponivel,
                quantidadeMinima,
                dataCadastro,
                ativo
            }: ProdutoDTO = req.body;

            if (!idCategoria || !codigo || !nome || precoUnitario === undefined || quantidadeDisponivel === undefined || !dataCadastro) {
                return res.status(400).json({
                    mensagem: "Categoria, código, nome, preço unitário, quantidade disponível e data de cadastro são obrigatórios."
                });
            }

            const produtoAtualizado = new Produto(
                idCategoria,
                codigo,
                nome,
                descricao ?? "",
                Number(precoUnitario),
                Number(quantidadeDisponivel),
                new Date(dataCadastro),
                ativo ?? true
            );

            produtoAtualizado.setIdProduto(idProduto);
            produtoAtualizado.setQuantidadeMinima(Number(quantidadeMinima ?? 0));

            const result = await Produto.atualizarProduto(produtoAtualizado);

            if (result) {
                return res.status(200).json({ mensagem: "Produto atualizado com sucesso." });
            }

            return res.status(400).json({
                mensagem: "Falha na atualização: código já existe em outro produto ou produto não encontrado."
            });
        } catch (error) {
            console.error(`[ERRO NA ATUALIZAÇÃO DO PRODUTO]: ${error}`);
            return res.status(500).json({
                mensagem: "Erro interno ao atualizar os dados do Produto."
            });
        }
    }
}

export { ProdutoController };
export default ProdutoController;