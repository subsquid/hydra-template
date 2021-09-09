import { createTypeUnsafe } from "@polkadot/types/create";
import { SubstrateEvent, SubstrateExtrinsic } from "@subsquid/hydra-common";
import { Codec } from "@polkadot/types/types";
import { typeRegistry } from ".";

import { Compact } from "@polkadot/types";
import { Moment } from "@polkadot/types/interfaces";

export namespace Timestamp {
  export class SetCall {
    public readonly extrinsic: SubstrateExtrinsic;
    public readonly expectedArgTypes = ["Compact<Moment>"];

    constructor(public readonly ctx: SubstrateEvent) {
      if (ctx.extrinsic === undefined) {
        throw new Error(`No call data has been provided`);
      }
      this.extrinsic = ctx.extrinsic;
    }

    get args(): Set_Args {
      return new Set_Args(this.extrinsic);
    }

    validateArgs(): boolean {
      if (this.expectedArgTypes.length !== this.extrinsic.args.length) {
        return false;
      }
      let valid = true;
      this.expectedArgTypes.forEach((type, i) => {
        if (type !== this.extrinsic.args[i].type) {
          valid = false;
        }
      });
      return valid;
    }
  }

  class Set_Args {
    constructor(public readonly extrinsic: SubstrateExtrinsic) {}

    get now(): Compact<Moment> {
      return createTypeUnsafe<Compact<Moment> & Codec>(
        typeRegistry,
        "Compact<Moment>",
        [this.extrinsic.args[0].value]
      );
    }
  }
}
