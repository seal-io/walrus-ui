export const comTypeList = [
  { type: 'gh-epic-link', comType: 'text' },
  { type: 'url', comType: 'text' },
  { type: 'radiobuttons', comType: 'radio' },
  { type: 'multicheckboxes', comType: 'checkbox' },
  { type: 'float', comType: 'number' },
  { type: 'datetime', comType: 'datetime' },
  { type: 'datepicker', comType: 'datepicker' },
  { type: 'date', comType: 'datepicker' },
  { type: 'labels', comType: 'text' },
  { type: 'textarea', comType: 'textarea' },
  { type: 'textfield', comType: 'text' },
  { type: 'select', comType: 'select' },
  { type: 'multiselect', comType: 'multiselect' },
  { type: 'cascadingselect', comType: 'cascadingselect' },
  { type: 'duedate', comType: 'datepicker' },
  { type: 'user', comType: 'userSelect' },
];

// only for the special value format for fieldType is system
export const systemFieldsMap = {
  reporter: { accountId: '' },
  priority: { id: '' },
};

// only for system field
export const systemComTypeMap = {
  summary: 'textarea',
  priority: 'select',
};
