import * as ERRORS from "../errors.js";
import type { Lyra, PropertiesSchema } from "../types.js";
import { includes } from "../utils.js";

export interface AfterInsertHook {
  <S extends PropertiesSchema = PropertiesSchema>(this: Lyra<S>, id: string): Promise<void> | void;
}

export type Hooks = {
  afterInsert?: AfterInsertHook | AfterInsertHook[];
};

const SUPPORTED_HOOKS = ["afterInsert"];

export function validateHooks(hooks?: Hooks): void | never {
  if (hooks) {
    if (typeof hooks !== "object") {
      throw new Error(ERRORS.INVALID_HOOKS_OBJECT());
    }

    const invalidHooks = Object.keys(hooks).filter(hook => !includes(SUPPORTED_HOOKS, hook));
    if (invalidHooks.length) {
      throw new Error(ERRORS.NON_SUPPORTED_HOOKS(invalidHooks));
    }
  }
}

export async function hookRunner<S extends PropertiesSchema>(
  this: Lyra<S>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  funcs: Function | Function[],
  ...args: unknown[]
): Promise<void> {
  const hooks = Array.isArray(funcs) ? funcs : [funcs];
  for (let i = 0; i < hooks.length; i++) {
    await hooks[i].apply(this, args);
  }
}
