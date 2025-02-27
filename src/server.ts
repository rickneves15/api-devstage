import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from './env'
import { accessInviteLinkRoute } from './routes/access-invite-link-route'
import { getRankingRoute } from './routes/get-ranking-route'
import { getSubscriberInvitesClicksRoute } from './routes/get-subscriber-invites-clicks-route'
import { getSubscriberInvitesCountRoute } from './routes/get-subscriber-invites-count-route'
import { getSubscriberRankingPositionRoute } from './routes/get-subscriber-ranking-position'
import { sendMessageRoute } from './routes/send-message-route'
import { subscribeToEventRoute } from './routes/subscribe-to-event-route'

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors)
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Dev Stage',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(accessInviteLinkRoute)
app.register(getRankingRoute)
app.register(getSubscriberInvitesCountRoute)
app.register(getSubscriberInvitesClicksRoute)
app.register(getSubscriberRankingPositionRoute)
app.register(sendMessageRoute)
app.register(subscribeToEventRoute)

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP Server Running')
})
