import _ from 'lodash';

const BASIC_TYPE = ['number', 'string', 'bool'];

const UNKNOWN_TYPE = ['dynamic'];

const COLLECTION_TYPE = ['map', 'object', 'list', 'tuple', 'dynamic'];

// field is required options
export const requiredOptions = [
  { label: 'common.filter.isrequired.true', value: 'true' },
  { label: 'common.filter.isrequired.false', value: 'false' }
];

export const hasValueOptions = [
  { label: 'common.filter.filled.true', value: 'true' },
  { label: 'common.filter.filled.false', value: 'false' }
];

export const schemaType = {
  isListPrimaryType(type) {
    return _.get(type, '0') === 'list';
  },
  isObjectPrimaryType(type) {
    return _.get(type, '0') === 'map' || _.get(type, '0') === 'object';
  },
  isTuplePrimaryType(type) {
    return _.get(type, '0') === 'tuple';
  },
  isBasicType(type) {
    return _.includes(BASIC_TYPE, type);
  },
  isUnknownType(type) {
    return _.includes(UNKNOWN_TYPE, type) || !type;
  },
  isCollectionType(type) {
    if (_.isArray(type) && type.length > 2) {
      return true;
    }
    return (
      _.get(type, '1') &&
      (_.includes(COLLECTION_TYPE, _.get(type, '1')) ||
        _.includes(COLLECTION_TYPE, typeof _.get(type, '1')))
    );
  },
  isStringType(type) {
    return type === 'string';
  },
  isNumberType(type) {
    return type === 'number';
  },
  isBoolenType(type) {
    return type === 'bool';
  },
  isMapString(type) {
    return _.get(type, '0') === 'map' && _.get(type, '1') === 'string';
  },
  isListString(type) {
    return _.get(type, '0') === 'list' && _.get(type, '1') === 'string';
  },
  isListNumber(type) {
    return _.get(type, '0') === 'list' && _.get(type, '1') === 'number';
  }
};
export default {};
