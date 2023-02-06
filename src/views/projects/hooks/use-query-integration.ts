import { getSoureceRepoList } from '@/views/intergration/api/repo-config';
import { integrationRepoMap } from '@/views/intergration/config';
import { queryKubernetesList } from '@/views/intergration/api/kubernetes';
import { getRegistriesList } from '@/views/intergration/api/registry';
import _, { get } from 'lodash';
import { PopupItem } from '../config/interface';

export async function useQueryIntegration() {
  // repository
  const querySourceRepoList = async () => {
    try {
      const { data } = await getSoureceRepoList();
      let list = data.items || ([] as PopupItem[]);
      list = list.map((item) => {
        const provider = get(integrationRepoMap, item.provider)
          ? integrationRepoMap[item.provider]
          : item.provider;
        return {
          ...item,
          text: provider,
          title: provider,
          page: 'importRepo',
        };
      });
      return list;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  // kubernetes
  const getKubernetesList = async () => {
    try {
      const { data } = await queryKubernetesList();
      const k8s = _.get(data, 'items.0') || null;
      const list = k8s
        ? [
            {
              ...k8s,
              page: 'kuberResource',
              provider: 'kubernetes',
              title: 'Kubernetes',
              text: 'K8S',
            },
          ]
        : [];
      return list;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  // container images
  const queryRegistriesList = async () => {
    try {
      const { data } = await getRegistriesList();
      console.log('data>>>>', data);
      let containerData = _.get(data, 'items') || [];
      // one provider can config muiltple data
      containerData = _.uniqBy(containerData, 'provider');

      const list = containerData.map((rItem) => {
        const item = {
          ...rItem,
          page: '',
          langFormat: rItem.provider === 'oci',
          text:
            rItem.provider === 'oci'
              ? 'intergration.containerRepo.images'
              : _.capitalize(rItem.provider),
          title:
            rItem.provider === 'oci' ? 'OCI' : _.capitalize(rItem.provider),
        };
        return item;
      });
      return list;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const resultList = await Promise.all([
    querySourceRepoList(),
    getKubernetesList(),
    queryRegistriesList(),
  ]);
  return resultList;
}

export default {};
