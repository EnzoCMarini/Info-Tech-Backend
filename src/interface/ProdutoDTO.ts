/**
 * Interface DTO para transferência de dados do Paciente
 */
export interface ProdutoDTO {
    idProduto?: number;
    idCategoria: number;
    codigo: string;
    nome: string;
    descricao?: string;
    precoUnitario: number;
    quantidadeDisponivel: number;
    quantidadeMinima: number;
    dataCadastro: Date;
    ativo?: boolean;
}
