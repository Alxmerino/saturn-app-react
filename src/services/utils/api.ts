import { camelCase, isPlainObject } from 'lodash';

export function transformResponse<T>(
  response: { data: T },
  meta: any,
  arg: any
) {
  return camelizeKeys(response.data);
}

// @todo: move this to a generic object handling utils
export function camelizeKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => camelizeKeys(v));
  } else if (isPlainObject(obj)) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: camelizeKeys(obj[key]),
      }),
      {}
    );
  }

  return obj;
}
