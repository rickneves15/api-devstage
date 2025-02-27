import { tool } from 'ai'
import z from 'zod'
import { pg } from '../../drizzle/client'

export const postgresTool = tool({
  description: `
  Realiza uma query noo Postgres para buscar informações sobre as tabelas do banco de dados.
  
  Só pode realizar operações de busca (SELECT), não é permitido a geração  de qualquer operação de escrita.

  Tabelas:
  """
  CREATE TABLE "subscriptions" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "name" text NOT NULL,
    "email" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "subscriptions_email_unique" UNIQUE("email")
  );
  """
  
  Todas as operações devem retornar um máximo de 50 items.
  `.trim(),
  parameters: z.object({
    query: z.string().describe('A query do PostgresSQL para ser executada.'),
    params: z
      .array(z.string())
      .describe('Parâmetros da query a ser executada.'),
  }),
  execute: async ({ query, params }) => {
    const result = await pg.unsafe(query, params)

    return JSON.stringify(result)
  },
})
