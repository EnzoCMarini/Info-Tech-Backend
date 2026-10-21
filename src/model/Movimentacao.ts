import { database as databaseModel } from "./DatabaseModel.js";
import { type MovimentacaoDTO } from "../interface/MovimentacaoDTO.js";

const database = databaseModel.pool;

class Movimentacao {
    private idMovimentacao: number = 0;
    private idProduto?: number;
    private idMovimentacaoOrigem?: number;
    private tipo: string;
    private motivo: string;
    private quantidade: number;
    private precoUnitarioPraticado: number;
    private valorTotal?: number;
    private observacao: string;
    private dataMovimentacao: Date;

    constructor(
        _idProduto: number,
        _idMovimentacaoOrigem: number,
        _tipo: string,
        _motivo: string,
        _quantidade: number,
        _precoUnitarioPraticado: number,
        _valorTotal: number,
        _observacao: string,
        _dataMovimmentacao: Date
    ) {
        this.idProduto = _idProduto;
        this.idMovimentacaoOrigem = _idMovimentacaoOrigem;
        this.tipo = _tipo;
        this.motivo = _motivo;
        this.quantidade = _quantidade;
        this.precoUnitarioPraticado = _precoUnitarioPraticado;
        this.valorTotal = _valorTotal || 0;
        this.observacao = _observacao;
        this.dataMovimentacao = _dataMovimmentacao;
    }

    public getIdMovimentacao(): number {
        return this.idMovimentacao;
    }

    public setIdMovimentacao(idMovimentacao: number): void {
        this.idMovimentacao = idMovimentacao;
    }

    public getIdProduto(): number | undefined {
        return this.idProduto;
    }

    public setIdProduto(idProduto: number): void {
        this.idProduto = idProduto;
    }

    public getIdMovimentacaoOrigem(): number | undefined {
        return this.idMovimentacaoOrigem;
    }

    public setIdMovimentacaoOrigem(idMovimentacaoOrigem: number): void {
        this.idMovimentacaoOrigem = idMovimentacaoOrigem;
    }

    public getTipo(): string {
        return this.tipo;
    }

    public setTipo(tipo: string): void {
        this.tipo = tipo;
    }

    public getMotivo(): string {
        return this.motivo;
    }

    public setMotivo(motivo: string): void {
        this.motivo = motivo;
    }

    public getQuantidade(): number {
        return this.quantidade;
    }

    public setQuantidade(quantidade: number): void {
        this.quantidade = quantidade;
    }

    public getPrecoUnitarioPraticado(): number {
        return this.precoUnitarioPraticado;
    }

    public setPrecoUnitarioPraticado(precoUnitarioPraticado: number): void {
        this.precoUnitarioPraticado = precoUnitarioPraticado;
    }

    public getValorTotal(): number | undefined {
        return this.valorTotal;
    }

    public setValorTotal(valorTotal: number): void {
        this.valorTotal = valorTotal;
    }

    public getObservacao(): string {
        return this.observacao;
    }

    public setObservacao(observacao: string): void {
        this.observacao = observacao;
    }

    public getDataMovimentacao(): Date {
        return this.dataMovimentacao;
    }

    public setDataMovimentacao(dataMovimentacao: Date): void {
        this.dataMovimentacao = dataMovimentacao;
    }

    static async cadastrarMovimentacao(Movimentacao: MovimentacaoDTO): Promise<boolean> {
        try {
            const queryInsertMovimentacao = `
                INSERT INTO Movimentacao (id_produto, tipo, motivo, quantidade, observacao)VALUES 
                ($1, $2, $3, $4, $5);
            `;

            const respostaBD = await database.query(
                queryInsertMovimentacao,
                [
                    Movimentacao.idProduto,
                    Movimentacao.tipo,
                    Movimentacao.motivo,
                    Movimentacao.quantidade,
                    Movimentacao.observacao,
                ]
            );

            console.info(`Movimentação cadastrada com sucesso. ${respostaBD.command}`);

            return true;
        } catch (error) {
            console.error(`Erro ao cadastrar Movimentação no banco de dados: ${error}`);

            return false;
        }
    }

