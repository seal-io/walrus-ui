import _ from 'lodash';
import ComponentsMap from '../components/components-map';
import { FieldMaps } from '../components/basic-components';
import FIELD_TYPE from '../config/field-type';
import {
  isBasicType,
  isSimpleObject,
  isSelect,
  isMuliSelect,
  isYamlEditor,
  isAllowCreateSelect
} from '../utils';

export const getSchemaFieldComponent = ({ schema, fieldPath }) => {
  const { type, required: requiredFields } = schema;
  const widget = _.get(schema, ['x-walrus-ui', 'widget'], '');

  const commonAttrs = {
    key: Date.now()
  };
  // build-in component
  if (widget && widget !== 'TextArea') {
    return {
      component: ComponentsMap[widget],
      fieldPath: [...fieldPath],
      requiredFields,
      commonAttrs
    };
  }
  if (isYamlEditor(schema)) {
    return {
      component: ComponentsMap.YamlEditor,
      fieldPath: [...fieldPath],
      requiredFields,
      commonAttrs
    };
  }

  if (
    (isMuliSelect(schema) || isSelect(schema)) &&
    !isAllowCreateSelect(schema)
  ) {
    return {
      component: FieldMaps.select,
      fieldPath: [...fieldPath],
      requiredFields,
      commonAttrs
    };
  }

  if (isAllowCreateSelect(schema)) {
    return {
      component: ComponentsMap.ArrayBasicCreate,
      fieldPath: [...fieldPath],
      requiredFields,
      commonAttrs
    };
  }
  if (type === FIELD_TYPE.ARRAY) {
    return {
      component: FieldMaps.array,
      fieldPath: [...fieldPath],
      requiredFields,
      commonAttrs
    };
  }
  if (type === FIELD_TYPE.OBJECT && isSimpleObject(schema)) {
    return {
      component: FieldMaps.simpleObject,
      fieldPath: [...fieldPath],
      requiredFields,
      commonAttrs
    };
  }
  if (type === FIELD_TYPE.OBJECT) {
    return {
      component: FieldMaps.object,
      fieldPath: [...fieldPath],
      requiredFields,
      commonAttrs
    };
  }
  if (type === FIELD_TYPE.BOOLEAN) {
    return {
      component: FieldMaps.checkbox,
      fieldPath: [...fieldPath],
      requiredFields,
      commonAttrs
    };
  }
  if (isBasicType(schema)) {
    return {
      component: FieldMaps.stringField,
      fieldPath: [...fieldPath],
      requiredFields,
      commonAttrs
    };
  }
  return {
    component: FieldMaps.stringField,
    fieldPath: [...fieldPath],
    requiredFields,
    commonAttrs
  };
};

export default {};
