import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Classe que representa o modelo de banco de dados.
 */
export class DatabaseModel {

    /**
     * Configuração para conexão com o banco de dados
     */
    private _config: pg.PoolConfig;

    /**
     * Pool de conexões com o banco de dados
     */
    private _pool: pg.Pool;

    /**
     * Construtor da classe DatabaseModel.
     */
    constructor() {
        const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432;

        // Configuração padrão para conexão com o banco de dados
        this._config = {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number.isInteger(port) && port > 0 ? port : undefined,
            max: 10,
            idleTimeoutMillis: 10000
        }

        // Inicialização do pool de conexões
        this._pool = new pg.Pool(this._config);
    }

    /**
     * Método para testar a conexão com o banco de dados.
     *
     * @returns **true** caso a conexão tenha sido feita, **false** caso negativo
     */
    public async testeConexao() {
        try {
            const requiredVariables = ["DB_USER", "DB_HOST", "DB_NAME", "DB_PASSWORD"];
            const missingVariables = requiredVariables.filter((variable) => !process.env[variable]);

            if (missingVariables.length > 0) {
                throw new Error(`Variáveis de ambiente ausentes: ${missingVariables.join(", ")}`);
            }

            if (this._config.port === undefined) {
                throw new Error("DB_PORT deve ser um número inteiro positivo.");
            }

            await this._pool.query("SELECT 1");
            console.log('Database connected!');
            return true;
        } catch (error) {
            console.error('Erro ao conectar ao banco de dados:', error);
            return false;
        }
    }

    /**
     * Getter para o pool de conexões.
     */
    public get pool() {
        return this._pool;
    }
}

export const database = new DatabaseModel();