    static async listarMovimentacoes(): Promise<Array<Movimentacao> | null> {
        try {
            const listaMovimentacoes: Array<Movimentacao> = [];

            const querySelectMovimentacoes = `
                SELECT * FROM vw_valor_movimentacao_estoque;
            `;

            const respostaBD = await database.query(querySelectMovimentacoes);

            respostaBD.rows.forEach((MovimentacaoBD) => {

                const novo = new Movimentacao(
                    MovimentacaoBD.id_produto,
                    MovimentacaoBD.id_movimentacao_origem,
                    MovimentacaoBD.tipo,
                    MovimentacaoBD.motivo,
                    MovimentacaoBD.quantidade,
                    MovimentacaoBD.preco_unitario_praticado,
                    MovimentacaoBD.valor_total,
                    MovimentacaoBD.observacao,
                    MovimentacaoBD.data_movimentacao
                );

                novo.setIdMovimentacao(MovimentacaoBD.id_movimentacao);

                listaMovimentacoes.push(novo);
            });

            return listaMovimentacoes;
        } catch (error) {

            console.error(`Erro ao listar Movimentações: ${error}`);

            return null;
        }
    }

    static async listarMovimentacao(idMovimentacao: number): Promise<Movimentacao | null> {
        try {
            const querySelectMovimentacao = `
                SELECT
                    id_produto,
                    id_movimentacao_origem,
                    tipo,
                    motivo,
                    quantidade,
                    preco_unitario_praticado,
                    valor_total,
                    observacao,
                    data_movimentacao,
                FROM Movimentacao
                WHERE id_movimentacao = $1;
            `;

            const respostaBD = await database.query(querySelectMovimentacao, [idMovimentacao]);

            if (respostaBD.rows.length === 0) {
                return null;
            }

            const MovimentacaoBD = respostaBD.rows[0];

            const novaMovimentacao = new Movimentacao(
                MovimentacaoBD.id_produto,
                MovimentacaoBD.id_movimentacao_origem,
                MovimentacaoBD.tipo,
                MovimentacaoBD.motivo,
                MovimentacaoBD.quantidade,
                MovimentacaoBD.preco_unitario_praticado,
                MovimentacaoBD.valor_total,
                MovimentacaoBD.observacao,
                MovimentacaoBD.data_movimentacao,
            );

            novaMovimentacao.setIdProduto(MovimentacaoBD.id_produto);

            return novaMovimentacao;
        } catch (error) {
            console.error(`Erro ao buscar Movimentacao no banco de dados: ${error}`);

            return null;
        }
    }

    static async deletarMovimentacao(idMovimentacao: number): Promise<boolean> {
        try {
            const queryDeleteMovimentacao = `
                DELETE FROM Movimentacao
                WHERE id_movimentacao = $1;
            `;

            const respostaBD = await database.query(queryDeleteMovimentacao, [idMovimentacao]);

            if (
                respostaBD.rowCount !== null &&
                respostaBD.rowCount > 0
            ) {
                console.info(`Movimentação deletada com sucesso.`);

                return true;
            }

            return false;
        } catch (error) {
            console.error(`Erro ao deletar movimentação no banco de dados: ${error}`);

            return false;
        }
    }

    static async atualizarMovimentacao(Movimentacao: Movimentacao): Promise<boolean> {
        try {
            const sql = `
                UPDATE movimentacao
                SET
                    id_produto = $1,
                    id_movimentacao_origem = $2,
                    tipo = $3,
                    motivo = $4,
                    quantidade = $5,
                    preco_unitario_praticado = $6
                    observacao = $7
                    data_movimentacao = $8
                WHERE id_motimentacao = $9;
            `;

            const valores = [
                Movimentacao.getIdProduto(),
                Movimentacao.getIdMovimentacaoOrigem(),
                Movimentacao.getTipo(),
                Movimentacao.getMotivo() || "",
                Movimentacao.getQuantidade(),
                Movimentacao.getPrecoUnitarioPraticado(),
                Movimentacao.getObservacao(),
                Movimentacao.getDataMovimentacao(),
                Movimentacao.getIdMovimentacao()
            ];

            const result = await database.query(sql, valores);
            return result.rowCount !== null && result.rowCount > 0;
        } catch (error) {
            console.error(`Falha ao atualizar Produto no banco: ${error}`);
            return false;
        }
    }

}

export default Movimentacao;