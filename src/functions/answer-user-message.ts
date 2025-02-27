import { generateText } from 'ai'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import z from 'zod'
import { google } from '../ai/google'
import { openai } from '../ai/openai'
import { postgresTool } from '../ai/tools/postgres-tool'
import { regisTool } from '../ai/tools/redis-tool'
import { db, pg } from '../drizzle/client'
import { schema } from '../drizzle/schema'
import { subscriptions } from '../drizzle/schema/subscriptions'
import { redis } from '../redis/client'

interface answerUserMessageParams {
  message: string
}

export async function answerUserMessage({ message }: answerUserMessageParams) {
  const answer = await generateText({
    model: google,
    prompt: message,
    tools: {
      postgresTool,
      regisTool,
    },
    system:
      `Você é uma I.A responsável por responder dúvidas sobre um evento de programação.
      
      Inclua na resposta somente o que o usuário pediu, sem nenhum texto adicional.

      O retorno deve ser sempre em markdown (sem incluir \`\`\` no início e no final).
      `.trim(),
    maxSteps: 5,
  })
  return { response: answer.text }
}
