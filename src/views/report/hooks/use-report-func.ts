import { ref, computed, reactive } from 'vue';
import dayjs from 'dayjs';
import { cloneDeep, find, get } from 'lodash';
import { getValueOnConfigs } from '@/utils/validate';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useLocaleKey } from '@/utils/func';
import MarkdownIt from 'markdown-it';
import {
  policyDataConfig,
  ignoreInfoConfig,
  ignoreReasonList,
} from '../configs';

export default function useReportFunc(props) {
  const { t } = useI18n();
  const router = useRouter();
  const { localeKey } = useLocaleKey();
  const expandTrigger = ref();
  const resourceInfo: any = reactive({});
  const handleToggleExpand = () => {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    expandTrigger.value.dispatchEvent(event);
  };
  const policyData = computed(() => {
    const data = props.issuesData?.policy || {};
    const list = policyDataConfig.map((o) => {
      const item = cloneDeep(o);
      if (item.key === 'action') {
        item.value = getValueOnConfigs(data[item.key], []);
      } else if (item.key === 'type') {
        // item.value = getValueOnConfigs(data[item.key], props.typeList);
        const localeText = get(props.typeList, `${data.category}${data.type}`);
        item.value = localeKey(localeText) ? t(localeText) : data.type;
      } else {
        item.value = data[item.key];
      }
      return item;
    });
    return list;
  });
  // match resource url
  const getResourceInfo = () => {
    const data = find(props.resourceList, (item) => {
      return item.id === props.issuesData.resourceId;
    });
    Object.assign(resourceInfo, data);
    console.log('resource===', resourceInfo);
    return data;
  };
  const vulnerabilityInfo = computed(() => {
    const sast = get(props.issuesData, 'sast');
    const codeLink = sast
      ? `${sast.repositoryURL}/blob/${sast.commit}/${sast.file}#L${sast.startLine}-L${sast.endLine}`
      : '';
    return {
      message:
        get(props.issuesData, 'summary') ||
        get(props.issuesData, 'message') ||
        '',
      // link: '',
      fileLink: codeLink,
      link: get(props.issuesData, 'references.0'),
      resource: getResourceInfo(),
      description: get(props.issuesData, 'message') || '',
    };
  });
  const handleViewResourceDetail = (id) => {
    router.push({
      name: 'projectSBom',
      query: {
        id,
        versionId: 'latest',
      },
    });
  };
  // ignore detail info
  const ignoreDetailInfo = computed(() => {
    const data = props?.issuesData || {};
    const list = ignoreInfoConfig.map((o) => {
      const item = cloneDeep(o);
      if (item?.type === 'date') {
        item.value =
          dayjs(get(data, `${item.key}`)).get('year') === 1
            ? t('report.detail.ignore.permanent')
            : dayjs(get(data, `${item.key}`)).format('YYYY-MM-DD HH:mm:ss');
      } else if (item?.type === 'lookup') {
        const reason =
          find(ignoreReasonList, (s) => s.value === get(data, `${item.key}`)) ||
          {};
        item.value = t(get(reason, 'label') || '');
      } else {
        item.value = get(data, `${item.key}`);
      }
      return item;
    });
    return list;
  });
  getResourceInfo();
  return {
    expandTrigger,
    handleToggleExpand,
    policyData,
    vulnerabilityInfo,
    ignoreDetailInfo,
    handleViewResourceDetail,
    resourceInfo,
  };
}
export function useMd2Html() {
  const md = new MarkdownIt();
  const mdParse = (str) => {
    return md.render(str);
  };
  return {
    mdParse,
  };
}
