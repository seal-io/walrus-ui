export default {
  expand: 'issuetypes',
  self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/project/10004',
  id: '10004',
  key: 'SBWJ',
  name: '自动',
  issuetypes: [
    {
      self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/issuetype/10008',
      id: '10008',
      description: '改进或增强现有功能或任务。',
      iconurl:
        'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/issuetype/avatar/10310?size=medium',
      name: '改进',
      expand: 'fields',
      fields: {
        assignee: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/user/assignable/search?project=SBWJ&amp;query=',
          hasDefaultValue: false,
          key: 'assignee',
          name: '经办人',
          operations: ['set'],
          required: false,
          schema: {
            system: 'assignee',
            type: 'user',
          },
        },
        attachment: {
          hasDefaultValue: false,
          key: 'attachment',
          name: '附件',
          operations: ['set'],
          required: false,
          schema: {
            items: 'attachment',
            system: 'attachment',
            type: 'array',
          },
        },
        components: {
          allowedValues: [],
          hasDefaultValue: false,
          key: 'components',
          name: '组件',
          operations: ['add', 'set', 'remove'],
          required: false,
          schema: {
            items: 'component',
            system: 'components',
            type: 'array',
          },
        },
        customfield_10014: {
          hasDefaultValue: false,
          key: 'customfield_10014',
          name: 'Epic Link',
          operations: ['set'],
          required: false,
          schema: {
            custom: 'com.pyxis.greenhopper.jira:gh-epic-link',
            customId: 10014,
            type: 'any',
          },
        },
        customfield_10037: {
          hasDefaultValue: false,
          key: 'customfield_10037',
          name: 'URL 字段',
          operations: ['set'],
          required: false,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:url',
            customId: 10037,
            type: 'string',
          },
        },
        customfield_10038: {
          allowedValues: [
            {
              id: '10023',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10023',
              value: '单选一',
            },
            {
              id: '10024',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10024',
              value: '单选二',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10038',
          name: '单选按钮',
          operations: ['set'],
          required: false,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:radiobuttons',
            customId: 10038,
            type: 'option',
          },
        },
        customfield_10039: {
          allowedValues: [
            {
              id: '10025',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10025',
              value: '复选 1',
            },
            {
              id: '10026',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10026',
              value: '复选 2',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10039',
          name: '复选框',
          operations: ['add', 'set', 'remove'],
          required: false,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:multicheckboxes',
            customId: 10039,
            items: 'option',
            type: 'array',
          },
        },
        customfield_10040: {
          hasDefaultValue: false,
          key: 'customfield_10040',
          name: '必填数字字段',
          operations: ['set'],
          required: true,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:float',
            customId: 10040,
            type: 'number',
          },
        },
        customfield_10041: {
          hasDefaultValue: false,
          key: 'customfield_10041',
          name: '必填日期时间',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:datetime',
            customId: 10041,
            type: 'datetime',
          },
        },
        customfield_10042: {
          hasDefaultValue: false,
          key: 'customfield_10042',
          name: '必填日期',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:datepicker',
            customId: 10042,
            type: 'date',
          },
        },
        customfield_10043: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/1.0/labels/suggest?customFieldId=10043&amp;query=',
          hasDefaultValue: false,
          key: 'customfield_10043',
          name: '必填标签',
          operations: ['add', 'set', 'remove'],
          required: true,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:labels',
            customId: 10043,
            items: 'string',
            type: 'array',
          },
        },
        customfield_10044: {
          hasDefaultValue: false,
          key: 'customfield_10044',
          name: '必填段落',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:textarea',
            customId: 10044,
            type: 'string',
          },
        },
        customfield_10045: {
          hasDefaultValue: false,
          key: 'customfield_10045',
          name: '必填短文本',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:textfield',
            customId: 10045,
            type: 'string',
          },
        },
        customfield_10046: {
          allowedValues: [
            {
              id: '10027',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10027',
              value: '1',
            },
            {
              id: '10028',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10028',
              value: '2',
            },
            {
              id: '10029',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10029',
              value: '3',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10046',
          name: '必填列表 单选',
          operations: ['set'],
          required: true,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:select',
            customId: 10046,
            type: 'option',
          },
        },
        customfield_10047: {
          allowedValues: [
            {
              id: '10030',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10030',
              value: '1',
            },
            {
              id: '10031',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10031',
              value: '2',
            },
            {
              id: '10032',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10032',
              value: '3',
            },
            {
              id: '10033',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10033',
              value: '4',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10047',
          name: '必填选择列表 多选',
          operations: ['add', 'set', 'remove'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:multiselect',
            customId: 10047,
            items: 'option',
            type: 'array',
          },
        },
        customfield_10048: {
          allowedValues: [],
          hasDefaultValue: false,
          key: 'customfield_10048',
          name: '必填选择列表  级联操作',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:cascadingselect',
            customId: 10048,
            type: 'option-with-child',
          },
        },
        customfield_10049: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/1.0/users/picker?fieldName=customfield_10049&amp;fieldConfigId=10149&amp;projectId=10004&amp;showAvatar=true&amp;query=',
          hasDefaultValue: false,
          key: 'customfield_10049',
          name: '必填用户',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:userpicker',
            customId: 10049,
            type: 'user',
          },
        },
        description: {
          hasDefaultValue: false,
          key: 'description',
          name: '描述',
          operations: ['set'],
          required: false,
          schema: {
            system: 'description',
            type: 'string',
          },
        },
        duedate: {
          hasDefaultValue: false,
          key: 'duedate',
          name: '截止日期',
          operations: ['set'],
          required: false,
          schema: {
            system: 'duedate',
            type: 'date',
          },
        },
        fixVersions: {
          allowedValues: [],
          hasDefaultValue: false,
          key: 'fixVersions',
          name: '修复版本',
          operations: ['set', 'add', 'remove'],
          required: false,
          schema: {
            items: 'version',
            system: 'fixVersions',
            type: 'array',
          },
        },
        issuelinks: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/issue/picker?currentProjectId=&amp;showSubTaskParent=true&amp;showSubTasks=true¤tIssueKey=null&amp;query=',
          hasDefaultValue: false,
          key: 'issuelinks',
          name: '链接的事务',
          operations: ['add'],
          required: false,
          schema: {
            items: 'issuelinks',
            system: 'issuelinks',
            type: 'array',
          },
        },
        issuetype: {
          allowedValues: [
            {
              avatarId: 10310,
              description: '改进或增强现有功能或任务。',
              hierarchyLevel: 0,
              iconUrl:
                'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/issuetype/avatar/10310?size=medium',
              id: '10008',
              name: '改进',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/issuetype/10008',
              subtask: false,
            },
          ],
          hasDefaultValue: false,
          key: 'issuetype',
          name: '事务类型',
          operations: [],
          required: true,
          schema: {
            system: 'issuetype',
            type: 'issuetype',
          },
        },
        labels: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/1.0/labels/suggest?query=',
          hasDefaultValue: false,
          key: 'labels',
          name: '标签',
          operations: ['add', 'set', 'remove'],
          required: false,
          schema: {
            items: 'string',
            system: 'labels',
            type: 'array',
          },
        },
        parent: {
          hasDefaultValue: false,
          key: 'parent',
          name: '父级',
          operations: ['set'],
          required: false,
          schema: {
            system: 'parent',
            type: 'issuelink',
          },
        },
        priority: {
          allowedValues: [
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/highest.svg',
              id: '1',
              name: 'Highest',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/1',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/high.svg',
              id: '2',
              name: 'High',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/2',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/medium.svg',
              id: '3',
              name: 'Medium',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/3',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/low.svg',
              id: '4',
              name: 'Low',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/4',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/lowest.svg',
              id: '5',
              name: 'Lowest',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/5',
            },
          ],
          defaultValue: {
            iconUrl:
              'https://alexwoai.atlassian.net/images/icons/priorities/medium.svg',
            id: '3',
            name: 'Medium',
            self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/3',
          },
          hasDefaultValue: true,
          key: 'priority',
          name: '优先级',
          operations: ['set'],
          required: false,
          schema: {
            system: 'priority',
            type: 'priority',
          },
        },
        project: {
          allowedValues: [
            {
              avatarUrls: {
                '16x16':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419?size=xsmall',
                '24x24':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419?size=small',
                '32x32':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419?size=medium',
                '48x48':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419',
              },
              id: '10004',
              key: 'SBWJ',
              name: '自动',
              projectTypeKey: 'software',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/project/10004',
              simplified: false,
            },
          ],
          hasDefaultValue: false,
          key: 'project',
          name: '项目',
          operations: ['set'],
          required: true,
          schema: {
            system: 'project',
            type: 'project',
          },
        },
        reporter: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/user/search?query=',
          hasDefaultValue: true,
          key: 'reporter',
          name: '报告人',
          operations: ['set'],
          required: true,
          schema: {
            system: 'reporter',
            type: 'user',
          },
        },
        summary: {
          hasDefaultValue: false,
          key: 'summary',
          name: '摘要',
          operations: ['set'],
          required: true,
          schema: {
            system: 'summary',
            type: 'string',
          },
        },
        timetracking: {
          hasDefaultValue: false,
          key: 'timetracking',
          name: '时间跟踪',
          operations: ['set', 'edit'],
          required: false,
          schema: {
            system: 'timetracking',
            type: 'timetracking',
          },
        },
      },
    },
    {
      self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/issuetype/10009',
      id: '10009',
      description: '特殊的小任务。',
      iconurl:
        'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=medium',
      name: '任务',
      expand: 'fields',
      fields: {
        assignee: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/user/assignable/search?project=SBWJ&amp;query=',
          hasDefaultValue: false,
          key: 'assignee',
          name: '经办人',
          operations: ['set'],
          required: false,
          schema: {
            system: 'assignee',
            type: 'user',
          },
        },
        attachment: {
          hasDefaultValue: false,
          key: 'attachment',
          name: '附件',
          operations: ['set'],
          required: false,
          schema: {
            items: 'attachment',
            system: 'attachment',
            type: 'array',
          },
        },
        components: {
          allowedValues: [],
          hasDefaultValue: false,
          key: 'components',
          name: '组件',
          operations: ['add', 'set', 'remove'],
          required: false,
          schema: {
            items: 'component',
            system: 'components',
            type: 'array',
          },
        },
        customfield_10014: {
          hasDefaultValue: false,
          key: 'customfield_10014',
          name: 'Epic Link',
          operations: ['set'],
          required: false,
          schema: {
            custom: 'com.pyxis.greenhopper.jira:gh-epic-link',
            customId: 10014,
            type: 'any',
          },
        },
        customfield_10037: {
          hasDefaultValue: false,
          key: 'customfield_10037',
          name: 'URL 字段',
          operations: ['set'],
          required: false,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:url',
            customId: 10037,
            type: 'string',
          },
        },
        customfield_10038: {
          allowedValues: [
            {
              id: '10023',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10023',
              value: '单选一',
            },
            {
              id: '10024',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10024',
              value: '单选二',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10038',
          name: '单选按钮',
          operations: ['set'],
          required: false,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:radiobuttons',
            customId: 10038,
            type: 'option',
          },
        },
        customfield_10039: {
          allowedValues: [
            {
              id: '10025',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10025',
              value: '复选 1',
            },
            {
              id: '10026',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10026',
              value: '复选 2',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10039',
          name: '复选框',
          operations: ['add', 'set', 'remove'],
          required: false,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:multicheckboxes',
            customId: 10039,
            items: 'option',
            type: 'array',
          },
        },
        customfield_10040: {
          hasDefaultValue: false,
          key: 'customfield_10040',
          name: '必填数字字段',
          operations: ['set'],
          required: true,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:float',
            customId: 10040,
            type: 'number',
          },
        },
        customfield_10041: {
          hasDefaultValue: false,
          key: 'customfield_10041',
          name: '必填日期时间',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:datetime',
            customId: 10041,
            type: 'datetime',
          },
        },
        customfield_10042: {
          hasDefaultValue: false,
          key: 'customfield_10042',
          name: '必填日期',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:datepicker',
            customId: 10042,
            type: 'date',
          },
        },
        customfield_10043: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/1.0/labels/suggest?customFieldId=10043&amp;query=',
          hasDefaultValue: false,
          key: 'customfield_10043',
          name: '必填标签',
          operations: ['add', 'set', 'remove'],
          required: true,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:labels',
            customId: 10043,
            items: 'string',
            type: 'array',
          },
        },
        customfield_10044: {
          hasDefaultValue: false,
          key: 'customfield_10044',
          name: '必填段落',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:textarea',
            customId: 10044,
            type: 'string',
          },
        },
        customfield_10045: {
          hasDefaultValue: false,
          key: 'customfield_10045',
          name: '必填短文本',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:textfield',
            customId: 10045,
            type: 'string',
          },
        },
        customfield_10046: {
          allowedValues: [
            {
              id: '10027',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10027',
              value: '1',
            },
            {
              id: '10028',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10028',
              value: '2',
            },
            {
              id: '10029',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10029',
              value: '3',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10046',
          name: '必填列表 单选',
          operations: ['set'],
          required: true,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:select',
            customId: 10046,
            type: 'option',
          },
        },
        customfield_10047: {
          allowedValues: [
            {
              id: '10030',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10030',
              value: '1',
            },
            {
              id: '10031',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10031',
              value: '2',
            },
            {
              id: '10032',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10032',
              value: '3',
            },
            {
              id: '10033',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10033',
              value: '4',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10047',
          name: '必填选择列表 多选',
          operations: ['add', 'set', 'remove'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:multiselect',
            customId: 10047,
            items: 'option',
            type: 'array',
          },
        },
        customfield_10048: {
          allowedValues: [],
          hasDefaultValue: false,
          key: 'customfield_10048',
          name: '必填选择列表  级联操作',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:cascadingselect',
            customId: 10048,
            type: 'option-with-child',
          },
        },
        customfield_10049: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/1.0/users/picker?fieldName=customfield_10049&amp;fieldConfigId=10149&amp;projectId=10004&amp;showAvatar=true&amp;query=',
          hasDefaultValue: false,
          key: 'customfield_10049',
          name: '必填用户',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:userpicker',
            customId: 10049,
            type: 'user',
          },
        },
        description: {
          hasDefaultValue: false,
          key: 'description',
          name: '描述',
          operations: ['set'],
          required: false,
          schema: {
            system: 'description',
            type: 'string',
          },
        },
        duedate: {
          hasDefaultValue: false,
          key: 'duedate',
          name: '截止日期',
          operations: ['set'],
          required: false,
          schema: {
            system: 'duedate',
            type: 'date',
          },
        },
        fixVersions: {
          allowedValues: [],
          hasDefaultValue: false,
          key: 'fixVersions',
          name: '修复版本',
          operations: ['set', 'add', 'remove'],
          required: false,
          schema: {
            items: 'version',
            system: 'fixVersions',
            type: 'array',
          },
        },
        issuelinks: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/issue/picker?currentProjectId=&amp;showSubTaskParent=true&amp;showSubTasks=true¤tIssueKey=null&amp;query=',
          hasDefaultValue: false,
          key: 'issuelinks',
          name: '链接的事务',
          operations: ['add'],
          required: false,
          schema: {
            items: 'issuelinks',
            system: 'issuelinks',
            type: 'array',
          },
        },
        issuetype: {
          allowedValues: [
            {
              avatarId: 10318,
              description: '特殊的小任务。',
              hierarchyLevel: 0,
              iconUrl:
                'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=medium',
              id: '10009',
              name: '任务',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/issuetype/10009',
              subtask: false,
            },
          ],
          hasDefaultValue: false,
          key: 'issuetype',
          name: '事务类型',
          operations: [],
          required: true,
          schema: {
            system: 'issuetype',
            type: 'issuetype',
          },
        },
        labels: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/1.0/labels/suggest?query=',
          hasDefaultValue: false,
          key: 'labels',
          name: '标签',
          operations: ['add', 'set', 'remove'],
          required: false,
          schema: {
            items: 'string',
            system: 'labels',
            type: 'array',
          },
        },
        parent: {
          hasDefaultValue: false,
          key: 'parent',
          name: '父级',
          operations: ['set'],
          required: false,
          schema: {
            system: 'parent',
            type: 'issuelink',
          },
        },
        priority: {
          allowedValues: [
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/highest.svg',
              id: '1',
              name: 'Highest',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/1',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/high.svg',
              id: '2',
              name: 'High',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/2',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/medium.svg',
              id: '3',
              name: 'Medium',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/3',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/low.svg',
              id: '4',
              name: 'Low',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/4',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/lowest.svg',
              id: '5',
              name: 'Lowest',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/5',
            },
          ],
          defaultValue: {
            iconUrl:
              'https://alexwoai.atlassian.net/images/icons/priorities/medium.svg',
            id: '3',
            name: 'Medium',
            self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/3',
          },
          hasDefaultValue: true,
          key: 'priority',
          name: '优先级',
          operations: ['set'],
          required: false,
          schema: {
            system: 'priority',
            type: 'priority',
          },
        },
        project: {
          allowedValues: [
            {
              avatarUrls: {
                '16x16':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419?size=xsmall',
                '24x24':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419?size=small',
                '32x32':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419?size=medium',
                '48x48':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419',
              },
              id: '10004',
              key: 'SBWJ',
              name: '自动',
              projectTypeKey: 'software',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/project/10004',
              simplified: false,
            },
          ],
          hasDefaultValue: false,
          key: 'project',
          name: '项目',
          operations: ['set'],
          required: true,
          schema: {
            system: 'project',
            type: 'project',
          },
        },
        reporter: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/user/search?query=',
          hasDefaultValue: true,
          key: 'reporter',
          name: '报告人',
          operations: ['set'],
          required: true,
          schema: {
            system: 'reporter',
            type: 'user',
          },
        },
        summary: {
          hasDefaultValue: false,
          key: 'summary',
          name: '摘要',
          operations: ['set'],
          required: true,
          schema: {
            system: 'summary',
            type: 'string',
          },
        },
        timetracking: {
          hasDefaultValue: false,
          key: 'timetracking',
          name: '时间跟踪',
          operations: ['set', 'edit'],
          required: false,
          schema: {
            system: 'timetracking',
            type: 'timetracking',
          },
        },
      },
    },
    {
      self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/issuetype/10010',
      id: '10010',
      description: '大任务中的小任务。',
      iconurl:
        'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/issuetype/avatar/10316?size=medium',
      name: '子任务',
      subtask: true,
      expand: 'fields',
      fields: {
        assignee: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/user/assignable/search?project=SBWJ&amp;query=',
          hasDefaultValue: false,
          key: 'assignee',
          name: '经办人',
          operations: ['set'],
          required: false,
          schema: {
            system: 'assignee',
            type: 'user',
          },
        },
        attachment: {
          hasDefaultValue: false,
          key: 'attachment',
          name: '附件',
          operations: ['set'],
          required: false,
          schema: {
            items: 'attachment',
            system: 'attachment',
            type: 'array',
          },
        },
        components: {
          allowedValues: [],
          hasDefaultValue: false,
          key: 'components',
          name: '组件',
          operations: ['add', 'set', 'remove'],
          required: false,
          schema: {
            items: 'component',
            system: 'components',
            type: 'array',
          },
        },
        customfield_10014: {
          hasDefaultValue: false,
          key: 'customfield_10014',
          name: 'Epic Link',
          operations: ['set'],
          required: false,
          schema: {
            custom: 'com.pyxis.greenhopper.jira:gh-epic-link',
            customId: 10014,
            type: 'any',
          },
        },
        customfield_10037: {
          hasDefaultValue: false,
          key: 'customfield_10037',
          name: 'URL 字段',
          operations: ['set'],
          required: false,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:url',
            customId: 10037,
            type: 'string',
          },
        },
        customfield_10038: {
          allowedValues: [
            {
              id: '10023',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10023',
              value: '单选一',
            },
            {
              id: '10024',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10024',
              value: '单选二',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10038',
          name: '单选按钮',
          operations: ['set'],
          required: false,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:radiobuttons',
            customId: 10038,
            type: 'option',
          },
        },
        customfield_10039: {
          allowedValues: [
            {
              id: '10025',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10025',
              value: '复选 1',
            },
            {
              id: '10026',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10026',
              value: '复选 2',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10039',
          name: '复选框',
          operations: ['add', 'set', 'remove'],
          required: false,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:multicheckboxes',
            customId: 10039,
            items: 'option',
            type: 'array',
          },
        },
        customfield_10040: {
          hasDefaultValue: false,
          key: 'customfield_10040',
          name: '必填数字字段',
          operations: ['set'],
          required: true,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:float',
            customId: 10040,
            type: 'number',
          },
        },
        customfield_10041: {
          hasDefaultValue: false,
          key: 'customfield_10041',
          name: '必填日期时间',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:datetime',
            customId: 10041,
            type: 'datetime',
          },
        },
        customfield_10042: {
          hasDefaultValue: false,
          key: 'customfield_10042',
          name: '必填日期',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:datepicker',
            customId: 10042,
            type: 'date',
          },
        },
        customfield_10043: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/1.0/labels/suggest?customFieldId=10043&amp;query=',
          hasDefaultValue: false,
          key: 'customfield_10043',
          name: '必填标签',
          operations: ['add', 'set', 'remove'],
          required: true,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:labels',
            customId: 10043,
            items: 'string',
            type: 'array',
          },
        },
        customfield_10044: {
          hasDefaultValue: false,
          key: 'customfield_10044',
          name: '必填段落',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:textarea',
            customId: 10044,
            type: 'string',
          },
        },
        customfield_10045: {
          hasDefaultValue: false,
          key: 'customfield_10045',
          name: '必填短文本',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:textfield',
            customId: 10045,
            type: 'string',
          },
        },
        customfield_10046: {
          allowedValues: [
            {
              id: '10027',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10027',
              value: '1',
            },
            {
              id: '10028',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10028',
              value: '2',
            },
            {
              id: '10029',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10029',
              value: '3',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10046',
          name: '必填列表 单选',
          operations: ['set'],
          required: true,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:select',
            customId: 10046,
            type: 'option',
          },
        },
        customfield_10047: {
          allowedValues: [
            {
              id: '10030',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10030',
              value: '1',
            },
            {
              id: '10031',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10031',
              value: '2',
            },
            {
              id: '10032',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10032',
              value: '3',
            },
            {
              id: '10033',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10033',
              value: '4',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10047',
          name: '必填选择列表 多选',
          operations: ['add', 'set', 'remove'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:multiselect',
            customId: 10047,
            items: 'option',
            type: 'array',
          },
        },
        customfield_10048: {
          allowedValues: [],
          hasDefaultValue: false,
          key: 'customfield_10048',
          name: '必填选择列表  级联操作',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:cascadingselect',
            customId: 10048,
            type: 'option-with-child',
          },
        },
        customfield_10049: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/1.0/users/picker?fieldName=customfield_10049&amp;fieldConfigId=10149&amp;projectId=10004&amp;showAvatar=true&amp;query=',
          hasDefaultValue: false,
          key: 'customfield_10049',
          name: '必填用户',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:userpicker',
            customId: 10049,
            type: 'user',
          },
        },
        description: {
          hasDefaultValue: false,
          key: 'description',
          name: '描述',
          operations: ['set'],
          required: false,
          schema: {
            system: 'description',
            type: 'string',
          },
        },
        duedate: {
          hasDefaultValue: false,
          key: 'duedate',
          name: '截止日期',
          operations: ['set'],
          required: false,
          schema: {
            system: 'duedate',
            type: 'date',
          },
        },
        fixVersions: {
          allowedValues: [],
          hasDefaultValue: false,
          key: 'fixVersions',
          name: '修复版本',
          operations: ['set', 'add', 'remove'],
          required: false,
          schema: {
            items: 'version',
            system: 'fixVersions',
            type: 'array',
          },
        },
        issuelinks: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/issue/picker?currentProjectId=&amp;showSubTaskParent=true&amp;showSubTasks=true¤tIssueKey=null&amp;query=',
          hasDefaultValue: false,
          key: 'issuelinks',
          name: '链接的事务',
          operations: ['add'],
          required: false,
          schema: {
            items: 'issuelinks',
            system: 'issuelinks',
            type: 'array',
          },
        },
        issuetype: {
          allowedValues: [
            {
              avatarId: 10316,
              description: '大任务中的小任务。',
              hierarchyLevel: -1,
              iconUrl:
                'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/issuetype/avatar/10316?size=medium',
              id: '10010',
              name: '子任务',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/issuetype/10010',
              subtask: true,
            },
          ],
          hasDefaultValue: false,
          key: 'issuetype',
          name: '事务类型',
          operations: [],
          required: true,
          schema: {
            system: 'issuetype',
            type: 'issuetype',
          },
        },
        labels: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/1.0/labels/suggest?query=',
          hasDefaultValue: false,
          key: 'labels',
          name: '标签',
          operations: ['add', 'set', 'remove'],
          required: false,
          schema: {
            items: 'string',
            system: 'labels',
            type: 'array',
          },
        },
        parent: {
          hasDefaultValue: false,
          key: 'parent',
          name: '父级',
          operations: ['set'],
          required: true,
          schema: {
            system: 'parent',
            type: 'issuelink',
          },
        },
        priority: {
          allowedValues: [
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/highest.svg',
              id: '1',
              name: 'Highest',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/1',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/high.svg',
              id: '2',
              name: 'High',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/2',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/medium.svg',
              id: '3',
              name: 'Medium',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/3',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/low.svg',
              id: '4',
              name: 'Low',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/4',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/lowest.svg',
              id: '5',
              name: 'Lowest',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/5',
            },
          ],
          defaultValue: {
            iconUrl:
              'https://alexwoai.atlassian.net/images/icons/priorities/medium.svg',
            id: '3',
            name: 'Medium',
            self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/3',
          },
          hasDefaultValue: true,
          key: 'priority',
          name: '优先级',
          operations: ['set'],
          required: false,
          schema: {
            system: 'priority',
            type: 'priority',
          },
        },
        project: {
          allowedValues: [
            {
              avatarUrls: {
                '16x16':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419?size=xsmall',
                '24x24':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419?size=small',
                '32x32':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419?size=medium',
                '48x48':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419',
              },
              id: '10004',
              key: 'SBWJ',
              name: '自动',
              projectTypeKey: 'software',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/project/10004',
              simplified: false,
            },
          ],
          hasDefaultValue: false,
          key: 'project',
          name: '项目',
          operations: ['set'],
          required: true,
          schema: {
            system: 'project',
            type: 'project',
          },
        },
        reporter: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/user/search?query=',
          hasDefaultValue: true,
          key: 'reporter',
          name: '报告人',
          operations: ['set'],
          required: true,
          schema: {
            system: 'reporter',
            type: 'user',
          },
        },
        summary: {
          hasDefaultValue: false,
          key: 'summary',
          name: '摘要',
          operations: ['set'],
          required: true,
          schema: {
            system: 'summary',
            type: 'string',
          },
        },
        timetracking: {
          hasDefaultValue: false,
          key: 'timetracking',
          name: '时间跟踪',
          operations: ['set', 'edit'],
          required: false,
          schema: {
            system: 'timetracking',
            type: 'timetracking',
          },
        },
      },
    },
    {
      self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/issuetype/10011',
      id: '10011',
      description: '还有待开发一项产品的新功能。',
      iconurl:
        'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/issuetype/avatar/10311?size=medium',
      name: '新增功能',
      expand: 'fields',
      fields: {
        assignee: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/user/assignable/search?project=SBWJ&amp;query=',
          hasDefaultValue: false,
          key: 'assignee',
          name: '经办人',
          operations: ['set'],
          required: false,
          schema: {
            system: 'assignee',
            type: 'user',
          },
        },
        attachment: {
          hasDefaultValue: false,
          key: 'attachment',
          name: '附件',
          operations: ['set'],
          required: false,
          schema: {
            items: 'attachment',
            system: 'attachment',
            type: 'array',
          },
        },
        components: {
          allowedValues: [],
          hasDefaultValue: false,
          key: 'components',
          name: '组件',
          operations: ['add', 'set', 'remove'],
          required: false,
          schema: {
            items: 'component',
            system: 'components',
            type: 'array',
          },
        },
        customfield_10014: {
          hasDefaultValue: false,
          key: 'customfield_10014',
          name: 'Epic Link',
          operations: ['set'],
          required: false,
          schema: {
            custom: 'com.pyxis.greenhopper.jira:gh-epic-link',
            customId: 10014,
            type: 'any',
          },
        },
        customfield_10037: {
          hasDefaultValue: false,
          key: 'customfield_10037',
          name: 'URL 字段',
          operations: ['set'],
          required: false,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:url',
            customId: 10037,
            type: 'string',
          },
        },
        customfield_10038: {
          allowedValues: [
            {
              id: '10023',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10023',
              value: '单选一',
            },
            {
              id: '10024',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10024',
              value: '单选二',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10038',
          name: '单选按钮',
          operations: ['set'],
          required: false,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:radiobuttons',
            customId: 10038,
            type: 'option',
          },
        },
        customfield_10039: {
          allowedValues: [
            {
              id: '10025',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10025',
              value: '复选 1',
            },
            {
              id: '10026',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10026',
              value: '复选 2',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10039',
          name: '复选框',
          operations: ['add', 'set', 'remove'],
          required: false,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:multicheckboxes',
            customId: 10039,
            items: 'option',
            type: 'array',
          },
        },
        customfield_10040: {
          hasDefaultValue: false,
          key: 'customfield_10040',
          name: '必填数字字段',
          operations: ['set'],
          required: true,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:float',
            customId: 10040,
            type: 'number',
          },
        },
        customfield_10041: {
          hasDefaultValue: false,
          key: 'customfield_10041',
          name: '必填日期时间',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:datetime',
            customId: 10041,
            type: 'datetime',
          },
        },
        customfield_10042: {
          hasDefaultValue: false,
          key: 'customfield_10042',
          name: '必填日期',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:datepicker',
            customId: 10042,
            type: 'date',
          },
        },
        customfield_10043: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/1.0/labels/suggest?customFieldId=10043&amp;query=',
          hasDefaultValue: false,
          key: 'customfield_10043',
          name: '必填标签',
          operations: ['add', 'set', 'remove'],
          required: true,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:labels',
            customId: 10043,
            items: 'string',
            type: 'array',
          },
        },
        customfield_10044: {
          hasDefaultValue: false,
          key: 'customfield_10044',
          name: '必填段落',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:textarea',
            customId: 10044,
            type: 'string',
          },
        },
        customfield_10045: {
          hasDefaultValue: false,
          key: 'customfield_10045',
          name: '必填短文本',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:textfield',
            customId: 10045,
            type: 'string',
          },
        },
        customfield_10046: {
          allowedValues: [
            {
              id: '10027',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10027',
              value: '1',
            },
            {
              id: '10028',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10028',
              value: '2',
            },
            {
              id: '10029',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10029',
              value: '3',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10046',
          name: '必填列表 单选',
          operations: ['set'],
          required: true,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:select',
            customId: 10046,
            type: 'option',
          },
        },
        customfield_10047: {
          allowedValues: [
            {
              id: '10030',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10030',
              value: '1',
            },
            {
              id: '10031',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10031',
              value: '2',
            },
            {
              id: '10032',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10032',
              value: '3',
            },
            {
              id: '10033',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10033',
              value: '4',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10047',
          name: '必填选择列表 多选',
          operations: ['add', 'set', 'remove'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:multiselect',
            customId: 10047,
            items: 'option',
            type: 'array',
          },
        },
        customfield_10048: {
          allowedValues: [],
          hasDefaultValue: false,
          key: 'customfield_10048',
          name: '必填选择列表  级联操作',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:cascadingselect',
            customId: 10048,
            type: 'option-with-child',
          },
        },
        customfield_10049: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/1.0/users/picker?fieldName=customfield_10049&amp;fieldConfigId=10149&amp;projectId=10004&amp;showAvatar=true&amp;query=',
          hasDefaultValue: false,
          key: 'customfield_10049',
          name: '必填用户',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:userpicker',
            customId: 10049,
            type: 'user',
          },
        },
        description: {
          hasDefaultValue: false,
          key: 'description',
          name: '描述',
          operations: ['set'],
          required: false,
          schema: {
            system: 'description',
            type: 'string',
          },
        },
        duedate: {
          hasDefaultValue: false,
          key: 'duedate',
          name: '截止日期',
          operations: ['set'],
          required: false,
          schema: {
            system: 'duedate',
            type: 'date',
          },
        },
        fixVersions: {
          allowedValues: [],
          hasDefaultValue: false,
          key: 'fixVersions',
          name: '修复版本',
          operations: ['set', 'add', 'remove'],
          required: false,
          schema: {
            items: 'version',
            system: 'fixVersions',
            type: 'array',
          },
        },
        issuelinks: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/issue/picker?currentProjectId=&amp;showSubTaskParent=true&amp;showSubTasks=true¤tIssueKey=null&amp;query=',
          hasDefaultValue: false,
          key: 'issuelinks',
          name: '链接的事务',
          operations: ['add'],
          required: false,
          schema: {
            items: 'issuelinks',
            system: 'issuelinks',
            type: 'array',
          },
        },
        issuetype: {
          allowedValues: [
            {
              avatarId: 10311,
              description: '还有待开发一项产品的新功能。',
              hierarchyLevel: 0,
              iconUrl:
                'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/issuetype/avatar/10311?size=medium',
              id: '10011',
              name: '新增功能',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/issuetype/10011',
              subtask: false,
            },
          ],
          hasDefaultValue: false,
          key: 'issuetype',
          name: '事务类型',
          operations: [],
          required: true,
          schema: {
            system: 'issuetype',
            type: 'issuetype',
          },
        },
        labels: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/1.0/labels/suggest?query=',
          hasDefaultValue: false,
          key: 'labels',
          name: '标签',
          operations: ['add', 'set', 'remove'],
          required: false,
          schema: {
            items: 'string',
            system: 'labels',
            type: 'array',
          },
        },
        parent: {
          hasDefaultValue: false,
          key: 'parent',
          name: '父级',
          operations: ['set'],
          required: false,
          schema: {
            system: 'parent',
            type: 'issuelink',
          },
        },
        priority: {
          allowedValues: [
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/highest.svg',
              id: '1',
              name: 'Highest',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/1',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/high.svg',
              id: '2',
              name: 'High',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/2',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/medium.svg',
              id: '3',
              name: 'Medium',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/3',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/low.svg',
              id: '4',
              name: 'Low',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/4',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/lowest.svg',
              id: '5',
              name: 'Lowest',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/5',
            },
          ],
          defaultValue: {
            iconUrl:
              'https://alexwoai.atlassian.net/images/icons/priorities/medium.svg',
            id: '3',
            name: 'Medium',
            self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/3',
          },
          hasDefaultValue: true,
          key: 'priority',
          name: '优先级',
          operations: ['set'],
          required: false,
          schema: {
            system: 'priority',
            type: 'priority',
          },
        },
        project: {
          allowedValues: [
            {
              avatarUrls: {
                '16x16':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419?size=xsmall',
                '24x24':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419?size=small',
                '32x32':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419?size=medium',
                '48x48':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419',
              },
              id: '10004',
              key: 'SBWJ',
              name: '自动',
              projectTypeKey: 'software',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/project/10004',
              simplified: false,
            },
          ],
          hasDefaultValue: false,
          key: 'project',
          name: '项目',
          operations: ['set'],
          required: true,
          schema: {
            system: 'project',
            type: 'project',
          },
        },
        reporter: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/user/search?query=',
          hasDefaultValue: true,
          key: 'reporter',
          name: '报告人',
          operations: ['set'],
          required: true,
          schema: {
            system: 'reporter',
            type: 'user',
          },
        },
        summary: {
          hasDefaultValue: false,
          key: 'summary',
          name: '摘要',
          operations: ['set'],
          required: true,
          schema: {
            system: 'summary',
            type: 'string',
          },
        },
        timetracking: {
          hasDefaultValue: false,
          key: 'timetracking',
          name: '时间跟踪',
          operations: ['set', 'edit'],
          required: false,
          schema: {
            system: 'timetracking',
            type: 'timetracking',
          },
        },
      },
    },
    {
      self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/issuetype/10012',
      id: '10012',
      description: '问题或错误。',
      iconurl:
        'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/issuetype/avatar/10303?size=medium',
      name: '缺陷',
      expand: 'fields',
      fields: {
        assignee: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/user/assignable/search?project=SBWJ&amp;query=',
          hasDefaultValue: false,
          key: 'assignee',
          name: '经办人',
          operations: ['set'],
          required: false,
          schema: {
            system: 'assignee',
            type: 'user',
          },
        },
        attachment: {
          hasDefaultValue: false,
          key: 'attachment',
          name: '附件',
          operations: ['set'],
          required: false,
          schema: {
            items: 'attachment',
            system: 'attachment',
            type: 'array',
          },
        },
        components: {
          allowedValues: [],
          hasDefaultValue: false,
          key: 'components',
          name: '组件',
          operations: ['add', 'set', 'remove'],
          required: false,
          schema: {
            items: 'component',
            system: 'components',
            type: 'array',
          },
        },
        customfield_10014: {
          hasDefaultValue: false,
          key: 'customfield_10014',
          name: 'Epic Link',
          operations: ['set'],
          required: false,
          schema: {
            custom: 'com.pyxis.greenhopper.jira:gh-epic-link',
            customId: 10014,
            type: 'any',
          },
        },
        customfield_10037: {
          hasDefaultValue: false,
          key: 'customfield_10037',
          name: 'URL 字段',
          operations: ['set'],
          required: false,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:url',
            customId: 10037,
            type: 'string',
          },
        },
        customfield_10038: {
          allowedValues: [
            {
              id: '10023',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10023',
              value: '单选一',
            },
            {
              id: '10024',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10024',
              value: '单选二',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10038',
          name: '单选按钮',
          operations: ['set'],
          required: false,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:radiobuttons',
            customId: 10038,
            type: 'option',
          },
        },
        customfield_10039: {
          allowedValues: [
            {
              id: '10025',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10025',
              value: '复选 1',
            },
            {
              id: '10026',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10026',
              value: '复选 2',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10039',
          name: '复选框',
          operations: ['add', 'set', 'remove'],
          required: false,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:multicheckboxes',
            customId: 10039,
            items: 'option',
            type: 'array',
          },
        },
        customfield_10040: {
          hasDefaultValue: false,
          key: 'customfield_10040',
          name: '必填数字字段',
          operations: ['set'],
          required: true,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:float',
            customId: 10040,
            type: 'number',
          },
        },
        customfield_10041: {
          hasDefaultValue: false,
          key: 'customfield_10041',
          name: '必填日期时间',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:datetime',
            customId: 10041,
            type: 'datetime',
          },
        },
        customfield_10042: {
          hasDefaultValue: false,
          key: 'customfield_10042',
          name: '必填日期',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:datepicker',
            customId: 10042,
            type: 'date',
          },
        },
        customfield_10043: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/1.0/labels/suggest?customFieldId=10043&amp;query=',
          hasDefaultValue: false,
          key: 'customfield_10043',
          name: '必填标签',
          operations: ['add', 'set', 'remove'],
          required: true,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:labels',
            customId: 10043,
            items: 'string',
            type: 'array',
          },
        },
        customfield_10044: {
          hasDefaultValue: false,
          key: 'customfield_10044',
          name: '必填段落',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:textarea',
            customId: 10044,
            type: 'string',
          },
        },
        customfield_10045: {
          hasDefaultValue: false,
          key: 'customfield_10045',
          name: '必填短文本',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:textfield',
            customId: 10045,
            type: 'string',
          },
        },
        customfield_10046: {
          allowedValues: [
            {
              id: '10027',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10027',
              value: '1',
            },
            {
              id: '10028',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10028',
              value: '2',
            },
            {
              id: '10029',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10029',
              value: '3',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10046',
          name: '必填列表 单选',
          operations: ['set'],
          required: true,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:select',
            customId: 10046,
            type: 'option',
          },
        },
        customfield_10047: {
          allowedValues: [
            {
              id: '10030',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10030',
              value: '1',
            },
            {
              id: '10031',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10031',
              value: '2',
            },
            {
              id: '10032',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10032',
              value: '3',
            },
            {
              id: '10033',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10033',
              value: '4',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10047',
          name: '必填选择列表 多选',
          operations: ['add', 'set', 'remove'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:multiselect',
            customId: 10047,
            items: 'option',
            type: 'array',
          },
        },
        customfield_10048: {
          allowedValues: [],
          hasDefaultValue: false,
          key: 'customfield_10048',
          name: '必填选择列表  级联操作',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:cascadingselect',
            customId: 10048,
            type: 'option-with-child',
          },
        },
        customfield_10049: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/1.0/users/picker?fieldName=customfield_10049&amp;fieldConfigId=10149&amp;projectId=10004&amp;showAvatar=true&amp;query=',
          hasDefaultValue: false,
          key: 'customfield_10049',
          name: '必填用户',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:userpicker',
            customId: 10049,
            type: 'user',
          },
        },
        description: {
          hasDefaultValue: false,
          key: 'description',
          name: '描述',
          operations: ['set'],
          required: false,
          schema: {
            system: 'description',
            type: 'string',
          },
        },
        duedate: {
          hasDefaultValue: false,
          key: 'duedate',
          name: '截止日期',
          operations: ['set'],
          required: false,
          schema: {
            system: 'duedate',
            type: 'date',
          },
        },
        environment: {
          hasDefaultValue: false,
          key: 'environment',
          name: '环境',
          operations: ['set'],
          required: false,
          schema: {
            system: 'environment',
            type: 'string',
          },
        },
        fixVersions: {
          allowedValues: [],
          hasDefaultValue: false,
          key: 'fixVersions',
          name: '修复版本',
          operations: ['set', 'add', 'remove'],
          required: false,
          schema: {
            items: 'version',
            system: 'fixVersions',
            type: 'array',
          },
        },
        issuelinks: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/issue/picker?currentProjectId=&amp;showSubTaskParent=true&amp;showSubTasks=true¤tIssueKey=null&amp;query=',
          hasDefaultValue: false,
          key: 'issuelinks',
          name: '链接的事务',
          operations: ['add'],
          required: false,
          schema: {
            items: 'issuelinks',
            system: 'issuelinks',
            type: 'array',
          },
        },
        issuetype: {
          allowedValues: [
            {
              avatarId: 10303,
              description: '问题或错误。',
              hierarchyLevel: 0,
              iconUrl:
                'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/issuetype/avatar/10303?size=medium',
              id: '10012',
              name: '缺陷',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/issuetype/10012',
              subtask: false,
            },
          ],
          hasDefaultValue: false,
          key: 'issuetype',
          name: '事务类型',
          operations: [],
          required: true,
          schema: {
            system: 'issuetype',
            type: 'issuetype',
          },
        },
        labels: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/1.0/labels/suggest?query=',
          hasDefaultValue: false,
          key: 'labels',
          name: '标签',
          operations: ['add', 'set', 'remove'],
          required: false,
          schema: {
            items: 'string',
            system: 'labels',
            type: 'array',
          },
        },
        parent: {
          hasDefaultValue: false,
          key: 'parent',
          name: '父级',
          operations: ['set'],
          required: false,
          schema: {
            system: 'parent',
            type: 'issuelink',
          },
        },
        priority: {
          allowedValues: [
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/highest.svg',
              id: '1',
              name: 'Highest',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/1',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/high.svg',
              id: '2',
              name: 'High',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/2',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/medium.svg',
              id: '3',
              name: 'Medium',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/3',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/low.svg',
              id: '4',
              name: 'Low',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/4',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/lowest.svg',
              id: '5',
              name: 'Lowest',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/5',
            },
          ],
          defaultValue: {
            iconUrl:
              'https://alexwoai.atlassian.net/images/icons/priorities/medium.svg',
            id: '3',
            name: 'Medium',
            self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/3',
          },
          hasDefaultValue: true,
          key: 'priority',
          name: '优先级',
          operations: ['set'],
          required: false,
          schema: {
            system: 'priority',
            type: 'priority',
          },
        },
        project: {
          allowedValues: [
            {
              avatarUrls: {
                '16x16':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419?size=xsmall',
                '24x24':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419?size=small',
                '32x32':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419?size=medium',
                '48x48':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419',
              },
              id: '10004',
              key: 'SBWJ',
              name: '自动',
              projectTypeKey: 'software',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/project/10004',
              simplified: false,
            },
          ],
          hasDefaultValue: false,
          key: 'project',
          name: '项目',
          operations: ['set'],
          required: true,
          schema: {
            system: 'project',
            type: 'project',
          },
        },
        reporter: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/user/search?query=',
          hasDefaultValue: true,
          key: 'reporter',
          name: '报告人',
          operations: ['set'],
          required: true,
          schema: {
            system: 'reporter',
            type: 'user',
          },
        },
        summary: {
          hasDefaultValue: false,
          key: 'summary',
          name: '摘要',
          operations: ['set'],
          required: true,
          schema: {
            system: 'summary',
            type: 'string',
          },
        },
        timetracking: {
          hasDefaultValue: false,
          key: 'timetracking',
          name: '时间跟踪',
          operations: ['set', 'edit'],
          required: false,
          schema: {
            system: 'timetracking',
            type: 'timetracking',
          },
        },
        versions: {
          allowedValues: [],
          hasDefaultValue: false,
          key: 'versions',
          name: '影响版本',
          operations: ['set', 'add', 'remove'],
          required: false,
          schema: {
            items: 'version',
            system: 'versions',
            type: 'array',
          },
        },
      },
    },
    {
      self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/issuetype/10000',
      id: '10000',
      description: '相关缺陷、故事和任务集。',
      iconurl:
        'https://alexwoai.atlassian.net/images/icons/issuetypes/epic.svg',
      name: '长篇故事',
      expand: 'fields',
      fields: {
        assignee: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/user/assignable/search?project=SBWJ&amp;query=',
          hasDefaultValue: false,
          key: 'assignee',
          name: '经办人',
          operations: ['set'],
          required: false,
          schema: {
            system: 'assignee',
            type: 'user',
          },
        },
        attachment: {
          hasDefaultValue: false,
          key: 'attachment',
          name: '附件',
          operations: ['set'],
          required: false,
          schema: {
            items: 'attachment',
            system: 'attachment',
            type: 'array',
          },
        },
        components: {
          allowedValues: [],
          hasDefaultValue: false,
          key: 'components',
          name: '组件',
          operations: ['add', 'set', 'remove'],
          required: false,
          schema: {
            items: 'component',
            system: 'components',
            type: 'array',
          },
        },
        customfield_10011: {
          hasDefaultValue: false,
          key: 'customfield_10011',
          name: 'Epic Name',
          operations: ['set'],
          required: true,
          schema: {
            custom: 'com.pyxis.greenhopper.jira:gh-epic-label',
            customId: 10011,
            type: 'string',
          },
        },
        customfield_10014: {
          hasDefaultValue: false,
          key: 'customfield_10014',
          name: 'Epic Link',
          operations: ['set'],
          required: false,
          schema: {
            custom: 'com.pyxis.greenhopper.jira:gh-epic-link',
            customId: 10014,
            type: 'any',
          },
        },
        customfield_10037: {
          hasDefaultValue: false,
          key: 'customfield_10037',
          name: 'URL 字段',
          operations: ['set'],
          required: false,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:url',
            customId: 10037,
            type: 'string',
          },
        },
        customfield_10038: {
          allowedValues: [
            {
              id: '10023',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10023',
              value: '单选一',
            },
            {
              id: '10024',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10024',
              value: '单选二',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10038',
          name: '单选按钮',
          operations: ['set'],
          required: false,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:radiobuttons',
            customId: 10038,
            type: 'option',
          },
        },
        customfield_10039: {
          allowedValues: [
            {
              id: '10025',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10025',
              value: '复选 1',
            },
            {
              id: '10026',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10026',
              value: '复选 2',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10039',
          name: '复选框',
          operations: ['add', 'set', 'remove'],
          required: false,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:multicheckboxes',
            customId: 10039,
            items: 'option',
            type: 'array',
          },
        },
        customfield_10040: {
          hasDefaultValue: false,
          key: 'customfield_10040',
          name: '必填数字字段',
          operations: ['set'],
          required: true,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:float',
            customId: 10040,
            type: 'number',
          },
        },
        customfield_10041: {
          hasDefaultValue: false,
          key: 'customfield_10041',
          name: '必填日期时间',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:datetime',
            customId: 10041,
            type: 'datetime',
          },
        },
        customfield_10042: {
          hasDefaultValue: false,
          key: 'customfield_10042',
          name: '必填日期',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:datepicker',
            customId: 10042,
            type: 'date',
          },
        },
        customfield_10043: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/1.0/labels/suggest?customFieldId=10043&amp;query=',
          hasDefaultValue: false,
          key: 'customfield_10043',
          name: '必填标签',
          operations: ['add', 'set', 'remove'],
          required: true,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:labels',
            customId: 10043,
            items: 'string',
            type: 'array',
          },
        },
        customfield_10044: {
          hasDefaultValue: false,
          key: 'customfield_10044',
          name: '必填段落',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:textarea',
            customId: 10044,
            type: 'string',
          },
        },
        customfield_10045: {
          hasDefaultValue: false,
          key: 'customfield_10045',
          name: '必填短文本',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:textfield',
            customId: 10045,
            type: 'string',
          },
        },
        customfield_10046: {
          allowedValues: [
            {
              id: '10027',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10027',
              value: '1',
            },
            {
              id: '10028',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10028',
              value: '2',
            },
            {
              id: '10029',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10029',
              value: '3',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10046',
          name: '必填列表 单选',
          operations: ['set'],
          required: true,
          schema: {
            custom: 'com.atlassian.jira.plugin.system.customfieldtypes:select',
            customId: 10046,
            type: 'option',
          },
        },
        customfield_10047: {
          allowedValues: [
            {
              id: '10030',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10030',
              value: '1',
            },
            {
              id: '10031',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10031',
              value: '2',
            },
            {
              id: '10032',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10032',
              value: '3',
            },
            {
              id: '10033',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/customFieldOption/10033',
              value: '4',
            },
          ],
          hasDefaultValue: false,
          key: 'customfield_10047',
          name: '必填选择列表 多选',
          operations: ['add', 'set', 'remove'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:multiselect',
            customId: 10047,
            items: 'option',
            type: 'array',
          },
        },
        customfield_10048: {
          allowedValues: [],
          hasDefaultValue: false,
          key: 'customfield_10048',
          name: '必填选择列表  级联操作',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:cascadingselect',
            customId: 10048,
            type: 'option-with-child',
          },
        },
        customfield_10049: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/1.0/users/picker?fieldName=customfield_10049&amp;fieldConfigId=10149&amp;projectId=10004&amp;showAvatar=true&amp;query=',
          hasDefaultValue: false,
          key: 'customfield_10049',
          name: '必填用户',
          operations: ['set'],
          required: true,
          schema: {
            custom:
              'com.atlassian.jira.plugin.system.customfieldtypes:userpicker',
            customId: 10049,
            type: 'user',
          },
        },
        description: {
          hasDefaultValue: false,
          key: 'description',
          name: '描述',
          operations: ['set'],
          required: false,
          schema: {
            system: 'description',
            type: 'string',
          },
        },
        duedate: {
          hasDefaultValue: false,
          key: 'duedate',
          name: '截止日期',
          operations: ['set'],
          required: false,
          schema: {
            system: 'duedate',
            type: 'date',
          },
        },
        fixVersions: {
          allowedValues: [],
          hasDefaultValue: false,
          key: 'fixVersions',
          name: '修复版本',
          operations: ['set', 'add', 'remove'],
          required: false,
          schema: {
            items: 'version',
            system: 'fixVersions',
            type: 'array',
          },
        },
        issuelinks: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/issue/picker?currentProjectId=&amp;showSubTaskParent=true&amp;showSubTasks=true¤tIssueKey=null&amp;query=',
          hasDefaultValue: false,
          key: 'issuelinks',
          name: '链接的事务',
          operations: ['add'],
          required: false,
          schema: {
            items: 'issuelinks',
            system: 'issuelinks',
            type: 'array',
          },
        },
        issuetype: {
          allowedValues: [
            {
              description: '相关缺陷、故事和任务集。',
              hierarchyLevel: 1,
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/issuetypes/epic.svg',
              id: '10000',
              name: '长篇故事',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/issuetype/10000',
              subtask: false,
            },
          ],
          hasDefaultValue: false,
          key: 'issuetype',
          name: '事务类型',
          operations: [],
          required: true,
          schema: {
            system: 'issuetype',
            type: 'issuetype',
          },
        },
        labels: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/1.0/labels/suggest?query=',
          hasDefaultValue: false,
          key: 'labels',
          name: '标签',
          operations: ['add', 'set', 'remove'],
          required: false,
          schema: {
            items: 'string',
            system: 'labels',
            type: 'array',
          },
        },
        priority: {
          allowedValues: [
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/highest.svg',
              id: '1',
              name: 'Highest',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/1',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/high.svg',
              id: '2',
              name: 'High',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/2',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/medium.svg',
              id: '3',
              name: 'Medium',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/3',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/low.svg',
              id: '4',
              name: 'Low',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/4',
            },
            {
              iconUrl:
                'https://alexwoai.atlassian.net/images/icons/priorities/lowest.svg',
              id: '5',
              name: 'Lowest',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/5',
            },
          ],
          defaultValue: {
            iconUrl:
              'https://alexwoai.atlassian.net/images/icons/priorities/medium.svg',
            id: '3',
            name: 'Medium',
            self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/priority/3',
          },
          hasDefaultValue: true,
          key: 'priority',
          name: '优先级',
          operations: ['set'],
          required: false,
          schema: {
            system: 'priority',
            type: 'priority',
          },
        },
        project: {
          allowedValues: [
            {
              avatarUrls: {
                '16x16':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419?size=xsmall',
                '24x24':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419?size=small',
                '32x32':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419?size=medium',
                '48x48':
                  'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/universal_avatar/view/type/project/avatar/10419',
              },
              id: '10004',
              key: 'SBWJ',
              name: '自动',
              projectTypeKey: 'software',
              self: 'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/project/10004',
              simplified: false,
            },
          ],
          hasDefaultValue: false,
          key: 'project',
          name: '项目',
          operations: ['set'],
          required: true,
          schema: {
            system: 'project',
            type: 'project',
          },
        },
        reporter: {
          autoCompleteUrl:
            'https://api.atlassian.com/ex/jira/d19b9b89-4826-4194-9944-373d774660fa/rest/api/2/user/search?query=',
          hasDefaultValue: true,
          key: 'reporter',
          name: '报告人',
          operations: ['set'],
          required: true,
          schema: {
            system: 'reporter',
            type: 'user',
          },
        },
        summary: {
          hasDefaultValue: false,
          key: 'summary',
          name: '摘要',
          operations: ['set'],
          required: true,
          schema: {
            system: 'summary',
            type: 'string',
          },
        },
        timetracking: {
          hasDefaultValue: false,
          key: 'timetracking',
          name: '时间跟踪',
          operations: ['set', 'edit'],
          required: false,
          schema: {
            system: 'timetracking',
            type: 'timetracking',
          },
        },
      },
    },
  ],
};
