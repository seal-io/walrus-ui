<template>
  <div class="box">
    <div>
      <FilterBox style="margin-bottom: var(--filter-box-margin)">
        <template #button-group
          ><a-button type="primary" @click="handleCreate">{{
            $t('account.settings.tokens.button')
          }}</a-button></template
        >
      </FilterBox>
      <a-list v-for="(item, index) in dataList" :key="index">
        <div>
          <a-list-item-meta>
            <template #title>
              <a-space fill>
                <div class="flex flex-align-center" style="line-height: 24px">
                  <span v-if="!item.accessToken">{{ item.name }}</span>
                  <span v-if="item.accessToken" class="token">{{
                    item.accessToken
                  }}</span>
                  <copy
                    v-if="item.accessToken"
                    :content="item.accessToken"
                  ></copy>
                </div>
                <a-link
                  type="text"
                  status="danger"
                  size="small"
                  @click="handleDelete(item)"
                >
                  <icon-delete class="size-18" style="stroke-width: 3" />
                </a-link>
              </a-space>
            </template>
            <template #description>
              <div>
                <div v-if="!item.accessToken" class="expire-wrap"
                  ><span>{{ $t('account.settings.token.expireDate') }}：</span
                  ><i class="date">{{ getExpireDate(item) }}</i>
                  <a-tag
                    v-if="getExpireStatus(item) === 2"
                    size="small"
                    class="tag"
                    :style="{
                      color: StatusColor.warning.text,
                      backgroundColor: StatusColor.warning.bg,
                      border: `1px solid ${StatusColor.warning.bg}`
                    }"
                    >{{ $t('account.settings.expireSoon') }}</a-tag
                  >
                  <a-tag
                    v-if="getExpireStatus(item) === 1"
                    size="small"
                    class="expired-soon tag"
                    :style="{
                      color: StatusColor.error.text,
                      backgroundColor: StatusColor.error.bg,
                      border: `1px solid ${StatusColor.error.bg}`
                    }"
                    >{{ $t('account.settings.expired') }}</a-tag
                  >
                </div>
                <span
                  v-if="item.accessToken"
                  class="copy-warn"
                  :style="{
                    color: StatusColor.error.text,
                    backgroundColor: StatusColor.error.bg,
                    border: `1px solid ${StatusColor.error.bg}`
                  }"
                  >{{ $t('account.settings.token.tips') }}</span
                >
              </div>
            </template>
          </a-list-item-meta>
        </div>
      </a-list>
      <div v-if="!dataList.length && isLoad" class="create-desc">
        <a-empty :description="$t('account.settings.token.desc')">
          <template #image>
            <i
              class="iconfont icon-shouquan size-20"
              style="font-size: 32px"
            ></i>
          </template>
        </a-empty>
      </div>
      <a-pagination
        style="padding: 10px 0"
        size="small"
        :total="total"
        :page-size="queryParams.perPage"
        :current="queryParams.page"
        show-total
        show-page-size
        :hide-on-single-page="total <= 10"
        @change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </div>
    <CreateTokens v-model:show="show" @tokenSave="handleSave"></CreateTokens>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { get } from 'lodash';
  import dayjs from 'dayjs';
  import { useI18n } from 'vue-i18n';
  import { StatusColor } from '@/views/config';
  import FilterBox from '@/components/filter-box/index.vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import copy from '@/components/copy/copy-command.vue';
  import CreateTokens from '../components/create-tokens.vue';
  import { queryTokens, deleteTokens, FormDataType } from '../api/tokens';

  const show = ref(false);
  const { t } = useI18n();
  const isLoad = ref(false);
  const total = ref(0);
  const dataList = ref<FormDataType[]>([]);
  const queryParams = {
    page: 1,
    perPage: 10
  };
  const handleCreate = () => {
    show.value = true;
  };
  const getExpireDate = (item) => {
    if (!get(item, 'expiration')) return t('account.settings.expire.never');
    return dayjs(item.expiration).format('YYYY-MM-DD');
  };
  const getExpireStatus = (item) => {
    if (!get(item, 'expiration')) return 0;
    const fiveDays = dayjs(item.expiration).subtract(5, 'day');
    // expired
    if (dayjs().isAfter(dayjs(item.expiration), 'day')) return 1;
    // expired soon
    if (dayjs().isBetween(dayjs(fiveDays), dayjs(item.expiration), 'day'))
      return 2;
    return -1;
  };
  const getTokenList = async () => {
    try {
      isLoad.value = false;
      const params = {
        ...queryParams
      };
      const { data } = await queryTokens(params);
      dataList.value = get(data, 'items') || [];
      total.value = data?.pagination?.total || 0;
      isLoad.value = true;
    } catch (error) {
      dataList.value = [];
      isLoad.value = true;
    }
  };
  const handlePageChange = (page: number) => {
    queryParams.page = page;
    getTokenList();
  };
  const handlePageSizeChange = (pageSize: number) => {
    queryParams.page = 1;
    queryParams.perPage = pageSize;
    getTokenList();
  };
  const handleSave = (data) => {
    if (data) {
      dataList.value.unshift(data);
    }
  };
  const handleDeleteConfirm = async (row) => {
    try {
      await deleteTokens(row.id);
      execSucceed();
      getTokenList();
    } catch (error) {
      // ignore
    }
  };

  const handleDelete = async (row) => {
    deleteModal({
      onOk: () => {
        handleDeleteConfirm(row);
      }
    });
  };
  getTokenList();
</script>

<style lang="less" scoped>
  .box {
    .create-desc {
      text-align: center;

      :deep(.arco-empty-description) {
        margin-top: 16px;
        font-size: var(--font-size-small);
      }
    }

    .expire-wrap {
      display: flex;
      align-items: center;
    }

    .tag {
      margin-left: 10px;
      border-radius: 4px;
    }

    .copy-warn {
      display: inline-block;
      padding: 12px 8px;
      border-radius: 4px;
    }

    .arco-list-wrapper {
      margin-bottom: 12px;
      overflow: hidden;
      border-radius: var(--border-radius-small);
      transition: all 0.3s var(--seal-transition-func);

      &:hover {
        background-color: var(--color-fill-1);
        transition: all 0.2s var(--seal-transition-func);

        :deep(.arco-list-bordered) {
          border-color: var(--color-fill-1);
        }
      }
    }

    :deep(.arco-list-item-meta) {
      padding: 12px;

      .arco-space {
        justify-content: space-between;
      }

      .arco-list-item-meta-content {
        width: 100%;
      }

      .arco-list-item-meta-description {
        color: var(--color-text-3);
        font-size: var(--font-size-small);

        .date {
          font-weight: 700;
        }
      }

      .arco-list-item-meta-title {
        width: 100%;
        color: var(--color-text-2);
        font-weight: 700;

        .token {
          display: inline-block;
          max-width: 300px;
          margin-right: 8px;
          overflow: hidden;
          color: var(--color-text-2);
          font-size: var(--font-size-small);
          white-space: nowrap;
          text-overflow: ellipsis;
          vertical-align: top;
        }
      }
    }

    :deep(.group-title) {
      .label {
        line-height: 2;
      }
    }
  }
</style>
