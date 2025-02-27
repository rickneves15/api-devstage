import { tool } from 'ai'
import z from 'zod'
import { redis } from '../../redis/client'

export const regisTool = tool({
  description: `
  Realiza um comando no Redis para buscar informações sobre o sistema de indicações como o número de cliques no link, número de indicações (convites) e ranking de indicações.
  
  Só pode realizar operações de buscar dados do Redis, não é executar nenhum comando de escrita.

  Você pode buscar dados de:

  - um hash chamado "referral:access-count" que guarda o número de cliques/acessos no link de cada convite/indicação de cada usuário no formato { "SUBSCRIBER_ID" : NÚMERDE_DE_CLIQUES } onde o SUBSCRIBER_ID que vem do Postgres.
  - um zset chamado "referral:ranking" que guarda o total de convites/indicações feitos por cada usuário onde o score é a quantidade de convites/indicações e o conteúdo é o SUBSCRIBER_ID que vem do Postgres.
  `.trim(),
  parameters: z.object({
    command: z
      .string()
      .describe(
        'O comando a ser executado no Redis como GET, HGET, ZREVRANGE, etc.'
      ),
    params: z
      .array(z.string())
      .describe('Argumentos que vem logo após o comando do Redis.'),
  }),
  execute: async ({ command, params }) => {
    const result = await redis.call(command, params)

    return JSON.stringify(result)
  },
})
