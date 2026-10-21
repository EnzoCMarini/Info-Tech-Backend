export interface MovimentacaoDTO {
    idMovimentacao?: number;
    idProduto: number; 
    idMovimentacaoOrigem?: number;
    tipo: string;
    motivo: string;
    quantidade: number;
    precoUnitarioPraticado?: number;
    valorTotal?: number;
    observacao: string;
    dataMovimentacao: Date;
}