import axios, { CancelTokenSource } from 'axios';

export default function useAxiosToken() {
  const { CancelToken } = axios;
  const { source } = CancelToken;
  return source;
}
