/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '@vue-flow/background' {
  export { Background } from '@vue-flow/background';
}
declare module '@vue-flow/controls' {
  export { Controls } from '@vue-flow/controls';
}
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}
