import macImg from '@/assets/images/Mac-Os-icon.png';
import linuxImg from '@/assets/images/Linux-Os-icon.png';
import windowsImg from '@/assets/images/Windows-Os-icon.png';

interface DownloadItem {
  label: string;
  os: string;
  value: string[];
  icon: string;
  img: string;
}
export const downloadConfig: Array<DownloadItem> = [
  {
    label: 'macOS',
    os: 'darwin',
    value: ['amd64', 'arm64'],
    icon: '',
    img: macImg
  },
  {
    label: 'Linux',
    os: 'linux',
    value: ['amd64', 'arm64'],
    icon: '',
    img: linuxImg
  },
  {
    label: 'Windows',
    os: 'windows',
    value: ['amd64', 'arm64'],
    icon: '',
    img: windowsImg
  }
];

export default {};
