import type { Request, Response } from "express";
import Movimentacao from "../model/Movimentacao.js";
import type { MovimentacaoDTO } from "../interface/MovimentacaoDTO.js";

class MovimentacaoController {
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listarMovimentacoes: Array<Movimentacao> | null = await Movimentacao.listarMovimentacoes();
            return res.status(200).json(listarMovimentacoes ?? []);
        } catch (error) {
            console.error(`Erro ao consultar modelo: ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível acessar a lista de Movimentacaos." });
        }
    }

    static async novo(req: Request, res: Response): Promise<Response> {
        try {

            const dadosRecebidosMovimentacao: MovimentacaoDTO = req.body;

            const respostaModelo = await Movimentacao.cadastrarMovimentacao(dadosRecebidosMovimentacao);

            if (respostaModelo) {
                // Status 201 para novo registro
                return res.status(201).json({ mensagem: "Movimentacao cadastrado com sucesso." });
            } else {
                // Status 400 para erro de cadastro
                return res.status(400).json({ mensagem: "Erro ao cadastrar Movimentacao. Verifique os dados." });
            }
        } catch (error) {
            // Log de erro inesperado
            console.error(`Erro no processamento do modelo: ${error}`);

            // Status 500 para erro interno
            return res.status(500).json({ mensagem: "Não foi possível inserir o Movimentacao devido a um erro interno." });
        }
    }

    static async Movimentacao(req: Request, res: Response): Promise<Response> {
        try {
            const idMovimentacao = Number(req.params.idMovimentacao);

            if (Number.isNaN(idMovimentacao) || idMovimentacao <= 0) {
                return res.status(400).json({ mensagem: "ID do Movimentacao inválido." });
            }

            const respostaModelo = await Movimentacao.listarMovimentacao(idMovimentacao);
            return res.status(200).json(respostaModelo);
        } catch (error) {
            console.error(`Erro ao consultar modelo: ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível obter informação de Movimentacao" });
        }
    }

    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const idMovimentacao = Number(req.params.idMovimentacao);

            if (Number.isNaN(idMovimentacao) || idMovimentacao <= 0) {
                return res.status(400).json({ mensagem: "ID do Movimentacao inválido." });
            }

            const result = await Movimentacao.deletarMovimentacao(idMovimentacao);

            if (result) {
                return res.status(200).json({ mensagem: "Movimentacao removido com sucesso." });
            }

            return res.status(404).json({ mensagem: "Movimentacao não encontrado para exclusão." });
        } catch (error) {
            console.error(`Erro ao remover o Movimentacao. ${error}`);
            return res.status(500).json({ mensagem: "Erro ao remover o Movimentacao." });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const idMovimentacao = Number(req.params.idMovimentacao ?? req.params.id);

            if (isNaN(idMovimentacao)) {
                return res.status(400).json({ mensagem: "ID inválido. A atualização requer um identificador numérico." });
            }

            const {
                idProduto,
                idMovimentacaoOrigem,
                tipo,
                motivo,
                precoUnitarioPraticado,
                quantidade,
                valorTotal,
                observacao,
                dataMovimentacao,
            } = req.body;

            if (
                !idProduto ||
                !idMovimentacaoOrigem ||
                !tipo ||
                precoUnitarioPraticado === undefined ||
                quantidade === undefined ||
                !dataMovimentacao
            ) {
                return res.status(400).json({ mensagem: "Erro ao atualizar Movimentacao. Verifique os dados." });
            }

            const movimentacao = new Movimentacao(
                idProduto,
                idMovimentacaoOrigem,
                tipo,
                motivo,
                Number(precoUnitarioPraticado),
                Number(quantidade),
                Number(valorTotal),
                observacao,
                new Date(dataMovimentacao),
            );

            movimentacao.setIdMovimentacao(idMovimentacao);
            movimentacao.setQuantidade(Number(quantidade ?? 0));

            const result = await Movimentacao.atualizarMovimentacao(movimentacao);

            if (result) {
                return res.status(200).json({ mensagem: "Movimentacao atualizada com sucesso." });
            }

            return res.status(400).json({ mensagem: "Falha na atualização: código já existe em outro Movimentacao ou Movimentacao não encontrado." });
        } catch (error) {
            console.error(`[ERRO NA ATUALIZAÇÃO DE MOVIMENTAÇÃO]: ${error}`);

            return res.status(500).json({ mensagem: "Erro interno ao atualizar os dados de Movimentacao." });
        }
    }
}

export default MovimentacaoController;