import _ from 'lodash';

const images = import.meta.globEager('../images/*.png');

const parseString = (inputString) => {
  const regex = /\/([^/]+)\/([^/.]+)/;
  const match = inputString.match(regex);

  if (match) {
    const aws = match[1];
    const aws_ami = match[2];
    return [aws, aws_ami];
  }
  return [];
};

export const repoIcon = new Map();

_.each(_.keys(images), (key) => {
  const defaultModule = images[key].default;
  const list = parseString(key);
  const name = _.get(list, '1');
  repoIcon.set(_.toLower(name), defaultModule);
});
export default {};
