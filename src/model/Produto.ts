import { DatabaseModel } from "./DatabaseModel.js";
import { type ProdutoDTO } from "../interface/ProdutoDTO.js";

const database = new DatabaseModel().pool;

class Produto {
    private idProduto: number = 0;
    private idCategoria?: number;
    private codigo: string;
    private nome: string;
    private descricao?: string;
    private precoUnitario: number;
    private quantidadeDisponivel: number;
    private quantidadeMinima: number;
    private dataCadastro: Date;
    private ativo: boolean;

    constructor(
        _idCategoria: number,
        _codigo: string,
        _nome: string,
        _descricao: string,
        _precoUnitario: number,
        _quantidadeDisponivel: number,
        _dataCadastro: Date,
        _ativo?: boolean
    ) {
        this.idCategoria = _idCategoria;
        this.codigo = _codigo;
        this.nome = _nome;
        this.descricao = _descricao || "";
        this.precoUnitario = _precoUnitario;
        this.quantidadeDisponivel = _quantidadeDisponivel;
        this.quantidadeMinima = 0;
        this.dataCadastro = _dataCadastro;
        this.ativo = _ativo ?? true;
    }

    public getIdProduto(): number {
        return this.idProduto;
    }

    public setIdProduto(idProduto: number): void {
        this.idProduto = idProduto;
    }

    public getIdCategoria(): number | undefined {
        return this.idCategoria;
    }

    public setIdCategoria(idCategoria: number): void {
        this.idCategoria = idCategoria;
    }

    public getCodigo(): string {
        return this.codigo;
    }

