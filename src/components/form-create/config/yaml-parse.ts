import jsYaml from 'js-yaml';
import { trim } from 'lodash';
import { schemaType } from './interface';

const SexyYamlType = new jsYaml.Type('!sexy', {
  kind: 'sequence', // See node kinds in YAML spec: http://www.yaml.org/spec/1.2/spec.html#kind//
  construct(data) {
    return data.map(function (string) {
      return `sexy${string}`;
    });
  }
});
const SEXY_SCHEMA = jsYaml.DEFAULT_SCHEMA.extend([SexyYamlType]);

export const yaml2Json = (str, type?) => {
  str = trim(str);
  const obj = jsYaml.load(str, { schema: SEXY_SCHEMA });
  console.log('yaml2json===', obj, type, str);
  if (!obj || !Object.keys(obj).length) {
    let res: any = [];
    if (schemaType.isListPrimaryType(type)) {
      res = [];
    } else if (schemaType.isObjectPrimaryType(type)) {
      res = {};
    } else if (schemaType.isTuplePrimaryType(type)) {
      res = [];
    }
    return res;
  }
  const jsonStr = JSON.stringify(obj);
  return JSON.parse(jsonStr);
};

export const json2Yaml = (obj) => {
  if (!obj || !Object.keys(obj).length) return '';
  const res = jsYaml.dump(JSON.parse(JSON.stringify(obj)));
  return res;
};

export const json2Str = (obj) => {
  if (!obj || !Object.keys(obj).length) return '';
  return JSON.stringify(obj, null, 2);
};

export const str2Json = (str, type) => {
  str = trim(str);
  console.log('yaml2json===', str, type, str);
  if (!str) {
    let res: any = [];
    if (schemaType.isListPrimaryType(type)) {
      res = [];
    } else if (schemaType.isObjectPrimaryType(type)) {
      res = {};
    } else if (schemaType.isTuplePrimaryType(type)) {
      res = [];
    }
    return res;
  }
  return JSON.parse(str);
};

export const unknowType = {
  dynamic: 'dynamic'
};

export default {};
