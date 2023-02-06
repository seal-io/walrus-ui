export default {
  components: {
    schemas: {
      policyExpressionInput: {
        description: 'describe policy expression supported matcher input',
        type: 'object',
        properties: {
          sca: {
            description: 'describe catalog sca supported policy type',
            type: 'object',
            properties: {
              vulnerability: {
                description:
                  'describe expression input object for policy type vulnerability',
                type: 'object',
                properties: {
                  artifact: {
                    type: 'object',
                    properties: {
                      cpe: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                      },
                      language: {
                        type: 'string',
                      },
                      latestVersion: {
                        type: 'string',
                      },
                      licenses: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                      },
                      name: {
                        type: 'string',
                      },
                      purl: {
                        type: 'string',
                      },
                      type: {
                        type: 'string',
                      },
                      version: {
                        type: 'string',
                      },
                    },
                    additionalProperties: true,
                    required: [
                      'name',
                      'version',
                      'type',
                      'language',
                      'cpe',
                      'purl',
                      'licenses',
                      'latestVersion',
                    ],
                  },
                  cvs2: {
                    type: 'object',
                    properties: {
                      baseScore: {
                        type: 'number',
                        format: 'double',
                      },
                      exploitabilityScore: {
                        type: 'number',
                        format: 'double',
                      },
                      impactScore: {
                        type: 'number',
                        format: 'double',
                      },
                    },
                    additionalProperties: true,
                    required: [
                      'baseScore',
                      'exploitabilityScore',
                      'impactScore',
                    ],
                  },
                  cvs3: {
                    type: 'object',
                    properties: {
                      baseScore: {
                        type: 'number',
                        format: 'double',
                      },
                      exploitabilityScore: {
                        type: 'number',
                        format: 'double',
                      },
                      impactScore: {
                        type: 'number',
                        format: 'double',
                      },
                    },
                    additionalProperties: true,
                    required: [
                      'baseScore',
                      'exploitabilityScore',
                      'impactScore',
                    ],
                  },
                  dataSource: {
                    type: 'string',
                  },
                  id: {
                    type: 'string',
                  },
                  namespace: {
                    type: 'string',
                  },
                  severity: {
                    type: 'string',
                  },
                  urls: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                },
                additionalProperties: true,
                required: [
                  'id',
                  'dataSource',
                  'namespace',
                  'severity',
                  'urls',
                  'cvs2',
                  'cvs3',
                  'artifact',
                ],
              },
              licenseCompliance: {
                description:
                  'describe expression input object for policy type licenseCompliance',
                type: 'object',
                properties: {
                  cpe: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                  language: {
                    type: 'string',
                  },
                  latestVersion: {
                    type: 'string',
                  },
                  licenses: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                  name: {
                    type: 'string',
                  },
                  purl: {
                    type: 'string',
                  },
                  type: {
                    type: 'string',
                  },
                  version: {
                    type: 'string',
                  },
                },
                additionalProperties: true,
                required: [
                  'name',
                  'version',
                  'type',
                  'language',
                  'cpe',
                  'purl',
                  'licenses',
                  'latestVersion',
                ],
              },
            },
          },
          sast: {
            description: 'describe catalog sast supported policy type',
            type: 'object',
            properties: {
              secretLeaksPresent: {
                description:
                  'describe expression input object for policy type sastSecretLeaks',
                type: 'object',
                properties: {
                  author: {
                    type: 'string',
                  },
                  commit: {
                    type: 'string',
                  },
                  content: {
                    type: 'string',
                  },
                  date: {
                    type: 'string',
                  },
                  description: {
                    type: 'string',
                  },
                  email: {
                    type: 'string',
                  },
                  endLine: {
                    type: 'integer',
                    format: 'int32',
                  },
                  file: {
                    type: 'string',
                  },
                  match: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                  repositoryURL: {
                    type: 'string',
                  },
                  rulename: {
                    type: 'string',
                  },
                  startLine: {
                    type: 'integer',
                    format: 'int32',
                  },
                  toolname: {
                    type: 'string',
                  },
                },
                additionalProperties: true,
                required: [
                  'description',
                  'startLine',
                  'endLine',
                  'match',
                  'content',
                  'file',
                  'repositoryURL',
                  'commit',
                  'author',
                  'email',
                  'date',
                  'message',
                  'toolname',
                  'rulename',
                ],
              },
            },
          },
          configuration: {
            description: 'describe catalog configuration supported policy type',
            type: 'object',
            properties: {
              repositoryConfiguration: {
                description:
                  'describe expression input object for policy type repositoryConfiguration',
                type: 'object',
                properties: {
                  branchProtections: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        allowDeletions: {
                          type: 'boolean',
                        },
                        allowForcePushes: {
                          type: 'boolean',
                        },
                        branch: {
                          type: 'string',
                        },
                        dismissStaleReviews: {
                          type: 'boolean',
                        },
                        requireCodeOwnerReviews: {
                          type: 'boolean',
                        },
                        requiredApprovingReviewCount: {
                          type: 'integer',
                          format: 'int32',
                        },
                        requiredPullRequestReviews: {
                          type: 'boolean',
                        },
                        requiredStatusChecks: {
                          type: 'object',
                          properties: {
                            checks: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  appID: {
                                    type: 'integer',
                                    format: 'int64',
                                  },
                                  context: {
                                    type: 'string',
                                  },
                                },
                                additionalProperties: true,
                                required: ['context'],
                              },
                            },
                            strict: {
                              type: 'boolean',
                            },
                          },
                          additionalProperties: true,
                          required: ['strict', 'checks'],
                        },
                      },
                      additionalProperties: true,
                      required: [
                        'branch',
                        'requiredStatusChecks',
                        'requiredApprovingReviewCount',
                        'requiredPullRequestReviews',
                        'dismissStaleReviews',
                        'requireCodeOwnerReviews',
                        'allowForcePushes',
                        'allowDeletions',
                      ],
                    },
                  },
                  defaultBranch: {
                    type: 'string',
                  },
                  provider: {
                    type: 'string',
                  },
                  repositoryProtection: {
                    type: 'object',
                    properties: {
                      allowDeletions: {
                        type: 'boolean',
                      },
                      allowForcePushes: {
                        type: 'boolean',
                      },
                      dismissStaleReviews: {
                        type: 'boolean',
                      },
                      requireCodeOwnerReviews: {
                        type: 'boolean',
                      },
                      requiredApprovingReviewCount: {
                        type: 'integer',
                        format: 'int32',
                      },
                      requiredPullRequestReviews: {
                        type: 'boolean',
                      },
                      requiredStatusChecks: {
                        type: 'object',
                        properties: {
                          checks: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                appID: {
                                  type: 'integer',
                                  format: 'int64',
                                },
                                context: {
                                  type: 'string',
                                },
                              },
                              additionalProperties: true,
                              required: ['context'],
                            },
                          },
                          strict: {
                            type: 'boolean',
                          },
                        },
                        additionalProperties: true,
                        required: ['strict', 'checks'],
                      },
                    },
                    additionalProperties: true,
                    required: [
                      'requiredStatusChecks',
                      'requiredApprovingReviewCount',
                      'requiredPullRequestReviews',
                      'dismissStaleReviews',
                      'requireCodeOwnerReviews',
                      'allowForcePushes',
                      'allowDeletions',
                    ],
                  },
                },
                additionalProperties: true,
                required: [
                  'provider',
                  'defaultBranch',
                  'branchProtections',
                  'repositoryProtection',
                ],
              },
            },
          },
        },
      },
    },
  },
};
