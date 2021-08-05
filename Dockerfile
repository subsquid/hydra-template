FROM node:14 AS base

WORKDIR /hydra-project

# install dependencies
ADD package.json .
ADD mappings/package.json mappings/
ADD yarn.lock .
RUN yarn --frozen-lockfile

# codegen / graphql-server
ADD .env .
ADD schema.graphql .
RUN yarn codegen
RUN yarn query-node:build:prod

# mappings
ADD manifest.yml .
RUN yarn typegen
ADD mappings mappings/
RUN yarn mappings:build


FROM base AS processor
CMD ["sh", "-c", "yarn workspace query-node db:sync && yarn db:migrate && yarn processor:start"]


FROM base AS query-node
WORKDIR /hydra-project/generated/graphql-server
ENV WARTHOG_ENV=production
ENV WARTHOG_SUBSCRIPTIONS=true
ENV WARTHOG_DB_ENTITIES=dist/src/**/*.model.js
ENV WARTHOG_DB_SUBSCRIBERS=dist/src/**/*.model.js
ENV WARTHOG_RESOLVERS_PATH=dist/src/**/*.resolver.js
CMD ["sh", "-c", "yarn dotenv:generate && node ./dist/src/index.js"]