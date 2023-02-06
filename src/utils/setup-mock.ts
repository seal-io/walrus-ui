import debug, { mockOn } from './env';

export default ({
  mock = mockOn,
  setup,
}: {
  mock?: boolean;
  setup: () => void;
}) => {
  if (mock !== false && debug) setup();
};

export const successResponseWrap = (data: any) => {
  return {
    ...data,
    status: 'ok',
    msg: '请求成功',
    code: 200,
  };
};

export const failResponseWrap = (data: any, msg: string, code = 50000) => {
  return {
    ...data,
    status: 'fail',
    msg,
    code,
  };
};
