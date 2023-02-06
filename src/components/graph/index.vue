<template>
  <div style="width: 100%; background: #fff" class="box">
    <a-spin class="graph-wrap" :loading="loading">
      <comCard :body-style="{ padding: '10px 20px 10px' }">
        <div ref="main" class="main">
          <div class="fold-btn query" :class="{ unfold: foldBtnActived }">
            <icon-menu-fold v-show="!foldBtnActived" @click="handleToggle" />
            <icon-menu-unfold v-show="foldBtnActived" @click="handleToggle" />
            <!-- <a-switch
                v-model="filterEnable"
                size="small"
                class="enable-btn"
                @change="handleEnableChange"
              >
            </a-switch>
            <span class="enable-text"> Filter Enable </span> -->
            <!-- <div class="query-box">
              <span v-for="(item, index) in paramsList" :key="index">
                <span class="type">{{ $t(item.label) }}:</span>
                <a-tag
                  v-for="(sItem, sIndex) in item.value"
                  :key="sIndex"
                  closable
                  color="#82a0c7"
                  size="small"
                  @close="handleCloseQuery(item, sItem)"
                  >{{ sItem }}</a-tag
                >
              </span>
            </div> -->
          </div>
          <div class="fold-btn toolbox" :class="{ unfold: foldBtnActived }">
            <a-space :size="10" direction="vertical">
              <IconFont
                type="icon-fit_screen-o"
                style="color: 'rgb(17, 75, 163)'"
                @click="handleFitView"
              />
              <icon-undo
                style="color: 'rgb(78, 89, 105)'"
                @click="handleUndoFetchData"
              />
            </a-space>
          </div>
          <div
            class="search"
            :class="{ 'unfold': isUnfold, 'd-fold': staticFold }"
          >
            <div class="search-wrap">
              <div class="search-content">
                <div class="group-title">
                  <span>{{ $t('graph.filter.dataSearch') }}</span>
                  <a-tooltip content-class="graph-tooltip">
                    <template #content>
                      <div style="display: flex; flex-direction: column">
                        <span>1. {{ $t('graph.resource.search.tip1') }}</span>
                        <span> {{ $t('graph.resource.search.tip2') }}</span>
                        <span>2. {{ $t('graph.resource.search.tip3') }}</span>
                        <span>3. {{ $t('graph.resource.search.tip4') }}</span>
                        <span
                          >4.
                          {{ $t('graph.resource.search.tip5') }}
                          vulnerability、package、license、resource、tags、vulnerable</span
                        >
                        <span
                          >{{
                            $t('graph.resource.search.tip6')
                          }}
                          vulnerability:CVE-123 license:Apache-2.0 package:log4j
                          resource:my-resource-name tags:tag1 tags:tag2
                          vulnerable:true</span
                        >
                      </div>
                    </template>
                    <icon-question-circle
                      style="margin-left: 5px; font-size: 14px"
                    />
                  </a-tooltip>
                </div>
                <paramsEditor
                  v-model="searchQuery.query"
                  controller="input"
                  :placeholder="$t('graph.filter.holder')"
                  :source="completerData"
                  @change="handleQueryInput"
                ></paramsEditor>
                <div class="group-title view">
                  <span>{{ $t('graph.filter.dataView') }}</span>
                  <span class="switch-box">
                    <SLSwitch
                      v-model="filterMode"
                      @change="handleEnableChange"
                    ></SLSwitch>
                  </span>
                </div>
                <single-params
                  v-model="params.type"
                  :title="$t('graph.filter.resourceType')"
                  :options="typeViewList"
                  class="params-item"
                  :active-key="activeKey === 'type'"
                  @change="handleParamsChange"
                  @view-change="(val) => handleViewChange(val, 'type')"
                  @toggle="(val) => handleFilterToggle(val, 'type')"
                ></single-params>
                <single-params
                  v-model="params.severity"
                  :title="$t('graph.filter.vuln')"
                  :options="vulnViewList"
                  class="params-item"
                  :active-key="activeKey === 'severity'"
                  @change="handleParamsChange"
                  @view-change="(val) => handleViewChange(val, 'severity')"
                  @toggle="(val) => handleFilterToggle(val, 'severity')"
                ></single-params>
                <single-params
                  v-model="params.license"
                  :title="$t('graph.filter.license')"
                  :options="licenseViewList"
                  class="params-item"
                  :active-key="activeKey === 'license'"
                  @change="handleParamsChange"
                  @view-change="(val) => handleViewChange(val, 'license')"
                  @toggle="(val) => handleFilterToggle(val, 'license')"
                ></single-params>
                <single-params
                  v-model="params.provider"
                  :title="$t('graph.filter.source.title')"
                  :options="providerViewList"
                  class="params-item"
                  :active-key="activeKey === 'provider'"
                  @change="handleParamsChange"
                  @view-change="(val) => handleViewChange(val, 'prover')"
                  @toggle="(val) => handleFilterToggle(val, 'provider')"
                ></single-params>
              </div>
            </div>
          </div>
          <div>
            <graphG6
              ref="graph"
              :filer-view-by-mode="filerViewByMode"
              :source-data="sourceData"
              :filter-view-enable="filterViewEnable"
              @layoutEnd="handleLayoutEnd"
              @edgeClick="handleEdgeClick"
              @canvasClick="handleCanvasClick"
              @node-click="handleNodeClick"
            ></graphG6>
          </div>
          <div class="info-wrap" :class="{ 'unfold-info': !showDetailBox }">
            <icon-menu-fold
              v-show="!showDetailBox"
              @click.stop="handleInfoWrapToggle"
            />
            <!-- <icon-menu-unfold
              v-show="showDetailBox"
              @click.stop="handleInfoWrapToggle"
            /> -->
          </div>
          <div
            ref="infoBox"
            class="detail-info"
            :class="{ inactived: !showDetailBox && !isHovered }"
            @click="handleClickBox"
          >
            <div class="info-container">
              <summaryInfo
                v-if="!nodeView"
                :summary-info="typeViewList"
                :severity-data-info="vulnViewList"
              ></summaryInfo>
              <nodeInfoTable
                v-else
                :node-license="nodeLicense"
                :node-info="nodeInfo"
                :node-vuln-list="nodeVuln"
                :node-issue-list="nodeIssueList"
                :vuln-list="nodeVulnerabilities"
                :current-node-info="currentNodeInfo"
                @showChildGraph="handleShowChildGraph"
              ></nodeInfoTable>
            </div>
          </div>
        </div>
      </comCard>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { nextTick, onMounted, reactive, ref, watch, computed } from 'vue';
  import { onClickOutside, useElementHover } from '@vueuse/core';
  import { severityMaps } from '@/config/global';
  import parsePurl from '@/utils/packageURL';
  import {
    cloneDeep,
    find,
    get,
    hasIn,
    map,
    reduce,
    remove,
    keys,
    lowerFirst,
    isArray,
    assignIn,
    includes,
    some,
    each,
    concat,
    split,
    toLower,
    filter,
    last,
    pickBy,
    every,
  } from 'lodash';
  import { queryResourceTags } from '@/views/applications/api/applications';
  import paramsEditor from './components/params-editor.vue';
  import comCard from '../page-wrap/com-card.vue';
  import spinCard from '../page-wrap/spin-card.vue';
  import graphG6 from './components/graph-g6.vue';
  import summaryInfo from './components/summary-info.vue';
  import nodeInfoTable from './components/node-info.vue';
  import singleParams from './components/single-params.vue';
  import SLSwitch from './components/sl-switch.vue';
  import {
    queryConfig,
    severityList,
    issueList,
    graphResourceTypeMap,
    resourceTypeMap,
    resourceNodeInfo,
    packageNodeInfo,
    vulnNodeInfo,
    fileNodeInfo,
    getNodeSize,
    NodeType,
  } from './config';
  import { NodeItem, EdgeItem } from './config/interface';
  import { queryReSourceData } from './api/graph';
  import demoData from './data';

  interface Result {
    Nodes: NodeItem[];
    Edges: EdgeItem[];
  }
  interface Option {
    label: string;
    value: string;
    total?: any;
    copy?: boolean;
  }
  const nodeInfoConfig = {
    Resource: resourceNodeInfo,
    Package: packageNodeInfo,
    Vulnerability: vulnNodeInfo,
    File: fileNodeInfo,
  };
  const paramsTypeList = [
    { label: 'graph.filter.resourceType', value: [], key: 'type' },
    { label: 'graph.filter.vuln', value: [], key: 'severity' },
    { label: 'graph.filter.license', value: [], key: 'license' },
  ];
  const graph = ref();
  const infoBox = ref();
  const main = ref();
  const loading = ref(false);
  const showDetailBox = ref(true);
  const nodeView = ref(false);
  const isUnfold = ref(false);
  const activeKey = ref('');
  const filterEnable = ref(true);
  const filterMode = ref(true);
  const showTagsList = ref(false);
  const foldBtnActived = ref(false);
  const staticFold = ref(false);
  const currentNodeInfo: any = ref({});
  let sTimer: any = null;
  let viewTimer: any = null;
  let timer: any = null;
  let filterTimer: any = null;
  let queryStack: Array<{ value: string; label: string }> = [];
  let nodeDetail: any = {};
  const queryClickStack: Array<{ value: string; label: string }> = [];
  const tagsDataList = ref<Option[]>([]);
  const typeViewList = ref<Option[]>([]);
  const vulnViewList = ref<Option[]>([]);
  const nodeIssueList = ref<Option[]>([]);
  const licenseViewList = ref<Option[]>([]);
  const providerViewList = ref<Option[]>([]);
  const nodeInfo = ref<Option[]>([]);
  const nodeLicense = ref<Option[]>([]);
  const nodeVuln = ref<Option[]>([]);
  const nodeVulnerabilities = ref<any[]>([]);
  const completerData = reactive({
    vulnerability: '',
    package: '',
    license: '',
    resource: '',
    vulnerable: false,
    tags: [],
  });
  const searchQuery = reactive({
    query: '',
    // resource: '',
    // tags: [],
    // license: '',
    // vulnerable: false,
    // package: '',
    // withVulnerabilities: false,
    // depth: 20,
    // limit: 300,
  });
  const params = reactive({
    type: [],
    provider: [],
    severity: [],
    license: [],
  });
  const sourceData = reactive<Result>({
    Nodes: [],
    Edges: [],
  });
  const isHovered = useElementHover(infoBox);
  const filterViewEnable = computed(() => {
    const list = filter(keys(params), (key) => {
      return params[key].length;
    });
    return !!list.length;
  });
  const paramsList = computed(() => {
    let list = cloneDeep(paramsTypeList);
    list = map(list, (item) => {
      item.value = params[item.key];
      return item;
    }).filter((sItem) => !!sItem.value.length);
    return list;
  });
  onClickOutside(graph, (ev) => {
    showDetailBox.value = false;
  });
  onClickOutside(main, (ev) => {
    graph?.value?.clearAllStats();
  });

  const handleToggle = () => {
    isUnfold.value = !isUnfold.value;
  };
  const handleInfoWrapToggle = () => {
    showDetailBox.value = !showDetailBox.value;
  };
  const handleFilterToggle = (val, type) => {
    if (val) {
      activeKey.value = '';
    } else {
      activeKey.value = type;
    }
  };

  const handleFitView = () => {
    graph.value.fitView();
  };
  const getResourceTagsList = async () => {
    try {
      const { data } = await queryResourceTags();
      const list = map(data, (val) => {
        return {
          label: val,
          value: val,
        };
      });
      completerData.tags = [].concat(list as never[]);
    } catch (error) {
      completerData.tags = [];
    }
  };
  const initViewOptions = (list: NodeItem[] = []) => {
    typeViewList.value = [];
    vulnViewList.value = [];
    licenseViewList.value = [];
    providerViewList.value = [];
    const typeViewMap = new Map();
    const vulnViewMap = new Map();
    each(severityList, (item) => {
      vulnViewMap.set(item.value, {
        label: item.label,
        value: [],
      });
    });
    const licensesSet = new Set();
    const providerViewMap = new Map();
    let packageVulnerabilities: any[] = [];
    let packageLicense: any[] = [];
    each(list, (node) => {
      const type = get(node, 'labels.0');
      const reporProvider = get(node, 'properties.provider');
      const vulnList = get(node, 'properties.vulnerabilities') || [];
      const licenseList = get(node, 'properties.licenses') || [];
      const purl = get(node, 'properties.purl');
      const provider = parsePurl(purl)?.type || reporProvider || 'unknown';
      // get vuln data
      packageVulnerabilities = concat(packageVulnerabilities, vulnList);
      // get license data
      packageLicense = concat(packageLicense, licenseList);
      if (includes(graphResourceTypeMap.get('vuln'), type)) {
        packageVulnerabilities = concat(packageVulnerabilities, node);
      }
      // get resource type data
      if (!typeViewMap.get(type)) {
        typeViewMap.set(type, {
          label: type,
          value: [],
        });
        typeViewMap.get(type)?.value.push(type);
      } else {
        typeViewMap.get(type)?.value.push(type);
      }
      // get repo data
      if (!providerViewMap.get(provider)) {
        providerViewMap.set(provider, []);
        providerViewMap.get(provider).push(provider);
      } else {
        providerViewMap.get(provider).push(provider);
      }
    });
    // set typeViewList
    typeViewMap.forEach((value, key) => {
      const data = find(queryConfig, (s) => s.value === key);
      typeViewList.value.push({
        label: data?.label as string,
        value: key,
        total: get(value, 'value')?.length,
      });
    });
    // set severity data
    each(packageVulnerabilities, (item) => {
      const severity = get(item, 'cvss.baseSeverity');
      vulnViewMap.get(severity)?.value?.push(severity);
    });
    vulnViewList.value = map(severityList, (item) => {
      return {
        label: item.label,
        value: item.value,
        total: vulnViewMap.get(item.value)?.value.length,
      };
    }).filter((s) => s.total > 0);
    // set license
    each(packageLicense, (item) => {
      licensesSet.add(get(item, 'license.id'));
    });
    licenseViewList.value = map([...licensesSet], (val) => {
      return {
        label: val,
        value: val,
      } as Option;
    });
    // set provider
    providerViewMap.forEach((value, key) => {
      providerViewList.value.push({
        label: key,
        value: key,
        total: value?.length,
      });
    });
  };
  const getPackageVulnTotal = (vulnList: any[]) => {
    if (!vulnList.length) return {};
    const data = reduce(
      vulnList,
      (obj, item) => {
        const severity = toLower(get(item, 'cvss.baseSeverity'));
        if (!obj[severity]) {
          obj[severity] = 1;
        } else {
          obj[severity] += 1;
        }
        return obj;
      },
      {}
    );
    return data;
  };
  const resetParams = () => {
    params.license = [];
    params.provider = [];
    params.type = [];
    params.severity = [];
  };
  const fetchData = async () => {
    try {
      loading.value = true;
      resetParams();
      const query = pickBy(searchQuery, (val) => !!val);
      const { data } = await queryReSourceData(query);
      const t1 = window.performance.now();
      // const data = demoData;
      sourceData.Edges = get(data, 'Edges') || [];
      const list = get(data, 'Nodes') || [];
      sourceData.Nodes = list;
      // const clusterMap = new Map();
      // const nodesMap = new Map();
      // each(sourceData.Nodes, (node) => {
      //   nodesMap.set(node.id, get(node, 'labels.0'));
      // });
      // each(sourceData.Edges, (item) => {
      //   if (NodeType.isPackage(nodesMap.get(item.endNode))) {
      //     clusterMap.set(item.endNode, item.startNode);
      //   }
      // });
      each(sourceData.Nodes, (s) => {
        const properties = get(s, 'properties') || {};
        s.resourceType = get(s, 'labels.0');
        s.vulnTotal = get(properties, 'vulnerabilities')?.length || 0;
        s.name = '';
        if (NodeType.isResource(s.resourceType)) {
          s.label = get(properties, 'version')
            ? `${get(properties, 'name')}@${get(properties, 'version')}`
            : get(properties, 'name');
          s.name = s.label;
          s.sizeLevel = getNodeSize(get(properties, 'issueTotalCount') || 0);
          s.vulnSummary = {
            critical: 0,
            high: get(properties, 'issueHighCount') || 0,
            medium: get(properties, 'issueMediumCount') || 0,
            low: get(properties, 'issueLowCount') || 0,
            none: 0,
          };
        }
        // if (
        //   NodeType.isFile(s.resourceType) ||
        //   NodeType.isResource(s.resourceType)
        // ) {
        //   s.cluster = s.id;
        // }
        // if (NodeType.isPackage(s.resourceType)) {
        //   s.cluster = clusterMap.get(s.id);
        // }
        if (NodeType.isPackage(s.resourceType) && !s.vulnTotal) {
          s.sizeLevel = 0;
        }
        if (NodeType.isPackage(s.resourceType) && s.vulnTotal) {
          s.label = get(properties, 'version')
            ? `${get(properties, 'name')}@${get(properties, 'version')}`
            : get(properties, 'name');
          s.name = s.label;
          s.sizeLevel = getNodeSize(s.vulnTotal);
          s.vulnSummary = getPackageVulnTotal(
            get(properties, 'vulnerabilities') || []
          );
        }
        // return s;
      });
      const t2 = window.performance.now();
      initViewOptions(list);
      showDetailBox.value = true;
      nodeView.value = false;
      // loading.value = false;
      const t3 = window.performance.now();
      console.log('time:', t2 - t1, t3 - t1);
    } catch (error) {
      console.log(error);
      sourceData.Edges = [];
      sourceData.Nodes = [];
      showDetailBox.value = false;
      loading.value = false;
    }
  };
  const handleLayoutEnd = () => {
    loading.value = false;
  };
  const handleQueryInput = (val) => {
    console.log('query===', val);
    queryStack = [];
    fetchData();
  };
  const handleCancelRequest = () => {
    // todo
  };
  // resource type view switch control
  const typeViewFilterFn = (data: NodeItem) => {
    const typeParams = params.type || [];
    if (!typeParams.length) {
      return -1; // -1
    }
    return includes(typeParams, get(data, 'labels.0'));
  };
  // vulnerability severity view switch control
  const severityViewFilterFn = (data: NodeItem) => {
    // const isPackage = includes(
    //   graphResourceTypeMap.get('package'),
    //   get(data, 'labels.0')
    // );
    const PackageVulnerabilities =
      get(data, 'properties.vulnerabilities') || [];

    // const isResource = includes(
    //   graphResourceTypeMap.get('resource'),
    //   get(data, 'labels.0')
    // );
    const isFile = includes(
      graphResourceTypeMap.get('file'),
      get(data, 'labels.0')
    );
    // const isVulnerability = includes(
    //   graphResourceTypeMap.get('vuln'),
    //   get(data, 'labels.0')
    // );

    // if (!isPackage && !isVulnerability) return -1;
    const severityParams = params.severity || [];
    if (!severityParams.length) {
      return -1; // -1
    }
    // if (isVulnerability) {
    //   const severity = get(data, 'properties.cvss.baseSeverity');
    //   return includes(severityParams, severity);
    // }

    return some(PackageVulnerabilities, (vuln) => {
      return includes(severityParams, get(vuln, 'cvss.baseSeverity'));
    });
  };
  // license view switch control
  const licenseViewFilterFn = (data: NodeItem) => {
    const isPackage = includes(
      graphResourceTypeMap.get('package'),
      get(data, 'labels.0')
    );

    if (!isPackage) return false;
    const licenseParams = params.license;
    if (!licenseParams.length) {
      return -1; // -1
    }
    const packageLicense = get(data, 'properties.licenses') || [];

    return some(packageLicense, (license) => {
      return includes(licenseParams, get(license, 'license.id'));
    });
  };
  // resouce view switch control
  const providerViewFilterFn = (data: NodeItem) => {
    const isResource = includes(
      graphResourceTypeMap.get('package'),
      get(data, 'labels.0')
    );
    const kindParams = params.provider;
    if (!kindParams.length) {
      return -1; // -1
    }
    const repoProvider = get(data, 'properties.provider');
    const resourceKind =
      parsePurl(get(data, 'properties.purl'))?.type ||
      repoProvider ||
      'unknown';
    return includes(kindParams, resourceKind);
  };
  const filerViewByMode = (data: NodeItem) => {
    const typeFilerFlag = typeViewFilterFn(data);
    const severityFilterFlag = severityViewFilterFn(data);
    const licenseFilterFlag = licenseViewFilterFn(data);
    const providerFilterFlag = providerViewFilterFn(data);
    const resultList = [
      typeFilerFlag,
      severityFilterFlag,
      licenseFilterFlag,
      providerFilterFlag,
    ].filter((r) => r !== -1);
    if (!resultList.length) {
      return -1;
    }
    if (filterMode.value) {
      return every(resultList, (s) => s);
    }
    return some(resultList, (s) => s);
  };
  const handleViewChange = (val, type) => {
    clearTimeout(viewTimer);
    viewTimer = setTimeout(() => {
      graph.value?.updateGraphViewBySwitch(filerViewByMode, val);
    }, 100);
  };
  const handleCloseQuery = (item, val) => {
    const values = get(params, item.key) || [];
    remove(values, (v) => v === val);
    fetchData();
  };
  const handleEnableChange = () => {
    clearTimeout(filterTimer);
    filterTimer = setTimeout(() => {
      graph.value?.updateGraphViewBySwitch(filerViewByMode);
    }, 100);
  };
  const handleSearch = () => {
    if (!filterEnable.value) {
      return;
    }
    fetchData();
  };
  const handleTagsToggle = (val) => {
    showTagsList.value = !val;
  };
  const handleVulnerableChange = (val) => {
    handleSearch();
  };
  const handlewithVulnChange = (val) => {
    handleSearch();
  };
  const handleParamsChange = () => {
    clearTimeout(filterTimer);
    filterTimer = setTimeout(() => {
      graph.value?.updateGraphViewBySwitch(filerViewByMode);
    }, 100);
  };
  const handleClickBox = () => {
    showDetailBox.value = true;
  };
  const handleNodeClick = async (node) => {
    console.log('click===node');
    if (loading.value) return;
    // nodeView.value = true;
    showDetailBox.value = true;
    nodeDetail = node;
    currentNodeInfo.value = node;
    const nodeType = get(node, 'labels.0');
    const infoConfig = nodeInfoConfig[nodeType] || [];
    nodeVulnerabilities.value = get(node, 'properties.vulnerabilities') || [];
    nodeInfo.value = map(infoConfig, (item) => {
      const o = {
        ...cloneDeep(node),
        ...item,
      };
      o.value = get(node, item.key);
      o.label = item.label;
      const nodeId = get(node, 'id');
      if (nodeType === 'Vulnerability' && item.link) {
        const id = split(nodeId, '-').pop();
        o.link = `${item.link}&id=${id}`;
      } else if (item.link) {
        o.link = `${item.link}&id=${nodeId}`;
      }
      if (item.key === 'labels.0') {
        o.value = resourceTypeMap[nodeType];
      }
      if (o.label === 'CVSS' && (o.value === -1 || !o.value)) {
        o.value = 'N/A';
      }
      return o;
    });
    // node license
    nodeLicense.value = get(node, 'properties.licenses') || [];
    nodeLicense.value = map(nodeLicense.value, (item) => {
      return {
        label: get(item, 'license.id'),
        value: get(item, 'license.id'),
      };
    });
    // node issue
    if (NodeType.isResource(node.resourceType)) {
      nodeIssueList.value = map(issueList, (item) => {
        return {
          label: item.label,
          value: get(node, item.key),
          severity: item.severity,
        };
      }).filter((s) => s.value);
    } else {
      nodeIssueList.value = [];
    }
    // node vuln
    const vulnList = get(node, 'properties.vulnerabilities') || [];
    const severityData = getPackageVulnTotal(vulnList);
    nodeVuln.value = map(keys(severityData), (key) => {
      return {
        label: severityMaps[key],
        severity: key,
        value: severityData[key],
      };
    });
    nodeView.value = true;
  };
  const handleShowChildGraph = async () => {
    queryStack.push({
      value: searchQuery.query,
      label: 'click',
    });
    if (NodeType.isResource(nodeDetail?.resourceType)) {
      searchQuery.query = `resourceId:${nodeDetail?.id}`;
    }
    if (
      NodeType.isPackage(nodeDetail?.resourceType) ||
      NodeType.isFile(nodeDetail?.resourceType)
    ) {
      searchQuery.query = `packageId:${nodeDetail.id}`;
    }
    await fetchData();
    if (NodeType.isResource(nodeDetail?.resourceType)) {
      nodeView.value = false;
    } else {
      nodeView.value = true;
    }
  };
  const handleEdgeClick = () => {
    showDetailBox.value = false;
  };
  const handleUndoFetchData = () => {
    const query = last(queryStack);
    // initial state
    if (!query) return;
    queryStack.pop();
    searchQuery.query = query.value;
    fetchData();
  };
  const handleCanvasClick = (ev) => {
    console.log('click===canvas', ev);
    if (loading.value) return;
    showDetailBox.value = false;
  };
  watch(
    () => isUnfold.value,
    () => {
      if (isUnfold.value) {
        foldBtnActived.value = isUnfold.value;
        clearTimeout(sTimer);
        sTimer = setTimeout(() => {
          staticFold.value = isUnfold.value;
        }, 300);
      } else {
        clearTimeout(timer);
        timer = setTimeout(() => {
          foldBtnActived.value = isUnfold.value;
        }, 300);
        staticFold.value = isUnfold.value;
      }
    },
    {
      immediate: true,
    }
  );
  onMounted(() => {
    fetchData();
    getResourceTagsList();
  });
