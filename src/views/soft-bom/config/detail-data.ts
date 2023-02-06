export default {
  id: '130382e4-0366-4c6f-8a76-5760fa5aa6a2',
  createTime: '2022-09-01T16:02:29.829217Z',
  updateTime: '2022-09-01T16:02:29.829218Z',
  name: 'github.com/prometheus/client_golang',
  version: 'v1.4.0',
  latestVersion: 'v1.13.0',
  purl: 'pkg:golang/github.com/prometheus/client_golang@v1.4.0',
  licenses: [
    {
      license: {
        id: 'Apache-2.0',
      },
    },
  ],
  type: 'library',
  properties: {
    'package:language': 'go',
  },
  scorecard: {
    date: '2022-08-22',
    repo: {
      name: 'github.com/prometheus/client_golang',
      commit: '83d56b1144a0c2eb10d399e7abbae3333bebc463',
    },
    scorecard: {
      version: 'v4.6.0-7-ge2813b8',
      commit: 'e2813b8e8df1bd58c6aa069970fcc5fdd617a8ca',
    },
    check: [
      {
        name: 'Maintained',
        documentation: {
          short: 'Determines if the project is "actively maintained".',
          url: 'https://github.com/ossf/scorecard/blob/e2813b8e8df1bd58c6aa069970fcc5fdd617a8ca/docs/checks.md#maintained',
        },
        score: 10,
        reason:
          '30 commit(s) out of 30 and 13 issue activity out of 30 found in the last 90 days -- score normalized to 10',
      },
      {
        name: 'Code-Review',
        documentation: {
          short:
            'Determines if the project requires code review before pull requests (aka merge requests) are merged.',
          url: 'https://github.com/ossf/scorecard/blob/e2813b8e8df1bd58c6aa069970fcc5fdd617a8ca/docs/checks.md#code-review',
        },
        score: 10,
        reason: 'all last 30 commits are reviewed through GitHub',
      },
      {
        name: 'CII-Best-Practices',
        documentation: {
          short: 'Determines if the project has a CII Best Practices Badge.',
          url: 'https://github.com/ossf/scorecard/blob/e2813b8e8df1bd58c6aa069970fcc5fdd617a8ca/docs/checks.md#cii-best-practices',
        },
        score: 0,
        reason: 'no badge detected',
      },
      {
        name: 'Vulnerabilities',
        documentation: {
          short:
            'Determines if the project has open, known unfixed vulnerabilities.',
          url: 'https://github.com/ossf/scorecard/blob/e2813b8e8df1bd58c6aa069970fcc5fdd617a8ca/docs/checks.md#vulnerabilities',
        },
        score: 10,
        reason: 'no vulnerabilities detected',
      },
      {
        name: 'Security-Policy',
        documentation: {
          short: 'Determines if the project has published a security policy.',
          url: 'https://github.com/ossf/scorecard/blob/e2813b8e8df1bd58c6aa069970fcc5fdd617a8ca/docs/checks.md#security-policy',
        },
        score: 10,
        reason: 'security policy file detected',
        details: [
          'Info: security policy detected in current repo: SECURITY.md:1',
        ],
      },
      {
        name: 'Dependency-Update-Tool',
        documentation: {
          short: 'Determines if the project uses a dependency update tool.',
          url: 'https://github.com/ossf/scorecard/blob/e2813b8e8df1bd58c6aa069970fcc5fdd617a8ca/docs/checks.md#dependency-update-tool',
        },
        score: 10,
        reason: 'update tool detected',
        details: ['Info: Dependabot detected: .github/dependabot.yml:1'],
      },
      {
        name: 'Packaging',
        documentation: {
          short:
            'Determines if the project is published as a package that others can easily download, install, easily update, and uninstall.',
          url: 'https://github.com/ossf/scorecard/blob/e2813b8e8df1bd58c6aa069970fcc5fdd617a8ca/docs/checks.md#packaging',
        },
        score: -1,
        reason: 'no published package detected',
        details: ['Warn: no GitHub publishing workflow detected'],
      },
      {
        name: 'Token-Permissions',
        documentation: {
          short:
            "Determines if the project's workflows follow the principle of least privilege.",
          url: 'https://github.com/ossf/scorecard/blob/e2813b8e8df1bd58c6aa069970fcc5fdd617a8ca/docs/checks.md#token-permissions',
        },
        score: 0,
        reason: 'non read-only tokens detected in GitHub workflows',
        details: [
          'Warn: no topLevel permission defined: .github/workflows/codeql-analysis.yml:1: update your workflow using https://app.stepsecurity.io/secureworkflow/prometheus/client_golang/codeql-analysis.yml/main?enable=permissions',
          "Info: jobLevel 'actions' permission set to 'read': .github/workflows/codeql-analysis.yml:28: update your workflow using https://app.stepsecurity.io/secureworkflow/prometheus/client_golang/codeql-analysis.yml/main?enable=permissions",
          "Info: jobLevel 'contents' permission set to 'read': .github/workflows/codeql-analysis.yml:29: update your workflow using https://app.stepsecurity.io/secureworkflow/prometheus/client_golang/codeql-analysis.yml/main?enable=permissions",
          'Warn: no topLevel permission defined: .github/workflows/golangci-lint.yml:1: update your workflow using https://app.stepsecurity.io/secureworkflow/prometheus/client_golang/golangci-lint.yml/main?enable=permissions',
        ],
      },
      {
        name: 'Dangerous-Workflow',
        documentation: {
          short:
            "Determines if the project's GitHub Action workflows avoid dangerous patterns.",
          url: 'https://github.com/ossf/scorecard/blob/e2813b8e8df1bd58c6aa069970fcc5fdd617a8ca/docs/checks.md#dangerous-workflow',
        },
        score: 10,
        reason: 'no dangerous workflow patterns detected',
      },
      {
        name: 'License',
        documentation: {
          short: 'Determines if the project has defined a license.',
          url: 'https://github.com/ossf/scorecard/blob/e2813b8e8df1bd58c6aa069970fcc5fdd617a8ca/docs/checks.md#license',
        },
        score: 10,
        reason: 'license file detected',
        details: ['Info: : LICENSE:1'],
      },
      {
        name: 'Binary-Artifacts',
        documentation: {
          short:
            'Determines if the project has generated executable (binary) artifacts in the source repository.',
          url: 'https://github.com/ossf/scorecard/blob/e2813b8e8df1bd58c6aa069970fcc5fdd617a8ca/docs/checks.md#binary-artifacts',
        },
        score: 10,
        reason: 'no binaries found in the repo',
      },
      {
        name: 'Signed-Releases',
        documentation: {
          short:
            'Determines if the project cryptographically signs release artifacts.',
          url: 'https://github.com/ossf/scorecard/blob/e2813b8e8df1bd58c6aa069970fcc5fdd617a8ca/docs/checks.md#signed-releases',
        },
        score: -1,
        reason: 'no releases found',
        details: ['Warn: no GitHub releases found'],
      },
      {
        name: 'Fuzzing',
        documentation: {
          short: 'Determines if the project uses fuzzing.',
          url: 'https://github.com/ossf/scorecard/blob/e2813b8e8df1bd58c6aa069970fcc5fdd617a8ca/docs/checks.md#fuzzing',
        },
        score: 0,
        reason: 'project is not fuzzed',
      },
      {
        name: 'Pinned-Dependencies',
        documentation: {
          short:
            'Determines if the project has declared and pinned its dependencies.',
          url: 'https://github.com/ossf/scorecard/blob/e2813b8e8df1bd58c6aa069970fcc5fdd617a8ca/docs/checks.md#pinned-dependencies',
        },
        score: 5,
        reason:
          'dependency not pinned by hash detected -- score normalized to 5',
        details: [
          'Warn: GitHub-owned GitHubAction not pinned by hash: .github/workflows/codeql-analysis.yml:41: update your workflow using https://app.stepsecurity.io/secureworkflow/prometheus/client_golang/codeql-analysis.yml/main?enable=pin',
          'Warn: GitHub-owned GitHubAction not pinned by hash: .github/workflows/codeql-analysis.yml:45: update your workflow using https://app.stepsecurity.io/secureworkflow/prometheus/client_golang/codeql-analysis.yml/main?enable=pin',
          'Warn: GitHub-owned GitHubAction not pinned by hash: .github/workflows/codeql-analysis.yml:56: update your workflow using https://app.stepsecurity.io/secureworkflow/prometheus/client_golang/codeql-analysis.yml/main?enable=pin',
          'Warn: GitHub-owned GitHubAction not pinned by hash: .github/workflows/codeql-analysis.yml:70: update your workflow using https://app.stepsecurity.io/secureworkflow/prometheus/client_golang/codeql-analysis.yml/main?enable=pin',
          'Warn: GitHub-owned GitHubAction not pinned by hash: .github/workflows/golangci-lint.yml:19: update your workflow using https://app.stepsecurity.io/secureworkflow/prometheus/client_golang/golangci-lint.yml/main?enable=pin',
          'Warn: GitHub-owned GitHubAction not pinned by hash: .github/workflows/golangci-lint.yml:21: update your workflow using https://app.stepsecurity.io/secureworkflow/prometheus/client_golang/golangci-lint.yml/main?enable=pin',
          'Warn: third-party GitHubAction not pinned by hash: .github/workflows/golangci-lint.yml:28: update your workflow using https://app.stepsecurity.io/secureworkflow/prometheus/client_golang/golangci-lint.yml/main?enable=pin',
          'Warn: containerImage not pinned by hash: Dockerfile:15: pin your Docker image by updating golang:1 to golang:1@sha256:d3f734e1f46ec36da8c1bce67cd48536138085289e24cfc8765f483c401b7d96',
          'Warn: containerImage not pinned by hash: Dockerfile:28: pin your Docker image by updating quay.io/prometheus/busybox to quay.io/prometheus/busybox@sha256:742b69ff23ee32309eb463ac38c8f21e029b736673fd32bc74858f1e9e023255',
          'Info: no insecure (not pinned by hash) dependency downloads found in Dockerfiles',
          'Info: no insecure (not pinned by hash) dependency downloads found in shell scripts',
        ],
      },
      {
        name: 'Branch-Protection',
        documentation: {
          short:
            "Determines if the default and release branches are protected with GitHub's branch protection settings.",
          url: 'https://github.com/ossf/scorecard/blob/e2813b8e8df1bd58c6aa069970fcc5fdd617a8ca/docs/checks.md#branch-protection',
        },
        score: 4,
        reason:
          'branch protection is not maximal on development and all release branches',
        details: [
          "Info: 'force pushes' disabled on branch 'main'",
          "Info: 'allow deletion' disabled on branch 'main'",
          "Info: status check found to merge onto on branch 'main'",
          "Warn: number of required reviewers is only 0 on branch 'main'",
          "Info: 'force pushes' disabled on branch 'release-1.11'",
          "Info: 'allow deletion' disabled on branch 'release-1.11'",
          "Warn: no status checks found to merge onto branch 'release-1.11'",
          "Warn: number of required reviewers is only 1 on branch 'release-1.11'",
        ],
      },
    ],
    score: 7.3,
  },
  links: null,
  edges: {},
  dependencyTrails: [
    [
      {
        displayName: 'aiwantaozi/simple-go-app',
        resourceType: 'Repository',
        type: 'swid',
        id: 'a6c66110-b27a-4c17-8673-b1bd2cb65878',
      },
      {
        displayName: 'go.mod',
        resourceType: 'SoftwarePackage',
        type: 'file',
        id: 'f13b4432-b201-426e-9e7d-c5109ac47b5f',
      },
      {
        displayName: 'github.com/armon/go-metrics',
        resourceType: 'SoftwarePackage',
        type: 'library',
        id: '2b774705-e8c0-4add-ac62-0c0c0bfe2325',
      },
      {
        displayName: 'github.com/prometheus/client_golang',
        resourceType: 'SoftwarePackage',
        type: 'library',
        id: '130382e4-0366-4c6f-8a76-5760fa5aa6a2',
      },
    ],
    [
      {
        displayName: 'aiwantaozi/simple-go-app',
        resourceType: 'Repository',
        type: 'swid',
        id: 'a6c66110-b27a-4c17-8673-b1bd2cb65878',
      },
      {
        displayName: 'go.mod',
        resourceType: 'SoftwarePackage',
        type: 'file',
        id: 'f13b4432-b201-426e-9e7d-c5109ac47b5f',
      },
      {
        displayName: 'github.com/hashicorp/vault/api',
        resourceType: 'SoftwarePackage',
        type: 'library',
        id: '88bf1b6e-0201-41de-a160-d0e583a50537',
      },
      {
        displayName: 'github.com/armon/go-metrics',
        resourceType: 'SoftwarePackage',
        type: 'library',
        id: '2b774705-e8c0-4add-ac62-0c0c0bfe2325',
      },
      {
        displayName: 'github.com/prometheus/client_golang',
        resourceType: 'SoftwarePackage',
        type: 'library',
        id: '130382e4-0366-4c6f-8a76-5760fa5aa6a2',
      },
    ],
    [
      {
        displayName: 'aiwantaozi/simple-go-app',
        resourceType: 'Repository',
        type: 'swid',
        id: 'a6c66110-b27a-4c17-8673-b1bd2cb65878',
      },
      {
        displayName: 'go.mod',
        resourceType: 'SoftwarePackage',
        type: 'file',
        id: 'f13b4432-b201-426e-9e7d-c5109ac47b5f',
      },
      {
        displayName: 'github.com/hashicorp/vault/sdk',
        resourceType: 'SoftwarePackage',
        type: 'library',
        id: '6198ceab-0738-40e4-8ca4-745c14e44fcd',
      },
      {
        displayName: 'github.com/armon/go-metrics',
        resourceType: 'SoftwarePackage',
        type: 'library',
        id: '2b774705-e8c0-4add-ac62-0c0c0bfe2325',
      },
      {
        displayName: 'github.com/prometheus/client_golang',
        resourceType: 'SoftwarePackage',
        type: 'library',
        id: '130382e4-0366-4c6f-8a76-5760fa5aa6a2',
      },
    ],
  ],
  vulnerabilities: [
    {
      namespace: 'ghsa',
      name: 'GHSA-cg3q-j54f-5p7p',
      purl: 'pkg:golang/github.com/prometheus/client_golang#/prometheus/promhttp',
      deprecated: false,
      tags: ['CVE-2022-21698'],
      references: [
        'https://github.com/advisories/GHSA-cg3q-j54f-5p7p',
        'https://github.com/prometheus/client_golang/security/advisories/GHSA-cg3q-j54f-5p7p',
        'https://nvd.nist.gov/vuln/detail/CVE-2022-21698',
        'https://github.com/prometheus/client_golang/pull/962',
      ],
      summary: 'Uncontrolled Resource Consumption in promhttp',
      description:
        'This is the Go client library for Prometheus. It has two separate parts, one for instrumenting application code, and one for creating clients that talk to the Prometheus HTTP API. client_golang is the instrumentation library for Go applications in Prometheus, and the promhttp package in client_golang provides tooling around HTTP servers and clients.\n\n### Impact\n\nHTTP server susceptible to a Denial of Service through unbounded cardinality, and potential memory exhaustion, when handling requests with non-standard HTTP methods.\n\n###  Affected Configuration\n\nIn order to be affected, an instrumented software must\n\n* Use any of `promhttp.InstrumentHandler*` middleware except `RequestsInFlight`.\n* Do not filter any specific methods (e.g GET) before middleware.\n* Pass metric with `method` label name to our middleware.\n* Not have any firewall/LB/proxy that filters away requests with unknown `method`.\n\n### Patches\n\n* https://github.com/prometheus/client_golang/pull/962\n* https://github.com/prometheus/client_golang/pull/987\n\n### Workarounds\n\nIf you cannot upgrade to [v1.11.1 or above](https://github.com/prometheus/client_golang/releases/tag/v1.11.1), in order to stop being affected you can:\n\n* Remove `method` label name from counter/gauge you use in the InstrumentHandler.\n* Turn off affected promhttp handlers.\n* Add custom middleware before promhttp handler that will sanitize the request method given by Go http.Request.\n* Use a reverse proxy or web application firewall, configured to only allow a limited set of methods.\n\n### For more information\n\nIf you have any questions or comments about this advisory:\n\n* Open an issue in https://github.com/prometheus/client_golang\n* Email us at `prometheus-team@googlegroups.com`\n',
      cvss: {
        version: '3.1',
        vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H',
        baseScore: 7.5,
        baseSeverity: 'HIGH',
        exploitabilityScore: 3.9,
        impactScore: 3.6,
      },
      cwes: ['CWE-400'],
      limited: '',
      affected: '<1.11.1',
      patched: ['1.11.1'],
      modified: '2022-07-05T18:06:13Z',
      reviewed: true,
    },
    {
      namespace: 'osv',
      name: 'GO-2022-0322',
      purl: 'pkg:golang/github.com/prometheus/client_golang',
      deprecated: false,
      tags: ['CVE-2022-21698'],
      references: ['https://osv.dev/vulnerability/GO-2022-0322'],
      summary: '',
      description:
        'The Prometheus client_golang HTTP server is vulnerable to a denial of\nservice attack when handling requests with non-standard HTTP methods.\n\nIn order to be affected, an instrumented software must use any of\nthe promhttp.InstrumentHandler* middleware except `RequestsInFlight`;\nnot filter any specific methods (e.g GET) before middleware;\npass a metric with a "method" label name to a middleware; and not\nhave any firewall/LB/proxy that filters away requests with unknown\n"method".\n',
      cvss: {
        version: '3.1',
        vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H',
        baseScore: 7.5,
        baseSeverity: 'HIGH',
        exploitabilityScore: 3.9,
        impactScore: 3.6,
      },
      cwes: ['CWE-400'],
      limited: '',
      affected: '>=0,<1.11.1',
      patched: ['1.11.1'],
      modified: '2022-08-30T16:21:56Z',
      reviewed: false,
    },
  ],
};
