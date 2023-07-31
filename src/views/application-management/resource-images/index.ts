import _ from 'lodash';

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

const images: Record<string, any> = import.meta.glob('./*/*.png', {
  eager: true
});

const imageMap = new Map();
_.each(_.keys(images), (key) => {
  const defaultModule = images[key].default;
  const list = parseString(key);
  const provider = _.get(list, '0');
  const type = _.get(list, '1');
  if (imageMap.has(provider)) {
    imageMap.get(provider).set(type, defaultModule);
  } else {
    const typeMap = new Map();
    typeMap.set(type, defaultModule);
    imageMap.set(provider, typeMap);
  }
});

export default imageMap;
