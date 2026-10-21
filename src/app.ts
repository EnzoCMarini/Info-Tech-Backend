import { database } from "./model/DatabaseModel.js";
import { server } from "./server.js";

const port: number = 3333; //Define a porta que o servidor vai executar

async function iniciarServidor(): Promise<void> {
    const conexaoEstabelecida = await database.testeConexao();

    if (!conexaoEstabelecida) {
        await database.pool.end();
        process.exitCode = 1;
        return;
    }

    server.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
}

void iniciarServidor().catch(async (error: unknown) => {
    console.error("Não foi possível iniciar o servidor:", error);
    await database.pool.end();
    process.exitCode = 1;
});