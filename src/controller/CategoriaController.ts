import type { Request, Response } from "express";
import Categoria from "../model/Categoria.js";
import type { CategoriaDTO } from "../interface/CategoriaDTO.js";

class CategoriaController {
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listarCategorias: Array<Categoria> | null = await Categoria.listarCategorias();

            return res.status(200).json(listarCategorias ?? []);
        } catch (error) {
            console.error(`Erro ao consultar modelo: ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível acessar a lista de Categorias"})
        }
    }

    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            
            const dadosRecebidosCategoria: CategoriaDTO = req.body;

            const respostaModelo = await Categoria.cadastrarCategoria(dadosRecebidosCategoria);

            if(respostaModelo) {
                // Status 201 para novo registro
                return res.status(201).json({ mensagem: "Categoria adicionada com sucesso" });
            } else {
                // Status 400 para erro de cadastro
                return res.status(400).json({ mensagem: "Erro ao adicionar Categoria. Verifique as informações."});
            }
        } catch (error) {
            // Log de erro inesperado
            console.error(`Erro no processamento do modelo: ${error}`);

            // Status 500 para erro interno
            return res.status(500).json({ mensagem: "Não foi possível inserir a Categoria devido a um erro interno."});
        }
    }

    static async categoria(req: Request, res: Response): Promise<Response> {
        try {
            const idCategoria = Number(req.params.idCategoria);

            if (Number.isNaN(idCategoria) || idCategoria <= 0) {
                return res.status(400).json({ mensagem: "ID da categoria inválida"});
            }

            const respostaModelo = await Categoria.listarCategoria(idCategoria);
            return res.status(200).json(respostaModelo);
        } catch (error) {
            console.error(`Erro ao consultar modelo: ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível obter informação da categoria"});
        }
    }

    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const idCategoria = Number(req.params.idCategoria);

            if (Number.isNaN(idCategoria) || idCategoria <= 0) {
                return res.status(400).json({ mensagem: "ID da categoria inválido" });
            }

            const result = await Categoria.deletarCategoria(idCategoria);

            if (result) {
                return res.status(200).json({ mensagem: "Categoria removida com sucesso" });
            }

            return res.status(404).json({ mensagem: "Categoria não encontrada" });
        } catch (error) {
            console.error(`Erro ao remover a categoria. ${error}`);
            return res.status(500).json ({ mensagem: "Erro ao remover a categoria." });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const idCategoria = Number(req.params.idCategoria ?? req.params.id);

            if (isNaN(idCategoria)) {
                return res.status(400).json({ mensagem: "ID inválido.aA atualização requer um identificador numérico" });
            }

            const {
                nome
            } = req.body;

            if (
                !nome
            ) {
                return res.status(400).json ({ mensagem: "Erro ao atualizar categoria. Verifique os dados." });
            }

            const categoria = new Categoria(
                nome
            );

            categoria.setIdCategoria(idCategoria);

            const result = await Categoria.atualizarCategoria(categoria);

            if (result) {
                return res.status(200).json({ mensagem: "Categoria atualizada com sucesso" });
            }

            return res.status(400).json({ mensagem: "Falha na atualização: nome já existe em outra categoria ou categoria não encontrada"});
        } catch (error) {
            console.error(`[ERRO NA ATUALIZAÇÃO DA CATEGORIA]: ${error}`);
            
            return res.status(500).json({ mensagem: "Erro interno ao atualizar os dados da categoria"})
        }
    }
}

export default CategoriaController;