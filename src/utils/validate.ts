import urlRegex from 'url-regex-safe';
import cron from 'cron-validate';
import { replace } from 'lodash';

export const emailReg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/;

export const urlReg = urlRegex();
export const urlHttp = /(http|https):\/\/([\w.]+\/?)\S*/;
export const scoksReg = /(socks4|socks5):\/\/([\w.]+\/?)\S*/;
export const hostReg = /^([^\s.]+\.)([^\s.]+\.)*[^\s.]+$/;
export const wildDomainReg = /^(\*\.)([^\s.]+\.)*([^\s.]+\.)[^\s.]+$/;
export const ipReg = /^(\d{1,3}\.)(\d{1,3}\.)(\d{1,3}\.)(\d{1,3})$/;
export const domainReg = /^([^\s.]+\.)([^\s.]+\.)*([^\s.]+\.)[^\s.]+$/;
export const validateUrl = (str: string): boolean => {
  const reg = urlReg;
  return reg.test(str);
};

const cronPreset = {
  override: {
    useSeconds: true,
    useYears: false,
    useAliases: true, // optional, default to false
    useBlankDay: true,
    allowOnlyOneBlankDayField: true,
    mustHaveBlankDayField: false, // optional, default to false
    useLastDayOfMonth: true, // optional, default to false
    useLastDayOfWeek: true, // optional, default to false
    useNearestWeekday: true, // optional, default to false
    useNthWeekdayOfMonth: true,
  },
};
export const validateCron = (str) => {
  const result = cron(replace(str, /\s+/g, ' '), cronPreset);
  return result.isValid();
};
export const validateEmail = (str: string): boolean => {
  const reg = emailReg;
  return reg.test(str);
};

export const getValueOnConfigs = (
  value: string | number,
  configs: Array<{ value: string | number; label: string }>
) => {
  const data = configs.find((item) => {
    return item.value === value;
  });
  return data ? data.label : '';
};

export default {
  validateUrl,
  emailReg,
  urlReg,
  urlHttp,
  hostReg,
  wildDomainReg,
  validateEmail,
  getValueOnConfigs,
  scoksReg,
  validateCron,
};
