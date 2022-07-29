/*
 * Adapred from: https://github.com/sindresorhus/to-fast-properties
 *
 * Original license:
 *
 * MIT License
 *
 * Copyright (c) Petka Antonov
 * Copyright (c) Benjamin Gruenbaum
 * Copyright (c) John-David Dalton
 * Copyright (c) Sindre Sorhus
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let fastProto: any = null;

function FastObject<T extends object>(object?: T): T {
  if (fastProto !== null && typeof fastProto.property) {
    const result = fastProto;
    fastProto = FastObject.prototype = null;
    return result;
  }

  fastProto = FastObject.prototype = object == null ? Object.create(null) : object;

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
