interface DownloadItem {
  label: string;
  os: string;
  value: string[];
  icon: string;
}
export const downloadConfig: Array<DownloadItem> = [
  { label: 'macOS', os: 'darwin', value: ['amd64', 'arm64'], icon: '' },
  { label: 'Linux', os: 'linux', value: ['amd64', 'arm64'], icon: '' }
];

export default {};