</script>

<style lang="less">
  .arco-trigger-content.arco-tooltip-content.graph-tooltip {
    // box-shadow: 0 0 2px 1px var(--seal-border-gray-2);
  }
</style>

<style lang="less" scoped>
  @infoWrapWidth: 270px;

  .graph-wrap {
    width: 100%;
    // height: 630px;
    color: var(--color-text-2);
    border-radius: 2px;
    // display: flex;
    .search-box {
      display: flex;
      justify-content: flex-end;
    }

    .main {
      height: inherit;

      .fold-btn {
        position: absolute;
        top: 0;
        left: 260px;
        display: flex;
        align-items: center;
        padding-left: 5px;
        color: var(--primary-6);
        font-size: 20px;
        cursor: pointer;
        transition: width 0.2s var(--seal-transition-func) 0.1s;

        .enable-btn {
          margin-left: 10px;
        }

        .enable-text {
          margin-left: 3px;
          font-weight: 500;
          font-size: 12px;
        }

        &.unfold {
          left: 5px;
          transition: width 0.2s var(--seal-transition-func) 0.1s;
        }

        &.toolbox {
          top: 40px;
          background: #fff;
          // display: flex;
          // flex-direction: column;
          .arco-icon {
            color: rgb(var(--primary-6));
          }
        }

        &.query {
          // padding-right: 5px;
          background-color: #fff;
          border-radius: 0 2px 2px 0;
        }

        .query-box {
          font-size: 12px;

          .type {
            margin-left: 10px;
            font-weight: 500;
          }

          .arco-tag {
            height: 16px;
            margin-bottom: 5px;
            margin-left: 5px;
            font-size: 12px;
            line-height: 16px;
          }
        }
      }
    }

    :deep(.arco-input-wrapper),
    .arco-select-view-single {
      background-color: #fff;
    }

    :deep(.arco-select-view-single) {
      background-color: #fff;
    }

    .search {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 260px;
      height: 100%;
      padding: 8px 0;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 0 2px 1px var(--seal-border-gray-2);
      transition: all 0.3s var(--seal-transition-func);

      &.unfold {
        width: 4px;
        overflow: hidden;
        transition: all 0.3s var(--seal-transition-func);
      }

      &.unfold.d-fold {
        background-color: rgb(var(--primary-6));
      }

      .search-wrap {
        position: relative;
        height: 100%;
        padding: 0 8px;
        overflow: auto;
      }

      .search-content {
        min-height: 100%;
        max-height: max-content;

        :deep(.arco-input-wrapper) {
          border: 1px solid var(--seal-border-gray-2);
          transition: all 0.2s var(--seal-transition-func);

          &:focus-within {
            border: 1px solid rgb(var(--primary-6));
            box-shadow: 0 0 0 0 var(--color-primary-light-2);
            transition: all 0.2s var(--seal-transition-func);
          }
        }

        .params-item {
          margin-top: 5px;
        }

        .group-title {
          display: flex;
          align-items: center;
          margin-bottom: 6px;
          font-weight: 500;
          font-size: 14px;

          .switch-box {
            margin-left: 5px;
          }

          &.view {
            margin-top: 15px;
          }
        }
      }
    }

    .main {
      position: relative;

      .info-wrap {
        position: absolute;
        top: 6px;
        right: 0;
        z-index: 100;
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.1s var(--seal-transition-func) 0.2s;

        &.unfold-info {
          color: var(--color-text-2);
          background-color: #fff;
          transition: all 0.1s var(--seal-transition-func) 0.2s;
        }
      }

      .detail-info {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: @infoWrapWidth;
        overflow: auto;
        background-color: #fff;
        // border: 1px solid var(--seal-border-gray-2);
        border-radius: 4px;
        box-shadow: 0 0 2px 1px var(--seal-border-gray-2);
        transition: all 0.3s var(--seal-transition-func);

        &.inactived {
          right: 0;
          width: 0;
          overflow: hidden;
          border-width: 0;
          box-shadow: none;
          transition: all 0.3s var(--seal-transition-func);
        }

        .info-container {
          width: @infoWrapWidth;
        }
      }
    }
  }
</style>
