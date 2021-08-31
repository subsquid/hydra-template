# Sample Hydra Project

This is a sample project generated by `hydra-cli scaffold`. Experiment by modifying `schema.graphql` and the mappings in the `mappings` folder.

## Prerequisites

* Node v14x
* Docker

## Bootstrap

```bash
# The dependencies setup relies on de-duplication, use `ci` to get everything right
npm ci

# Start a postgres instance
docker-compose up db # add optional -d flag to detach from terminal

# Apply migrations related to the processor's state keeping tables
npm run processor:migrate

# Apply the project's migrations
npm run db:migrate

# Now you can start processing chain data
npm run processor:start

# The above command will block
# Open a separate terminal and launch the graphql server to query the processed data
npm run query-node:start
```

## Project structure

Hydra tools expect a certain directory layout:

* `generated` - model/server definitions created by `codegen`. Do not alter the contents of this directory manually.
* `server-extension` - a place for custom data models and resolvers defined via `*.model.ts` and `*.resolver.ts` files.
* `chain` - data type definitions for chain events and extrinsics created by `typegen`.
* `mappings` - mapping module.
* `.env` - hydra tools are heavily driven by environment variables defined here or supplied by a shell.

## Development flow

If you modified `schema.graphql`:

```bash
# Run codegen to re-generate model/server files
npm run codegen

# Analyze database state and create a new migration to match generated models
npm run db:create-migration # add -n "myName" to skip the migration name prompt

# Apply the migrations
npm run db:migrate
```

You might want update the `Initial` migration instead of creating a new one (e.g. during the development phase when the production database is not yet set up). In that case it convenient to reset the database schema and start afresh:

```bash
rm db/migrations/LastUnappliedMigration.ts
npm run db:reset
npm run db:create-migration
npm run db:migrate
```

To generate new type definitions for chain events and extrinsics:

```bash
# Review typegen section of manifest.yml (https://docs.subsquid.io/hydra-typegen)

# Delete old definitions
rm -rf chain

# Run typegen tool
npm run typegen
```

## Self-hosted indexer

It is recommended to use a readily set up indexer if available. It takes some time for a freshly started indexer
to get in sync with chain and catch the events.

Have a look at `./indexer/docker-compose.yml` for an example of how you can set up a self-hosted version.

## Misc

For more details, please checkout https://docs.subsquid.io.