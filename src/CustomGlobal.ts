export { };

declare global {
  namespace Logger {
    function log(...args: any): void;
    function error(...args: any): void;
    function warn(...args: any): void;
  }
}
