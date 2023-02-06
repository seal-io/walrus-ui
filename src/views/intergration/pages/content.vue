<template>
  <div class="container">
    <div class="input-wrap">
      <a-row style="marginbottom: 20px; backgroundcolor: #fff">
        <a-col :span="12">
          <a-input
            style="width: 300px"
            :value="searchText"
            allow-clear
            :placeholder="$t('intergration.input.holder')"
            @clear="handleClear"
            @input="handleFilter"
            @change="handleFilter"
          >
            <template #prefix>
              <icon-search />
            </template>
          </a-input>
        </a-col>
      </a-row>
    </div>
    <a-space direction="vertical" fill>
      <!-- sourceRepo -->
      <com-card
        v-if="['1', '2'].includes(paramsType) && sourceRepoList.length"
        padding="20px 0 0"
        :title="$t('intergration.sourceRepo')"
      >
        <a-grid
          :cols="{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 10 }"
          :col-gap="20"
        >
          <a-grid-item
            v-for="item in sourceRepoList"
            :key="item.label"
            :span="{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 2 }"
          >
            <chain-item
              :available="item.available"
              :title="item.label"
              :src="item.img"
              :status="item.enable"
              @setting="handleToSetting(item)"
            />
          </a-grid-item>
        </a-grid>
      </com-card>

      <ContainerRepo
        :search-text="searchText"
        :params-type="paramsType"
      ></ContainerRepo>
      <ContainerOrch
        :search-text="searchText"
        :params-type="paramsType"
      ></ContainerOrch>

      <!-- proxy -->
      <com-card
        v-if="['1', '3'].includes(paramsType) && proxyList.length"
        padding="20px 0 0"
        :title="$t('intergration.proxy')"
      >
        <a-space direction="vertical" :size="40" fill>
          <a-grid
            :cols="{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 10 }"
            :col-gap="20"
          >
            <a-grid-item
              v-for="item in proxyList"
              :key="item.label"
              :span="{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 2 }"
            >
              <chain-item
                :available="item.available"
                :show-setting="true"
                :status="item.enable"
                :title="item.label"
                :src="item.img"
                @viewList="handleViewList(item)"
                @setting="handlePolicyConfig(item)"
              />
            </a-grid-item>
          </a-grid>
          <!-- <a-grid
            :cols="{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 10 }"
            :col-gap="20"
          >
            <a-grid-item
              v-for="item in proxyListR"
              :key="item.label"
              :span="{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 2 }"
            >
              <chain-item
                :show-setting="true"
                :status="item.enable"
                :title="item.label"
                :src="item.img"
                @viewList="handleViewList(item)"
                @setting="handlePolicyConfig(item)"
              />
            </a-grid-item>
          </a-grid> -->
        </a-space>
      </com-card>

      <!-- project management -->
      <JiraConfig
        :search-text="searchText"
        :params-type="paramsType"
      ></JiraConfig>

      <!-- push service -->
      <com-card
        v-if="['1', '4'].includes(paramsType) && pushServiceList.length"
        padding="20px 0 0"
        :title="$t('intergration.pushService')"
      >
        <a-grid
          :cols="{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 10 }"
          :col-gap="20"
        >
          <a-grid-item
            v-for="item in pushServiceList"
            :key="item.label"
            :span="{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 2 }"
          >
            <chain-item
              :available="item.available"
              :show-setting="true"
              :status="item.enable"
              :title="$t(item.label)"
              :src="item.img"
              @viewList="handleViewServiceList(item)"
              @setting="handlePushServiceConfig(item)"
            />
          </a-grid-item>
        </a-grid>
      </com-card>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import comCard from '@/components/page-wrap/com-card.vue';
  import { useRoute, useRouter } from 'vue-router';
  import { computed, reactive, watch, ref, onMounted } from 'vue';
  import useLoading from '@/hooks/loading';
  import imagesData, { imgItem } from '../config';
  import ChainItem from '../components/chain-item.vue';
  import { getSoureceRepoList } from '../api/repo-config';
  import { queryPolicyList } from '../api/policy-list';
  import { pushServerList, serverItems } from '../api/webhook';
  import JiraConfig from '../components/items/jira-config.vue';
  import ContainerRepo from '../components/items/container-repo.vue';
  import ContainerOrch from '../components/items/container-orch.vue';

  const paramsType: any = ref('');
  // const sourceLoading: boolean = ref(false);
  // const proxyLoading: boolean = ref(false);
  const searchText = ref<string>('');
  const imgData = reactive({ ...imagesData });
  const route = useRoute();
  const router = useRouter();
  const sourceResList = ref<{ id: string; provider: string }[]>([]);
  const proxyResList = ref<{ id: string; type: string }[]>([]);
  const pushServerResList = ref<serverItems[]>([]);
  const { loading, setLoading } = useLoading(true);

  watch(
    () => route.params,
    (val) => {
      paramsType.value = val.query || '1';
      console.log('params:', paramsType.value);
    },
    {
      immediate: true,
    }
  );
  const fetchRepoList = async () => {
    try {
      const { data } = await getSoureceRepoList();
      sourceResList.value = data.items || [];
    } catch (error) {
      console.log(error);
      sourceResList.value = [];
    }
  };
  // pushserver list
  const fetchPushServerList = async () => {
    try {
      const { data } = await pushServerList();
      pushServerResList.value = data.items || [];
    } catch (error) {
      console.log(error);
      pushServerResList.value = [];
    }
  };
  const fetchProxyList = async () => {
    try {
      const { data } = await queryPolicyList();
      proxyResList.value = data.items || [];
    } catch (error) {
      console.log(error);
      proxyResList.value = [];
    }
  };
  const fetchData = async () => {
    Promise.all([fetchRepoList(), fetchProxyList(), fetchPushServerList()]);
  };
  // source list
  const sourceRepoList = computed(() => {
    const repoList = [...imgData.sourceRepoList];
    let list = repoList.filter(
      (item) =>
        item.type.includes(searchText.value.toLowerCase()) || !searchText.value
    );
    list = list.map((item) => {
      const data = sourceResList.value.find(
        (o) => o.provider === item.provider
      );
      item = {
        ...item,
        enable: !!data,
        ...data,
      };
      return item;
    });
    return list;
  });

  // proxy list
  const proxyList = computed(() => {
    const imgDataProxyList = [...imgData.proxyList, ...imgData.proxyListR];
    let list = imgDataProxyList.filter(
      (item) =>
        item.type.includes(searchText.value.toLowerCase()) || !searchText.value
    );
    list = list.map((item) => {
      const data = proxyResList.value.find((o) => o.type === item.type);
      item = {
        ...item,
        enable: !!data,
        ...data,
      };
      return item;
    });
    return list;
  });

  const proxyListR = computed(() => {
    const imgDataProxyList = [...imgData.proxyListR];
    let list = imgDataProxyList.filter(
      (item) =>
        item.type.includes(searchText.value.toLowerCase()) || !searchText.value
    );
    list = list.map((item) => {
      const data = proxyResList.value.find((o) => o.type === item.type);
      item = {
        ...item,
        enable: !!data,
        ...data,
      };
      return item;
    });
    return list;
  });

  const pushServiceList = computed(() => {
    let list = imgData.pushServiceList.filter(
      (item) =>
        item.type.includes(searchText.value.toLowerCase()) || !searchText.value
    );
    list = list.map((item) => {
      const data = pushServerResList.value.find((o) => {
        return item.field && o[item.field];
      });
      item = {
        ...item,
        enable: !!data,
        ...data,
      };
      return item;
    });
    return list;
  });
  let timer: any = null;
  const handleFilter = (val: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      searchText.value = val as string;
    }, 100);
  };
  const handleClear = () => {
    searchText.value = '';
  };
  const handleToSetting = (item: imgItem) => {
    router.push({
      name: 'repoConfig',
      params: {
        repo: item.type,
      },
      query: {
        // tokenurl: item.tokenUrl,
        id: item.id,
      },
    });
  };

  const handlePolicyConfig = (item: imgItem) => {
    router.push({
      name: 'proxyConfig',
      params: {
        repo: item.type,
      },
      query: {
        id: item.id,
      },
    });
  };
  const handlePushServiceConfig = (item: imgItem) => {
    if (!item.name) return;
    router.push({
      name: item.name,
      query: {
        id: item.id,
      },
    });
  };
  const handleViewServiceList = (item: imgItem) => {
    router.push({
      name: 'notifiersList',
      params: {
        type: item.field,
      },
    });
  };
  const handleViewList = (item: imgItem) => {
    router.push({
      name: 'repoPolicy',
      params: {
        repo: item.type,
      },
      query: {
        type: item.type,
      },
    });
  };
  onMounted(() => {
    fetchData();
  });
</script>

<style lang="less" scoped>
  .container {
    :deep(.arco-card-header) {
      padding-left: 0;
    }

    :deep(.arco-card-body) {
      padding-left: 0;
    }

    .input-wrap {
      margin-bottom: 12px;
    }

    .arco-input-wrapper {
      background: #fff;
    }
  }

  :deep(.arco-card) {
    background-color: var(--color-fill-2);
  }

  :deep(.arco-grid-item) {
    margin-bottom: 20px;
    text-align: center;
    cursor: pointer;

    &:hover {
      .arco-image {
        background-color: var(--color-fill-2);
      }
    }
  }
</style>
