import _ from 'lodash';
import { FieldSchema, Group, FormGroup } from '../interface';

const DefaultGroup = 'Basic';

export const createFormGroup = (rootSchema: FieldSchema) => {
  const { properties, ...rest } = rootSchema;
  const keys = _.keys(properties || {});
  const formGroup: FormGroup[] = [];
  const group: Group = {};

  _.each(keys, (key) => {
    const property = _.get(properties, key, {} as FieldSchema);
    const uiGroup = _.get(property, ['x-walrus-ui', 'group'], '');
    const groudList = _.filter(_.split(uiGroup, /\/+/) || [], (s) => !!s);
    const groupKey = groudList[0] || DefaultGroup;
    if (group[groupKey]) {
      group[groupKey].push({
        [key]: {
          ...property,
          fieldPath: [key],
          name: key
        }
      });
    } else {
      group[groupKey] = [
        {
          [key]: {
            ...property,
            fieldPath: [key],
            name: key
          }
        }
      ];
    }
  });
  _.keys(group).forEach((key) => {
    formGroup.push({
      group: key,
      schema: {
        ...rest,

        properties: _.merge({}, ...group[key])
      }
    });
  });
  return formGroup;
};

export default {};
