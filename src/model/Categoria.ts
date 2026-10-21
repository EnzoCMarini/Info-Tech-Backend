import { database as databaseModel } from "./DatabaseModel.js";
import { type CategoriaDTO } from "../interface/CategoriaDTO.js";

const database = databaseModel.pool;

class Categoria {
    private idCategoria: number = 0;
    private nome: string;

    constructor(
        _nome: string
    ) {
        this.nome = _nome;
    }

    public getIdCategoria(): number {
        return this.idCategoria;
    }

    public setIdCategoria(idCategoria: number): void {
        this.idCategoria = idCategoria;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(_nome: string): void {
        this.nome = _nome;
    }

    static async listarCategorias(): Promise<Array<Categoria> | null> {
        try {

            const listaCategoria: Array<Categoria> = [];

            const querySelectCategoria = `
                SELECT * FROM Categoria
            `;

            const respostaBD = await database.query(querySelectCategoria);

            respostaBD.rows.forEach((CategoriaBD) => {

                const novo = new Categoria(
                    CategoriaBD.nome
                );

                listaCategoria.push(novo);
            });

            return listaCategoria;
        } catch (error) {

            console.error(`Erro ao listar Categoria: ${error}`);

            return null;
        }
    }

    static async cadastrarCategoria(Categoria: CategoriaDTO): Promise<boolean> {
        try {
            const checkCodigoSql = `
                SELECT 1
                FROM produto
                WHERE codigo = $1;
            `;

            const nomeExists = await database.query(
                checkCodigoSql, [Categoria.nome]
            );

            if (nomeExists.rows.length > 0) {
                console.warn(`Tentativa de cadastrar categoria duplicada: ${Categoria.nome}`);

                return false;
            }

            const queryInsertCategoria = `
                INSERT INTO Categoria (nome) VALUES
                ($1)
            `;

            const respostaBD = await database.query(
                queryInsertCategoria,
                [
                    Categoria.nome
                ]
            );

            console.info(`Categoria cadastrada com sucesso. ${respostaBD.command}`);

            return true;
        } catch (error) {
            console.error(`Erro ao cadastrar Categoria no banco de dados: ${error}`);

            return false;
        }
    }

    static async listarCategoria(idCategoria: number): Promise<Categoria | null> {
        try {
            const querySelectCategoria = `
                SELECT
                    id_categoria,
                    nome
                FROM categoria
                WHERE id_categoria = $1;
            `;

            const respostaBD = await database.query(querySelectCategoria, [idCategoria]);

            if (respostaBD.rows.length === 0) {
                return null;
            }

            const CategoriaBD = respostaBD.rows[0];

            const novaCategoria = new Categoria(
                CategoriaBD.nome
            );

            novaCategoria.setIdCategoria(CategoriaBD.id_categoria);

            return novaCategoria;
        } catch (error) {
            console.error(`Erro ao buscar Categoria no banco de dados: ${error}`);

            return null;
        }
    }

    static async deletarCategoria(idCategoria: number): Promise<boolean> {
        try {
            const verificaProdutos = `
                SELECT 1
                FROM Produto
                WHERE id_categoria = $1
                LIMIT 1;
            `;

            const produtos = await database.query(
                verificaProdutos,
                [idCategoria]
            );

            if (produtos.rows.length > 0) {
                console.warn(`Categoria não pode ser deletada pois possui produtos vinculados.`);

                return false;
            }

            const queryDeleteCategoria = `
                DELETE FROM Categoria
                WHERE id_categoria = $1;
            `;

            const respostaBD = await database.query(
                queryDeleteCategoria,
                [idCategoria]
            );

            if (
                respostaBD.rowCount !== null &&
                respostaBD.rowCount > 0
            ) {
                console.info(`Categoria deletada com sucesso`);

                return true;
            }

            console.warn(`Categoria não encontrada`);

            return false;
        } catch (error) {
            console.error(`Erro ao deletar Categoria no banco de dados: ${error}`);

            return false;
        }
    }

    static async atualizarCategoria(Categoria: Categoria): Promise<boolean> {
        try {
            const checkCodigoSql = `
            SELECT id_categoria FROM categoria WHERE nome = $1 AND id_categoria !=2;
            `;

            const checkCodigoResult = await database.query(checkCodigoSql,
                [
                    Categoria.getNome(),
                    Categoria.getIdCategoria()
                ]
            );

            if (checkCodigoResult.rows.length > 0) {
                console.error(`O Nome ${Categoria.getNome()} já existe em outra Categoria`);

                return false;
            }

            const sql = `
                UPDATE categoria
                SET
                    id_nome = $1
                WHERE id_categoria = $2;
            `;

            const valores = [
                Categoria.getNome()
            ];

            const result = await database.query(sql, valores);
            return result.rowCount !== null && result.rowCount > 0;
        } catch (error) {
            console.error(`Falha ao atualizar a Categoria no banco: ${error}`);
            return false;
        }
    }

}

export default Categoria;