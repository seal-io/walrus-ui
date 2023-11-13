export default {
  field: {
    type: String,
    default() {
      return '';
    }
  },
  label: {
    type: String,
    default() {
      return '';
    }
  },
  placeholder: {
    type: String,
    default() {
      return '';
    }
  },
  required: {
    type: Boolean,
    default() {
      return false;
    }
  },
  disabled: {
    type: Boolean,
    default() {
      return false;
    }
  },
  readonly: {
    type: Boolean,
    default() {
      return false;
    }
  },
  hidden: {
    type: Boolean,
    default() {
      return false;
    }
  },
  hiddenOn: {
    type: String,
    default() {
      return '';
    }
  },
  rules: {
    type: Array,
    default() {
      return [];
    }
  }
};