    public setCodigo(_codigo: string): void {
        this.codigo = _codigo;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(_nome: string): void {
        this.nome = _nome;
    }

    public getDescricao(): string | undefined {
        return this.descricao;
    }

    public setDescricao(_descricao: string): void {
        this.descricao = _descricao;
    }

    public getPrecoUnitario(): number {
        return this.precoUnitario;
    }

    public setPrecoUnitario(_precoUnitario: number): void {
        this.precoUnitario = _precoUnitario;
    }

    public getQuantidadeDisponivel(): number {
        return this.quantidadeDisponivel;
    }

    public setQuantidadeDisponivel(_quantidadeDisponivel: number): void {
        this.quantidadeDisponivel = _quantidadeDisponivel;
    }

    public getQuantidadeMinima(): number {
        return this.quantidadeMinima;
    }

    public setQuantidadeMinima(_quantidadeMinima: number): void {
        this.quantidadeMinima = _quantidadeMinima;
    }

    public getDataCadastro(): Date {
        return this.dataCadastro;
    }

    public setDataCadastro(_dataCadastro: Date): void {
        this.dataCadastro = _dataCadastro;
    }

    public getAtivo(): boolean {
        return this.ativo;
    }

    public setAtivo(_ativo: boolean): void {
        this.ativo = _ativo;
    }

    static async cadastrarProduto(Produto: ProdutoDTO): Promise<boolean> {
        try {
            // Verifica se o código já existe
            const checkCodigoSql = `
                SELECT 1
                FROM produto
                WHERE codigo = $1;
            `;

            const codigoExists = await database.query(
                checkCodigoSql,
                [Produto.codigo]
            );

            if (codigoExists.rows.length > 0) {
                console.warn(`Tentativa de cadastrar código duplicado: ${Produto.codigo}`);

                return false;
            }

            const queryInsertProduto = `
                INSERT INTO Produto (id_categoria, codigo, nome, descricao, preco_unitario, quantidade_disponivel, quantidade_minima, ativo, data_cadastro)VALUES 
                ($1, $2, $3, $4, $5, $6, $7, $8, $9);
            `;

            const respostaBD = await database.query(
                queryInsertProduto,
                [
                    Produto.idCategoria,
                    Produto.codigo,
                    Produto.nome,
                    Produto.descricao || "",
                    Produto.precoUnitario,
                    Produto.quantidadeDisponivel ?? 0,
                    Produto.quantidadeMinima ?? 0,
                    Produto.ativo,
                    Produto.dataCadastro
                ]
            );

            console.info(`Produto cadastrado com sucesso. ${respostaBD.command}`);

            return true;
        } catch (error) {
            console.error(`Erro ao cadastrar Produto no banco de dados: ${error}`);

            return false;
        }
    }

    static async listarProdutos(): Promise<Array<Produto> | null> {
        try {
            const listaProdutos: Array<Produto> = [];

            const querySelectProdutos = `
                SELECT * FROM produto
            `;

            const respostaBD = await database.query(querySelectProdutos);

            respostaBD.rows.forEach((ProdutoBD) => {

                const novo = new Produto(
                    ProdutoBD.id_categoria,
                    ProdutoBD.codigo,
                    ProdutoBD.nome,
                    ProdutoBD.descricao,
                    ProdutoBD.preco_unitario,
                    ProdutoBD.quantidade_disponivel,
                    ProdutoBD.data_cadastro,
                    ProdutoBD.ativo
                );

                novo.setIdProduto(ProdutoBD.id_produto);
                novo.setQuantidadeMinima(ProdutoBD.quantidade_minima);

                listaProdutos.push(novo);
            });

            return listaProdutos;
        } catch (error) {

            console.error(`Erro ao listar Produtos: ${error}`);

            return null;
        }
    }

    static async listarProduto(idProduto: number): Promise<Produto | null> {
        try {
            const querySelectProduto = `
                SELECT
                    id_produto,
                    id_categoria,
                    codigo,
                    nome,
                    descricao,
                    preco_unitario,
                    quantidade_disponivel,
                    quantidade_minima,
                    data_cadastro,
                    ativo
                FROM produto
                WHERE id_produto = $1;
            `;

            const respostaBD = await database.query(querySelectProduto, [idProduto]);

            if (respostaBD.rows.length === 0) {
                return null;
            }

            const ProdutoBD = respostaBD.rows[0];

            const novoProduto = new Produto(
                ProdutoBD.id_categoria,
                ProdutoBD.codigo,
                ProdutoBD.nome,
                ProdutoBD.descricao,
                ProdutoBD.preco_unitario,
                ProdutoBD.quantidade_disponivel,
                ProdutoBD.data_cadastro,
                ProdutoBD.ativo
            );

            novoProduto.setIdProduto(ProdutoBD.id_produto);
            novoProduto.setQuantidadeMinima(ProdutoBD.quantidade_minima);

            return novoProduto;
        } catch (error) {
            console.error(`Erro ao buscar Produto no banco de dados: ${error}`);

            return null;
        }
    }

    static async deletarProduto(idProduto: number): Promise<boolean> {
        try {
            const queryDeleteProduto = `
                UPDATE produto
                SET ativo = FALSE
                WHERE id_produto = $1
                AND ativo = TRUE;
            `;

            const respostaBD = await database.query(queryDeleteProduto, [idProduto]);

            if (
                respostaBD.rowCount !== null &&
                respostaBD.rowCount > 0
            ) {
                console.info(`Produto desativado com sucesso.`);

                return true;
            }

            return false;
        } catch (error) {
            console.error(`Erro ao desativar Produto no banco de dados: ${error}`);

            return false;
        }
    }

    static async atualizarProduto(Produto: Produto): Promise<boolean> {
        try {

            const checkCodigoSql = `
                SELECT id_produto FROM produto WHERE codigo = $1 AND id_produto != $2;
            `;

            const checkCodigoResult = await database.query(checkCodigoSql,
                [
                    Produto.getCodigo(),
                    Produto.getIdProduto()
                ]
            );

            if (checkCodigoResult.rows.length > 0) {
                console.error(`Código ${Produto.getCodigo()} já existe em outro Produto`);

                return false;
            }

            const sql = `
                UPDATE produto
                SET
                    id_categoria = $1,
                    codigo = $2,
                    nome = $3,
                    descricao = $4,
                    preco_unitario = $5,
                    quantidade_disponivel = $6,
                    quantidade_minima = $7
                    data_cadastro = $8,
                    ativo = $9
                WHERE id_produto = $10;
            `;

            const valores = [
                Produto.getIdCategoria(),
                Produto.getCodigo(),
                Produto.getNome(),
                Produto.getDescricao() || "",
                Produto.getPrecoUnitario(),
                Produto.getQuantidadeDisponivel(),
                Produto.getQuantidadeMinima(),
                Produto.getDataCadastro(),
                Produto.getAtivo(),
                Produto.getIdProduto()
            ];

            const result = await database.query(sql, valores);
            return result.rowCount !== null && result.rowCount > 0;
        } catch (error) {
            console.error(`Falha ao atualizar Produto no banco: ${error}`);
            return false;
        }
    }
}

export default Produto;