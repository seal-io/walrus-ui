import _, { trim } from 'lodash';
import jsYaml from 'js-yaml';
import { schemaType } from './index';

const SealYamlType = new jsYaml.Type('!seal', {
  kind: 'sequence', // See node kinds in YAML spec: http://www.yaml.org/spec/1.2/spec.html#kind//
  construct(data) {
    return data.map(function (string) {
      return `seal${string}`;
    });
  }
});
const SEAL_SCHEMA = jsYaml.DEFAULT_SCHEMA.extend([SealYamlType]);

export const yamlLoad = (str) => {
  str = trim(str);
  const obj = jsYaml.load(str, { schema: SEAL_SCHEMA });
  return obj;
};
export const validateYaml = (str) => {
  let result: any = {};
  try {
    str = trim(str);
    const obj = jsYaml.load(str, { schema: SEAL_SCHEMA });
    if (!obj || !Object.keys(obj).length) {
      result = {
        empty: true,
        error: null
      };
    } else {
      result = {
        empty: false,
        error: null
      };
    }
  } catch (error) {
    result = {
      empty: false,
      error: {
        line: _.get(error, 'mark.line') || 0 + 1,
        reason: _.get(error, 'reason'),
        message: `${_.get(error, 'reason')} (line:${
          _.get(error, 'mark.line') || 0 + 1
        })`
      }
    };
  }
  return result;
};

export const yaml2Json = (str, type?) => {
  str = trim(str);
  const obj = jsYaml.load(str, { schema: SEAL_SCHEMA });
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

export default {};
