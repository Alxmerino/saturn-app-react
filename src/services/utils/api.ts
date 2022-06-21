import { camelCase, isPlainObject } from 'lodash';
import { RootState } from '../../store/store';

export function transformResponse<T>(
  response: { data: T },
  meta: any,
  arg: any
) {
  return camelizeKeys(response.data);
}

export function prepareHeaders(
  headers: Headers,
  { getState }: { getState: RootState }
) {
  const token: string = getState().auth.token;
  headers.set('Accept', 'application/json');
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
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
