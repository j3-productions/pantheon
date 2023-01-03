import * as Type from "./types/pantheon";

export function enumerateObject<ValueType>(
    object: Record<string, ValueType>) :
    [Record<number, string>, Record<string, number>] {
  return Object.entries<ValueType>(object).reduce((
      [ai2k, ak2i]: [Record<number, string>, Record<string, number>],
      [nkey, nval]: [string, ValueType],
      nind: number) => {
    ai2k[nind] = nkey;
    ak2i[nkey] = nind;
    return [ai2k, ak2i];
  }, ([{}, {}] as [Record<number, string>, Record<string, number>]));
}

// https://stackoverflow.com/a/37164538/837221
export function mergeDeep(
    target: {[index: string]: any},
    source: {[index: string]: any}):
      {[index: string]: any} {
  const isObject = (item: any): item is {[index: string]: any} => {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, {[key]: source[key]});
      }
    });
  }

  return output;
}
