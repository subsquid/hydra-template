import { TypeRegistry } from "@polkadot/types";
const typeRegistry = new TypeRegistry();

export { typeRegistry };

export * from "./balances";
export * from "./timestamp";
