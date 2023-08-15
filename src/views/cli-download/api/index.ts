import axios from 'axios';
import qs from 'query-string';

export const downloadCli = (params: {
  os: string;
  arch: string;
  t: number;
}) => {
  return `/cli?${qs.stringify(params)}`;
};

export default {};
