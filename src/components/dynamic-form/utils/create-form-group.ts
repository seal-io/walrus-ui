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
    const groupOrder = _.get(property, ['x-walrus-ui', 'groupOrder'], 100);
    const groudList = _.filter(_.split(uiGroup, /\/+/) || [], (s) => !!s);
    const groupKey = groudList[0] || DefaultGroup;
    if (group[groupKey]) {
      group[groupKey]['schema'].push({
        [key]: {
          ...property,
          fieldPath: [key],
          name: key
        }
      });
    } else {
      group[groupKey] = {
        groupOrder,
        schema: []
      };
      group[groupKey]['schema'] = [
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
      groupOrder: group[key]['groupOrder'],
      schema: {
        ...rest,

        properties: _.merge({}, ...group[key]['schema'])
      }
    });
  });
  return _.sortBy(formGroup, ['groupOrder']);
};

export default {};
