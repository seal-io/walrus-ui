export default {
  componments: {
    schemas: {
      policyCondition: {
        description: 'describe sast supported condition',
        type: 'object',
        properties: {
          sca: {
            description: 'describe artifact supported condition',
            type: 'object',
            properties: {
              vulnerability: {
                description: 'describe vulnerability supported condition',
                type: 'object',
                properties: {
                  vulnerabilitySeverity: {
                    description:
                      'describe condition type vulnerabilitySeverity',
                    type: 'object',
                    properties: {
                      value: {
                        $ref: '/policies',
                        type: 'string',
                        description: 'value=id&label=name',
                        enum: ['Critical', 'High', 'Medium', 'Low'],
                        example: 'Critical,Low',
                      },
                      operator: {
                        type: 'string',
                        enum: ['in'],
                      },
                    },
                  },
                  vulnerabilityCVS3Score: {
                    description:
                      'describe condition type vulnerabilityCVS3Score',
                    type: 'object',
                    properties: {
                      value: {
                        type: 'range',
                        maximum: 10,
                        minimum: 0,
                        example: '7.0,9.0',
                      },
                      operator: {
                        type: 'string',
                        enum: ['withinRange'],
                      },
                    },
                  },
                },
              },
              licenseCompliance: {
                description: 'describe artifact supported condition',
                type: 'object',
                properties: {
                  licenseIDs: {
                    description: 'describe condition type licenseCompliance',
                    type: 'object',
                    properties: {
                      value: {
                        $ref: '/v1/licenseGroups',
                        description: 'value=id;label=name',
                        type: 'string',
                        example: 'bandedLicenseGroup',
                      },
                      operator: {
                        type: 'string',
                        enum: ['BelongToGroup'],
                      },
                    },
                  },
                },
              },
            },
          },
          sast: {
            description: 'describe sast supported condition',
            type: 'object',
            properties: {
              sastSecretLeaks: {
                type: 'object',
                properties: {
                  file: {
                    type: 'object',
                    properties: {
                      value: {
                        type: 'string',
                        example: 'main.go',
                      },
                      operator: {
                        type: 'string',
                        enum: ['=='],
                      },
                    },
                  },
                  secretLeaksPresent: {
                    type: 'string',
                  },
                },
              },
            },
          },
          configuration: {
            description: 'describe configuration supported condition',
            type: 'object',
            properties: {
              repositoryConfiguration: {
                type: 'object',
                properties: {
                  branchProtectionRequiredStatusCheckDisabled: {
                    type: 'string',
                  },
                  branchProtectionAllowDeletion: {
                    type: 'string',
                  },
                  branchProtectionAllowForcePush: {
                    type: 'string',
                  },
                  branchProtectionPullRequestRequireCodeOwnerReviewDisabled: {
                    type: 'string',
                  },
                  branchProtectionPullRequestApprovingCount: {
                    type: 'string',
                  },
                  branchProtectionPullRequestDismissStaleReviewDisabled: {
                    type: 'string',
                  },
                  branchProtectionPullRequestDisabled: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
