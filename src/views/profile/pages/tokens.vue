<template>
  <div class="box">
    <div>
      <FilterBox style="margin-bottom: 10px">
        <template #button-group
          ><a-button type="primary" @click="handleCreate">{{
            $t('account.settings.tokens.button')
          }}</a-button></template
        >
      </FilterBox>
      <a-list v-for="(item, index) in dataList" :key="index">
        <s-list-item>
          <a-list-item-meta>
            <template #title>
              <a-space fill>
                <div>
                  <span v-if="!item.accessToken">{{ item.name }}</span>
                  <span v-if="item.accessToken" class="token">{{
                    item.accessToken
                  }}</span>
                  <copy
                    v-if="item.accessToken"
                    :content="item.accessToken"
                  ></copy>
                </div>
                <a-button
                  type="outline"
                  status="danger"
                  size="mini"
                  @click="handleDelete(item)"
                  >{{ $t('common.button.delete') }}</a-button
                >
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
                    class="expired tag"
                    >{{ $t('account.settings.expireSoon') }}</a-tag
                  >
                  <a-tag
                    v-if="getExpireStatus(item) === 1"
                    size="small"
                    class="expired-soon tag"
                    >{{ $t('account.settings.expired') }}</a-tag
                  >
                </div>
                <span v-if="item.accessToken" class="copy-warn">{{
                  $t('account.settings.token.tips')
                }}</span>
              </div>
            </template>
          </a-list-item-meta>
        </s-list-item>
      </a-list>
      <div v-if="!dataList.length && isLoad" class="create-desc">{{
        $t('account.settings.token.desc')
      }}</div>
    </div>
    <CreateTokens v-model:show="show" @tokenSave="handleSave"></CreateTokens>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { get } from 'lodash';
  import dayjs from 'dayjs';
  import { useI18n } from 'vue-i18n';
  import FilterBox from '@/components/filter-box/index.vue';
  import copy from '@/components/copy/index.vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import CreateTokens from '../components/create-tokens.vue';
  import { queryTokens, deleteTokens, FormDataType } from '../api/tokens';

  const show = ref(false);
  const { t } = useI18n();
  const isLoad = ref(false);
  const dataList = ref<FormDataType[]>([]);
  const query = {
    page: 1,
    perPage: 100
  };
  const handleCreate = () => {
    show.value = true;
  };
  const getExpireDate = (item) => {
    if (!get(item, 'expiration')) return t('account.settings.expire.never');
    return dayjs(item.createTime)
      .add(item.expiration, 'second')
      .format('YYYY-MM-DD');
  };
  const getExpireStatus = (item) => {
    if (!get(item, 'expiration')) return 0;
    const expireTime = dayjs(item.createTime).add(item.expiration, 'second');
    const fiveDays = dayjs(item.createTime)
      .add(item.expiration, 'second')
      .subtract(5, 'days');
    // expired
    if (dayjs().isAfter(dayjs(expireTime), 'second')) return 1;
    // expired soon
    if (dayjs().isBetween(dayjs(fiveDays), dayjs(expireTime), 'second'))
      return 2;
    return -1;
  };
  const getTokenList = async () => {
    try {
      isLoad.value = false;
      const params = {
        ...query
      };
      const { data } = await queryTokens(params);
      dataList.value = get(data, 'items') || [];
      isLoad.value = true;
    } catch (error) {
      console.log(error);
      dataList.value = [];
      isLoad.value = true;
    }
  };
  const handleSave = (data) => {
    if (data) {
      dataList.value.unshift(data);
    }
  };
  const handleDelete = async (item) => {
    await deleteTokens(item.id);
    getTokenList();
  };
  getTokenList();
</script>

<style lang="less" scoped>
  .box {
    :deep(.arco-icon-copy) {
      font-size: 16px;
    }

    .create-desc {
      text-align: center;
    }

    .expire-wrap {
      display: flex;
      align-items: center;
    }

    .tag {
      margin-left: 10px;
      color: rgb(255, 125, 0);
      background-color: rgba(255, 125, 0, 0.1);
      border: 1px solid rgb(255, 125, 0);

      &.expired-soon {
        color: rgb(245, 63, 63);
        background-color: rgba(245, 63, 63, 0.1);
        border: 1px solid rgb(245, 63, 63);
      }
    }

    .copy-warn {
      display: inline-block;
      padding: 12px 8px;
      color: #f76560;
      background-color: #ffece8;
      border: 1px solid #fdcdc5;
      border-radius: 2px;
    }

    .arco-list-wrapper {
      margin-bottom: 12px;
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
        font-size: 12px;

        .date {
          font-weight: 500;
        }
      }

      .arco-list-item-meta-title {
        width: 100%;
        color: var(--sealblue-6);

        .token {
          display: inline-block;
          max-width: 300px;
          margin-right: 8px;
          overflow: hidden;
          color: var(--color-text-2);
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
