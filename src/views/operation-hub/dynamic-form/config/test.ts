export default {
  title: 'form',
  type: 'object',
  $schema: 'http://json-schema.org/schema#',
  properties: {
    'rbac': { type: 'object', properties: { create: { type: 'boolean' } } },
    'server': {
      type: 'object',
      properties: {
        env: { type: 'array' },
        name: { type: 'string' },
        tsdb: { type: 'object' },
        image: {
          type: 'object',
          properties: {
            tag: { type: 'string' },
            digest: { type: 'string' },
            pullPolicy: { type: 'string' },
            repository: { type: 'string' }
          }
        },
        global: {
          type: 'object',
          properties: {
            scrape_timeout: { type: 'string' },
            scrape_interval: { type: 'string' },
            evaluation_interval: { type: 'string' }
          }
        },
        baseURL: { type: 'string' },
        command: { type: 'array' },
        ingress: {
          type: 'object',
          properties: {
            tls: { type: 'array' },
            path: { type: 'string' },
            hosts: { type: 'array' },
            enabled: { type: 'boolean' },
            pathType: { type: 'string' },
            extraPaths: { type: 'array' },
            annotations: { type: 'object' },
            extraLabels: { type: 'object' }
          }
        },
        service: {
          type: 'object',
          properties: {
            gRPC: {
              type: 'object',
              properties: {
                enabled: { type: 'boolean' },
                servicePort: { type: 'integer' }
              }
            },
            type: { type: 'string' },
            labels: { type: 'object' },
            enabled: { type: 'boolean' },
            clusterIP: { type: 'string' },
            annotations: { type: 'object' },
            externalIPs: { type: 'array' },
            servicePort: { type: 'integer' },
            loadBalancerIP: { type: 'string' },
            sessionAffinity: { type: 'string' },
            statefulsetReplica: {
              type: 'object',
              properties: {
                enabled: { type: 'boolean' },
                replica: { type: 'integer' }
              }
            },
            loadBalancerSourceRanges: { type: 'array' }
          }
        },
        affinity: { type: 'object' },
        emptyDir: {
          type: 'object',
          properties: { sizeLimit: { type: 'string' } }
        },
        strategy: { type: 'object', properties: { type: { type: 'string' } } },
        dnsConfig: { type: 'object' },
        dnsPolicy: { type: 'string' },
        exemplars: { type: 'object' },
        extraArgs: { type: 'object' },
        podLabels: { type: 'object' },
        prefixURL: { type: 'string' },
        resources: { type: 'object' },
        retention: { type: 'string' },
        configPath: { type: 'string' },
        extraFlags: { type: 'array', items: { type: 'string' } },
        remoteRead: { type: 'array' },
        hostAliases: { type: 'array' },
        hostNetwork: { type: 'boolean' },
        probeScheme: { type: 'string' },
        remoteWrite: { type: 'array' },
        statefulSet: {
          type: 'object',
          properties: {
            labels: { type: 'object' },
            enabled: { type: 'boolean' },
            headless: {
              type: 'object',
              properties: {
                gRPC: {
                  type: 'object',
                  properties: {
                    enabled: { type: 'boolean' },
                    servicePort: { type: 'integer' }
                  }
                },
                labels: { type: 'object' },
                annotations: { type: 'object' },
                servicePort: { type: 'integer' }
              }
            },
            annotations: { type: 'object' },
            podManagementPolicy: { type: 'string' },
            pvcDeleteOnStsScale: { type: 'boolean' },
            pvcDeleteOnStsDelete: { type: 'boolean' }
          }
        },
        storagePath: { type: 'string' },
        tolerations: { type: 'array' },
        extraVolumes: { type: 'array' },
        nodeSelector: { type: 'object' },
        probeHeaders: { type: 'array' },
        replicaCount: { type: 'integer' },
        startupProbe: {
          type: 'object',
          properties: {
            enabled: { type: 'boolean' },
            periodSeconds: { type: 'integer' },
            timeoutSeconds: { type: 'integer' },
            failureThreshold: { type: 'integer' }
          }
        },
        alertmanagers: { type: 'array' },
        podAnnotations: { type: 'object' },
        securityContext: {
          type: 'object',
          properties: {
            fsGroup: { type: 'integer' },
            runAsUser: { type: 'integer' },
            runAsGroup: { type: 'integer' },
            runAsNonRoot: { type: 'boolean' }
          }
        },
        persistentVolume: {
          type: 'object',
          properties: {
            size: { type: 'string' },
            labels: { type: 'object' },
            enabled: { type: 'boolean' },
            subPath: { type: 'string' },
            mountPath: { type: 'string' },
            accessModes: { type: 'array', items: { type: 'string' } },
            annotations: { type: 'object' },
            existingClaim: { type: 'string' },
            statefulSetNameOverride: { type: 'string' }
          }
        },
        releaseNamespace: { type: 'boolean' },
        extraSecretMounts: { type: 'array' },
        extraVolumeMounts: { type: 'array' },
        podSecurityPolicy: {
          type: 'object',
          properties: { annotations: { type: 'object' } }
        },
        priorityClassName: { type: 'string' },
        sidecarContainers: { type: 'object' },
        enableServiceLinks: { type: 'boolean' },
        verticalAutoscaler: {
          type: 'object',
          properties: { enabled: { type: 'boolean' } }
        },
        extraHostPathMounts: { type: 'array' },
        extraInitContainers: { type: 'array' },
        podDisruptionBudget: {
          type: 'object',
          properties: {
            enabled: { type: 'boolean' },
            maxUnavailable: { type: 'integer' }
          }
        },
        defaultFlagsOverride: { type: 'array' },
        extraConfigmapLabels: { type: 'object' },
        extraConfigmapMounts: { type: 'array' },
        livenessProbeTimeout: { type: 'integer' },
        revisionHistoryLimit: { type: 'integer' },
        configMapOverrideName: { type: 'string' },
        deploymentAnnotations: { type: 'object' },
        readinessProbeTimeout: { type: 'integer' },
        sidecarTemplateValues: { type: 'object' },
        tcpSocketProbeEnabled: { type: 'boolean' },
        clusterRoleNameOverride: { type: 'string' },
        containerSecurityContext: { type: 'object' },
        livenessProbeInitialDelay: { type: 'integer' },
        topologySpreadConstraints: { type: 'array' },
        livenessProbePeriodSeconds: { type: 'integer' },
        readinessProbeInitialDelay: { type: 'integer' },
        readinessProbePeriodSeconds: { type: 'integer' },
        livenessProbeFailureThreshold: { type: 'integer' },
        livenessProbeSuccessThreshold: { type: 'integer' },
        terminationGracePeriodSeconds: { type: 'integer' },
        readinessProbeFailureThreshold: { type: 'integer' },
        readinessProbeSuccessThreshold: { type: 'integer' }
      }
    },
    'ruleFiles': { type: 'object' },
    'serverFiles': {
      type: 'object',
      properties: {
        rules: { type: 'object' },
        alerts: { type: 'object' },
        prometheus: {
          type: 'object',
          properties: {
            rule_files: { type: 'array', items: { type: 'string' } },
            scrape_configs: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  job_name: { type: 'string' },
                  static_configs: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        targets: { type: 'array', items: { type: 'string' } }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        alerting_rules: { type: 'object' },
        recording_rules: { type: 'object' }
      }
    },
    'alertmanager': {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
        persistence: {
          type: 'object',
          properties: { size: { type: 'string' } }
        },
        podSecurityContext: {
          type: 'object',
          properties: {
            fsGroup: { type: 'integer' },
            runAsUser: { type: 'integer' },
            runAsGroup: { type: 'integer' },
            runAsNonRoot: { type: 'boolean' }
          }
        }
      }
    },
    'networkPolicy': {
      type: 'object',
      properties: { enabled: { type: 'boolean' } }
    },
    'extraManifests': { type: 'array' },
    'forceNamespace': { type: 'string' },
    'configmapReload': {
      type: 'object',
      properties: {
        env: { type: 'array' },
        reloadUrl: { type: 'string' },
        prometheus: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            image: {
              type: 'object',
              properties: {
                tag: { type: 'string' },
                digest: { type: 'string' },
                pullPolicy: { type: 'string' },
                repository: { type: 'string' }
              }
            },
            enabled: { type: 'boolean' },
            extraArgs: { type: 'object' },
            resources: { type: 'object' },
            extraVolumeDirs: { type: 'array' },
            extraVolumeMounts: { type: 'array' },
            extraConfigmapMounts: { type: 'array' },
            containerSecurityContext: { type: 'object' }
          }
        }
      }
    },
    'serviceAccounts': {
      type: 'object',
      properties: {
        server: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            create: { type: 'boolean' },
            annotations: { type: 'object' }
          }
        }
      }
    },
    'imagePullSecrets': { type: 'array' },
    'podSecurityPolicy': {
      type: 'object',
      properties: { enabled: { type: 'boolean' } }
    },
    'extraScrapeConfigs': { type: 'string' },
    'kube-state-metrics': {
      type: 'object',
      properties: { enabled: { type: 'boolean' } }
    },
    'alertRelabelConfigs': { type: 'object' },
    'prometheus-pushgateway': {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
        serviceAnnotations: {
          type: 'object',
          properties: { 'prometheus.io/probe': { type: 'string' } }
        }
      }
    },
    'prometheus-node-exporter': {
      type: 'object',
      properties: {
        rbac: {
          type: 'object',
          properties: { pspEnabled: { type: 'boolean' } }
        },
        enabled: { type: 'boolean' },
        containerSecurityContext: {
          type: 'object',
          properties: { allowPrivilegeEscalation: { type: 'boolean' } }
        }
      }
    }
  }
};
