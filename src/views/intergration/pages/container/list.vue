<template>
  <div class="kuber-list-wrap">
    <TableList
      api="container-registries"
      :columns="columns"
      :title="title"
      :adds="adds"
      :query="query"
      @create="handleAdd"
      @edit="handleEdit"
    ></TableList>
  </div>
</template>

<script lang="ts" setup>
  import { join, capitalize } from 'lodash';
  import dayjs from 'dayjs';
  import { computed, h } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { Button } from '@arco-design/web-vue';
  import TableList from '../../components/table-list.vue';

  const { t, router, route } = useCallCommon();
  const repo = route.params.repo as string;
  const query = {
    provider: repo,
  };
  const handleEdit = (row: any) => {
    router.push({
      name: 'standarContainer',
      params: {
        repo,
      },
      query: {
        id: row.id as string,
      },
    });
  };
  const adds = computed(() => {
    const repoText =
      repo === 'oci'
        ? t('intergration.containerrepo.standar')
        : capitalize(repo);
    return t('intergration.containerrepo.list.adds', { repo: repoText });
  });
  const title = computed(() => {
    const repoText =
      repo === 'oci'
        ? t('intergration.containerrepo.standar')
        : capitalize(repo);
    return `${t('intergration.containerrepo.title', { repo: repoText })}`;
  });

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
        dataIndex: 'url',
        title: t('intergration.containerrepo.form.address'),
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
      name: 'standarContainer',
      params: {
        repo,
      },
    });
  };
</script>

<style></style>
