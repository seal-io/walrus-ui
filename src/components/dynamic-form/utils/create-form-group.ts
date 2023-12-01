import _ from 'lodash';
import { FieldSchema, Group, FormGroup } from '../interface';

const DefaultGroup = 'Basic';

export const createFormGroup = (rootSchema: FieldSchema) => {
  const { properties, ...rest } = rootSchema;
  const keys = _.keys(properties || {});
  const formGroup: FormGroup[] = [];
  const group: Group = {};
  const groupOrderList = _.get(rootSchema, ['x-walrus-ui', 'groupOrder'], []);

  const groupOrder = _.reduce(
    groupOrderList,
    (result, item, index) => {
      result[item] = index;
      return result;
    },
    {}
  );
  _.each(keys, (key) => {
    const property = _.get(properties, key, {} as FieldSchema);
    const groupKey = _.get(property, ['x-walrus-ui', 'group'], DefaultGroup);
    const hidden = _.get(property, ['x-walrus-ui', 'hidden'], false);
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
        hidden,
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
      groupOrder: groupOrder[key],
      hidden: group[key]['hidden'],
      schema: {
        ...rest,

        properties: _.merge({}, ...group[key]['schema'])
      }
    });
  });
  return _.sortBy(formGroup, ['groupOrder']);
};

export default {};
