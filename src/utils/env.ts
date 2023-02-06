export const mockOn = process.env.dev_mode === 'mock';

const debug = process.env.NODE_ENV !== 'production';

export default debug;
