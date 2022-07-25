// eslint-disable-next-line @typescript-eslint/no-explicit-any
let fastProto: any = null;

function FastObject<T extends object>(object?: T): T {
  if (fastProto !== null && typeof fastProto.property) {
    const result = fastProto;
    fastProto = FastObject.prototype = null;
    return result;
  }

  fastProto = FastObject.prototype =
    object == null ? Object.create(null) : object;

  // @ts-expect-error this is a hack to make the type checker happy (written by Copilot LOL)
  return new FastObject();
}

const inlineCacheCutoff = 10;

for (let index = 0; index <= inlineCacheCutoff; index++) {
  FastObject();
}

export function insertWithFastProperties<T extends object>(object: T, propName: keyof T, value: T[keyof T]): T {
  object[propName] = value;
  toFastProperties(object);
  return object;
}

export default function toFastProperties<T extends object>(object?: T): T {
  return FastObject(object);
}
