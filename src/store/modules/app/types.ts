export interface AppState {
  theme: string;
  colorWeek: boolean;
  navbar: boolean;
  menu: boolean;
  hideMenu: boolean;
  menuCollapse: boolean;
  footer: boolean;
  themeColor: string;
  menuWidth: number;
  smallWidth: number;
  navbarHeight: number;
  globalSettings: boolean;
  device: string;
  fullScreen: boolean;
  tabBar: boolean;
  hasNavList: boolean;
  perPage: number;
  selectedKey: Array<string>;
  [key: string]: unknown;
}
