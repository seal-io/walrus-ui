import axios from 'axios';
import qs from 'query-string';

export const downloadCli = (params: {
  os: string;
  arch: string;
  t: number;
}) => {
  return `/clis/walrus-cli-${params.os}-${params.arch}`;
};

export default {};
