export function Loading({loading, message = 'your data is loading', children}) {
  return loading ? <div>{message}</div> : children;
}
