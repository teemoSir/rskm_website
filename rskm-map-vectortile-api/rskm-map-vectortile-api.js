const fs = require('fs')
const path = require('path')
require("dotenv").config()

// LOGGER OPTIONS
let logger = false
if ("SERVER_LOGGER" in process.env) {
  logger = process.env.SERVER_LOGGER === "true" ? { level: 'info' } : { level: process.env.SERVER_LOGGER }
  if ("SERVER_LOGGER_PATH" in process.env) {
    logger.file = process.env.SERVER_LOGGER_PATH
  }
}

const fastify = require("fastify")({ logger: logger })

// EXIT IF POSTGRES_CONNECTION ENV VARIABLE NOT SET
if (!("POSTGRES_CONNECTION" in process.env)) {
  throw new Error("Required ENV variable POSTGRES_CONNECTION is not set. Please see README.md for more information.");
}

// POSTGRES CONNECTION
const postgresConfig = { connectionString: process.env.POSTGRES_CONNECTION }

if (process.env.SSL_ROOT_CERT) {
  postgresConfig.ssl = {
    ca: process.env.SSL_ROOT_CERT
  }
} else if (process.env.SSL_ROOT_CERT_PATH) {
  postgresConfig.ssl = {
    ca: fs.readFileSync(process.env.SSL_ROOT_CERT_PATH).toString()
  }
}

fastify.register(require('@fastify/postgres'), postgresConfig)

// COMPRESSION
// add x-protobuf
fastify.register(
  require('@fastify/compress'),
  { customTypes: /x-protobuf$/ }
)

// CACHE SETTINGS
fastify.register(
  require('@fastify/caching'), {
    privacy: process.env.CACHE_PRIVACY || 'private',
    expiresIn: process.env.CACHE_EXPIRESIN || 3600,
    serverExpiresIn: process.env.CACHE_SERVERCACHE
  }
)

// CORS
fastify.register(require('@fastify/cors'))

// OPTIONAL RATE LIMITER
if ("RATE_MAX" in process.env) {
  fastify.register(import('@fastify/rate-limit'), {
    max: process.env.RATE_MAX,
    timeWindow: '1 minute'
  })
}

// INITIALIZE SWAGGER
fastify.register(require('@fastify/swagger'), {
  exposeRoute: true,
  hideUntagged: true,
  swagger: {
    "basePath": process.env.BASE_PATH || "/",
    "info": {
      "title": "PostGIS HTTP API",
      "description": "PostGIS HTTP API是向应用程序公开地理空间功能的简单方法。它通过HTTP接收简单的请求，并向请求者返回JSON、JSONP或protobuf（Mapbox Vector Tile）。尽管该项目的重点通常是向web应用程序公开PostGIS功能，但您可以使用该框架为任何数据库创建API。",
      "version": process.env.npm_package_version || ""
    },
    "externalDocs": {
      "url": "",
      "description": "Source"
    },
    "tags": [{
      "name": "api",
      "description": "code related end-points"
    }, {
      "name": "feature",
      "description": "features in common formats for direct mapping."
    }, {
      "name": "meta",
      "description": "meta information for tables and views."
    }]
  }
})

// SWAGGER UI
fastify.register(require("@fastify/swagger-ui"), {
  routePrefix: "/"
})

// ADD ROUTES
fastify.register(require('@fastify/autoload'), {
  dir: path.join(__dirname, 'routes')
})

// LAUNCH SERVER
fastify.listen({port: process.env.SERVER_PORT || 3000, host: process.env.SERVER_HOST || 'localhost'}, (err, address) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  console.info(`Server listening on ${address}`)
})
