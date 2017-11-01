export default (fn, timeInMs) => {
  let start = 0;
  const runFn = () => {
    start = 0;
    fn();
  }
  return () => {
    if (start > 0) clearTimeout(start);
    start = setTimeout(runFn, timeInMs);
  }
}
