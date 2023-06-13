import dayjs from 'dayjs';

export const basicInfoConfig = [
  { label: 'applications.applications.form.name', value: '', key: 'name' },
  {
    label: 'common.table.createTime',
    value: '',
    key: 'createTime',
    formatter(val) {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  {
    label: 'applications.projects.table.name',
    value: '',
    key: 'project.name'
  },
  {
    label: 'common.table.description',
    value: '',
    key: 'description',
    span: 2
  }
];

export default {};
