<template>
  <div class="kuber-list-wrap">
    <TableList
      api="kubernetes"
      :columns="columns"
      :title="$t('intergration.containerOrchestration')"
      :adds="$t('intergration.containerrepo.form.cluster')"
      @create="handleAdd"
      @edit="handleEdit"
    ></TableList>
  </div>
</template>

<script lang="ts" setup>
  import { join } from 'lodash';
  import dayjs from 'dayjs';
  import { computed, h } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { Button } from '@arco-design/web-vue';
  import TableList from '../../components/table-list.vue';

  const { t, router } = useCallCommon();
  const handleEdit = (row: any) => {
    router.push({
      name: 'orcheContainer',
      params: {
        repo: 'kubernetes',
      },
      query: {
        id: row.id as string,
      },
    });
  };
  const columns = computed(() => {
    return [
      { dataIndex: 'name', title: t('intergration.repoPolicy.name') },
      {
        dataIndex: 'updateTime',
        title: t('common.table.updateTime'),
        render: ({ record }) => {
          return h(
            'span',
            {},
            dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss')
          );
        },
      },
      {
        dataIndex: 'excludedNamespaces',
        title: t('intergration.containerrepo.form.excludes'),
        render: ({ record }) => {
          return h('span', {}, join(record.excludedNamespaces, ','));
        },
      },
      {
        dataIndex: '',
        width: 180,
        align: 'center',
        title: t('common.table.operation'),
        render: ({ record }) => {
          return h(
            Button,
            {
              type: 'text',
              onClick: () => handleEdit(record),
            },
            t('common.button.edit')
          );
        },
      },
    ];
  });
  const handleAdd = () => {
    router.push({
      name: 'orcheContainer',
      params: {
        repo: 'kubernetes',
      },
    });
  };
</script>

<style></style>
