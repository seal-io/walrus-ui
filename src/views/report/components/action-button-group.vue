<template>
  <a-dropdown size="small" class="action-drop-down">
    <a-button size="mini" style="width: 80px; color: #206ccf">
      <span>{{ $t('report.detail.ignore.action') }}</span>
      <icon-down style="margin-left: 10px" />
    </a-button>
    <template #content>
      <a-doption
        v-if="!get(issuesData, 'dismissInfo.dismissed')"
        style="padding: 0; line-height: 30px"
        @click="handleCreateJiraTicket"
      >
        <a-button type="text" size="mini" status="normal"
          ><providerIcon provider="jira"></providerIcon
          ><span style="margin-left: 5px">{{
            $t('projects.button.jira')
          }}</span></a-button
        >
      </a-doption>
      <a-doption
        v-if="!get(issuesData, 'dismissInfo.dismissed')"
        style="padding: 0; line-height: 30px"
        @click="handleCreateAction"
      >
        <a-button type="text" size="mini" status="normal"
          ><icon-eye-invisible style="font-size: 16px" /><span
            style="margin-left: 5px"
            >{{ $t('report.detail.ignore.button') }}</span
          ></a-button
        >
      </a-doption>
      <a-doption
        v-if="get(issuesData, 'dismissInfo.dismissed')"
        style="padding: 0; line-height: 30px"
        @click="handleEditAction"
      >
        <a-button type="text" size="mini" status="normal"
          ><icon-edit style="font-size: 16px" /><span
            style="margin-left: 5px"
            >{{ $t('report.detail.ignore.edit') }}</span
          ></a-button
        >
      </a-doption>
      <a-doption
        v-if="get(issuesData, 'dismissInfo.dismissed')"
        style="padding: 0; line-height: 30px"
        @click="handleResetAction"
      >
        <a-button type="text" size="mini" status="normal"
          ><icon-eye style="font-size: 16px" /><span style="margin-left: 5px">{{
            $t('report.detail.ignore.reset')
          }}</span></a-button
        >
      </a-doption>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { get } from 'lodash';
  import providerIcon from '@/components/provider-icon/index.vue';
  import { issuesItem } from '../api/report';

  const props = defineProps({
    issuesData: {
      type: Object,
      default() {
        return {};
      },
    },
  });
  const emits = defineEmits(['create', 'update', 'reset', 'createJira']);
  const handleEditAction = () => {
    emits('update');
  };
  const handleCreateAction = () => {
    emits('create');
  };
  const handleResetAction = () => {
    emits('reset');
  };
  const handleCreateJiraTicket = () => {
    emits('createJira');
  };
</script>

<style></style>
