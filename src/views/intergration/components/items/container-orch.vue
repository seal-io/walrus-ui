<template>
  <div class="jira-item">
    <com-card
      v-if="['1', '7'].includes(paramsType) && itemList.length"
      padding="20px 0 0"
      :title="$t('intergration.containerOrchestration')"
    >
      <a-grid
        :cols="{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 10 }"
        :col-gap="20"
      >
        <a-grid-item
          v-for="item in itemList"
          :key="item.label"
          :span="{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 2 }"
        >
          <chain-item
            :available="item.available"
            :status="item.enable"
            :title="$t(item.label)"
            :src="item.img"
            @setting="handleSetting(item)"
          />
        </a-grid-item>
      </a-grid>
    </com-card>
  </div>
</template>

<script lang="ts" setup>
  import comCard from '@/components/page-wrap/com-card.vue';
  import { computed, ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import useLoading from '@/hooks/loading';
  import ChainItem from '../chain-item.vue';
  import { containerOrch } from '../../config';
  import { queryKubernetesList, kuberItem } from '../../api/kubernetes';

  const props = defineProps({
    searchText: {
      type: String,
      default() {
        return '';
      },
    },
    paramsType: {
      type: String,
      default() {
        return '';
      },
    },
  });
  const router = useRouter();
  const { loading, setLoading } = useLoading(true);
  const dataList = ref<kuberItem[]>([]);
  const itemList = computed(() => {
    const repoList = [...containerOrch];
    let list = repoList.filter(
      (item) =>
        item.type.includes(props.searchText.toLowerCase()) || !props.searchText
    );
    list = list.map((item) => {
      item = {
        ...item,
        enable: dataList.value.length > 0,
      };
      return item;
    });
    return list;
  });
  const getDataList = async () => {
    try {
      const { data } = await queryKubernetesList();
      dataList.value = data.items || [];
    } catch (error) {
      console.log(error);
      dataList.value = [];
    }
  };
  const handleSetting = (item) => {
    console.log(item);
    if (item.enable) {
      router.push({
        name: 'kubernetesList',
      });
    } else {
      router.push({
        name: 'orcheContainer',
        params: {
          repo: 'kubernetes',
        },
      });
    }
  };
  onMounted(() => {
    getDataList();
  });
</script>

<style></style>
