<template>
  <div class="container">
    <a-space direction="vertical" fill :size="0">
      <div class="title-wrap">
        <div class="title"
          >{{ title }}
          <a-tag
            v-if="formData.id"
            color="#00B42A"
            size="small"
            style="margin-left: 8px"
            >{{ $t('intergration.configured') }}</a-tag
          >
          <a-tag
            v-if="!formData.id"
            color="#ff7d00"
            size="small"
            style="margin-left: 8px"
            >{{ $t('intergration.unconfigured') }}</a-tag
          ></div
        >
      </div>
      <a-card class="general-card q-s-w-card">
        <div class="re-config">
          <div class="label">{{
            $t('intergration.repo.app', { repo: repo })
          }}</div>
          <a-button
            v-show="id"
            type="primary"
            size="small"
            @click="handleClickReConfig"
            >{{ $t('intergration.createApp.reconfig', { repo }) }}</a-button
          >
        </div>

        <a-form ref="formref" :model="formData" layout="vertical">
          <a-row v-if="!id || reConfigActive" :gutter="30">
            <a-col :span="12">
              <a-space direction="vertical" :size="0" fill>
                <a-form-item :hide-label="true">
                  <a-checkbox
                    v-model="formData.isPrivate"
                    @change="handlePrivateChange"
                  >
                    <span style="color: #4e5969; font-size: 14px">{{
                      $t('intergration.createApp.gitlab.private', {
                        repo: capitalize(repo),
                      })
                    }}</span>
                  </a-checkbox>
                </a-form-item>
                <div v-if="formData.isPrivate">
                  <a-form-item :label="$t('intergration.jira.form.authrize')">
                    <a-radio-group v-model="formData.type">
                      <a-radio
                        v-for="(item, index) in authorizeTypeList"
                        :key="index"
                        :value="item.value"
                        >{{ item.label }}
                        <a-tooltip :content="$t(item.desc)">
                          <icon-question-circle-fill />
                        </a-tooltip>
                      </a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item
                    :label="$t('intergration.jiraurl.url')"
                    :hide-label="false"
                    :hide-asterisk="true"
                    field="url"
                    :validate-trigger="['change']"
                    :rules="[
                      {
                        required: true,
                        message: $t('intergration.jira.rules.url'),
                      },
                      {
                        match: urlReg,
                        message: $t('system.rules.url'),
                      },
                    ]"
                  >
                    <a-input
                      v-model="formData.url"
                      @blur="handleUrlBlur"
                    ></a-input>
                  </a-form-item>
                  <a-form-item
                    v-if="formData.type === 'private_access_token'"
                    label="Access Token"
                    :hide-label="false"
                    :hide-asterisk="true"
                    field="accessToken"
                    :validate-trigger="['change']"
                    :rules="[
                      {
                        required: true,
                        message: $t('intergration.jira.rules.token'),
                      },
                    ]"
                  >
                    <a-input v-model="formData.accessToken"></a-input>
                  </a-form-item>
                </div>
                <!-- oauth2.0 authorize type -->
                <div
                  v-if="
                    !formData.isPrivate || formData.type === 'private_oauth2'
                  "
                >
                  <a-form-item
                    label="Client ID"
                    :hide-label="false"
                    :hide-asterisk="true"
                    field="clientID"
                    :validate-trigger="['change']"
                    :rules="[
                      {
                        required: true,
                        message: $t('intergration.rules.clientId'),
                      },
                    ]"
                  >
                    <a-input
                      v-model="formData.clientID"
                      :placeholder="$t('common.input.holder')"
                    ></a-input>
                  </a-form-item>
                  <a-form-item
                    label="Client Secret"
                    :hide-label="false"
                    :hide-asterisk="true"
                    field="clientSecret"
                    :validate-trigger="['change']"
                    :rules="[
                      {
                        required: true,
                        message: $t('intergration.rules.clientSecret'),
                      },
                    ]"
                  >
                    <a-input-password
                      v-model="formData.clientSecret"
                      :placeholder="$t('common.input.holder')"
                    ></a-input-password>
                  </a-form-item>
                </div>
              </a-space>
            </a-col>
            <a-col :span="12">
              <a-tabs
                :active-key="jiraType"
                default-active-key="2"
                @change="handleJiraTypeChange"
              >
                <a-tab-pane
                  key="1"
                  :title="$t('intergration.jira.cloud.title')"
                >
                  <jira-steps
                    :repo="repo"
                    :callback-url="redirectUrl"
                    :source-info="repoTypeInfo"
                  ></jira-steps>
                </a-tab-pane>
                <a-tab-pane
                  key="2"
                  :title="$t('intergration.jira.private.title')"
                >
                  <jiraPrivateSteps
                    :repo="repo"
                    :type="formData.type"
                    :is-private="formData.isPrivate"
                    :private-url="formData.url"
                    :callback-url="redirectUrl"
                    :source-info="repoTypeInfo"
                  ></jiraPrivateSteps>
                </a-tab-pane>
              </a-tabs>
            </a-col>
          </a-row>
          <a-row v-if="id && !reConfigActive">
            <a-col :span="12">
              <a-form-item
                v-if="!formData.isPrivate"
                :label="$t('intergration.createApp.jiraurl')"
                :hide-label="false"
                :hide-asterisk="true"
                field="url"
                :validate-trigger="['change']"
                :rules="[
                  {
                    required: true,
                    message: $t('intergration.rules.jiraurl'),
                  },
                ]"
              >
                <a-select
                  v-model="formData.url"
                  :loading="spaceLoading"
                  @change="handleResourceChange"
                >
                  <template #empty><span></span></template>
                  <a-option
                    v-for="(item, index) in resourceList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </a-option>
                </a-select>
              </a-form-item>
              <a-form-item
                v-if="formData.isPrivate"
                :disabled="!reConfigActive"
                :label="$t('intergration.jiraurl.url')"
                :hide-label="false"
                :hide-asterisk="true"
                field="url"
                :validate-trigger="['change']"
                :rules="[
                  {
                    required: true,
                    message: $t('intergration.rules.jiraurl'),
                  },
                  {
                    match: urlReg,
                    message: $t('system.rules.url'),
                  },
                ]"
              >
                <a-input v-model="formData.url"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <EditPageFooter>
                <template #save>
                  <a-button
                    v-if="showConnectBtn"
                    :loading="submitLoading"
                    type="primary"
                    class="cap-title save-btn"
                    @click="handleSubmit"
                    >{{
                      $t('intergration.button.connect', { repo: repo })
                    }}</a-button
                  >
                  <a-button
                    v-if="showSaveBtn"
                    :loading="submitLoading"
                    type="primary"
                    class="cap-title save-btn"
                    @click="handleUpdateSpace"
                    >{{ $t('common.button.save') }}</a-button
                  >
                </template>
                <template #cancel>
                  <a-button
                    v-if="formData.isPrivate && id && !reConfigActive"
                    type="primary"
                    class="cap-title save-btn"
                    @click="handleCancel"
                    >{{ $t('common.button.confirm') }}</a-button
                  >
                  <a-button
                    v-else
                    type="outline"
                    class="cap-title cancel-btn"
                    @click="handleCancel"
                    >{{ $t('common.button.cancel') }}</a-button
                  >
                </template>
              </EditPageFooter>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
      <jiraSpace
        :id="jiraId"
        v-model:show="show"
        @save="handleSaveJiraSpace"
      ></jiraSpace>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import {
    get,
    cloneDeep,
    isEqual,
    pick,
    find,
    map,
    capitalize,
    omit,
    includes,
  } from 'lodash';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import qs from 'query-string';
  import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
  import { ref, computed, onMounted, reactive, onUnmounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { urlReg } from '@/utils/validate';
  import jiraSteps from '../components/jira-steps.vue';
  import jiraPrivateSteps from '../components/jira-private-steps.vue';
  import jiraSpace from '../components/jira-space.vue';
  import {
    submitFormData,
    getFormData,
    updateFormData,
    getJiraAuthUrl,
    FormType,
    submitResourceUrl,
    queryAccessResource,
  } from '../api/project-management';
  import { projectManagementList, imgItem, authorizeTypeList } from '../config';
  import useCreateCode from '../hooks/use-create-code';

  const homeUrl = window.location.origin;
  const redirectUrl = `${homeUrl}/verify-auth`;

  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();
  const { handleStorageEvent, openUrl, formatValue } = useCreateCode();
  const formref = ref();
  const submitLoading = ref<boolean>(false);
  const repo = route.params.repo as string;
  const reConfigActive = ref(false);
  const show = ref(false);
  const spaceLoading = ref(false);
  const { id, type } = route.query;
  const oauth2Types = ['private_oauth2', 'cloud_oauth2'];
  const accessTokenTypes = ['cloud_access_token', 'private_access_token'];
  const cloudTypes = ['cloud_oauth2', 'cloud_access_token'];
  const privateTypes = ['private_oauth2', 'private_access_token'];
  const jiraType = ref('2');
  const repoTypeInfo: imgItem = reactive({
    label: '',
    type: '',
    value: '',
    img: '',
    provider: '',
    available: true,
    oauthUrl: '',
    settingUrl: '',
  });
  const codeVerifierMap = new Map();
  const resourceList = ref<{ label: string; value: string; id: string }[]>([]);
  let copyFormData: any = {};
  let formData = reactive<FormType>({
    type: (route.query.type || 'private_oauth2') as string, // private_oauth2, private_access_token
    clientID: '',
    clientSecret: '',
    code: '',
    url: '',
    isPrivate: !includes(cloudTypes, type),
    accessToken: '',
    apiBaseURL: '',
    provider: repo,
    enable: false,
    resourceID: '',
    resourceURL: '',
    codeVerifier: '',
    redirectURL: `${homeUrl}/verify-auth`,
  });

  const showSaveBtn = computed(() => {
    return (
      (includes(accessTokenTypes, formData.type) &&
        (reConfigActive.value || !id)) ||
      (includes(cloudTypes, formData.type) && !reConfigActive.value && id)
    );
  });
  const showConnectBtn = computed(() => {
    return (
      includes(oauth2Types, formData.type) && (reConfigActive.value || !id)
    );
  });
  const title = computed(() => {
    return `${repo} ${t('intergration.setting.title')}`;
  });
  const jiraId = computed(() => {
    return (id || formData.id) as string;
  });
  const handleClickReConfig = () => {
    reConfigActive.value = !reConfigActive.value;
  };

  const getRepoTypeInfo = () => {
    const data = projectManagementList.find((item) => {
      return item.type === repo;
    });
    Object.assign(repoTypeInfo, data || {});
  };
  const handlePrivateChange = () => {
    if (!formData.isPrivate) {
      formData.type = 'cloud_oauth2';
      jiraType.value = '1';
    } else {
      formData.type = 'private_oauth2';
      jiraType.value = '2';
    }
  };
  const handleJiraTypeChange = (val) => {
    jiraType.value = val;
    if (val === '1') {
      formData.isPrivate = false;
    } else {
      formData.isPrivate = true;
    }
    handlePrivateChange();
  };
  const handleSubmitFormData = async (query) => {
    console.log('query=====', query);
    try {
      submitLoading.value = true;
      formData.code = query.code;
      formData.codeVerifier = codeVerifierMap.get(query.state);
      if (id) {
        await updateFormData(formData);
      } else {
        const { data } = await submitFormData(formData);
        formData.id = data.id;
      }
      submitLoading.value = false;
      copyFormData = cloneDeep(formData);
      if (formData.isPrivate) {
        router.back();
      } else {
        show.value = true;
      }
    } catch (error) {
      console.log(error);
      submitLoading.value = false;
    }
  };
  const handleUrlBlur = () => {
    const values = formData?.url?.split('/');
    formData.url = formatValue(values || []);
  };

  const createCode = async () => {
    const query = pick(formData, [
      'provider',
      'clientID',
      'clientSecret',
      'redirectURL',
      'type',
      'url',
    ]);
    const { data } = await getJiraAuthUrl(query);
    const url = get(data, 'url');
    const params = qs.parseUrl(url);
    const { state, code_verifier } = params.query;
    codeVerifierMap.set(state, code_verifier);
    console.log('params===', params);
    handleStorageEvent(params, handleSubmitFormData);
    openUrl(url);
  };
  const handleUpdateFormData = async () => {
    try {
      await updateFormData(formData);
      copyFormData = cloneDeep(formData);
    } catch (error) {
      console.log(error);
      submitLoading.value = false;
    }
  };

  const save = async () => {
    // update
    submitLoading.value = true;
    if (formData.id && !reConfigActive.value) {
      await handleUpdateFormData();
    } else {
      // create
      await createCode();
    }
    submitLoading.value = false;
    // select jira space next step
  };

  const handleSubmit = async () => {
    const errors = await formref.value?.validate();
    if (!errors) {
      try {
        submitLoading.value = true;
        await save();
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
        console.log(error);
      }
    }
  };
  const handleUpdateOnAccessToken = async () => {
    try {
      submitLoading.value = true;
      if (id) {
        await updateFormData(formData);
      } else {
        await submitFormData(formData);
      }
      copyFormData = cloneDeep(formData);
      router.back();
      submitLoading.value = false;
    } catch (error) {
      submitLoading.value = false;
      console.log(error);
    }
  };
  const handleUpdateOnPrivate = async () => {
    formData.apiBaseURL = formData.url;
    if (formData.type === 'private_access_token') {
      [
        'code',
        'resourceID',
        'resourceURL',
        'redirectURL',
        'clientSecret',
        'clientID',
      ].forEach((key) => {
        formData[key] = '';
      });
      await handleUpdateOnAccessToken();
    } else if (formData.type === 'private_oauth2') {
      ['accessToken', 'resourceID', 'resourceURL'].forEach((key) => {
        formData[key] = '';
      });
      await createCode();
    }
  };
  const handleUpdateOnCloud = async () => {
    try {
      const data = {
        resourceID: formData.resourceID,
        resourceURL: formData.resourceURL,
        id: id as string,
      };
      submitLoading.value = true;
      await submitResourceUrl(data);
      copyFormData = cloneDeep(formData);
      router.back();
      submitLoading.value = false;
    } catch (error) {
      submitLoading.value = false;
      console.log(error);
    }
  };
  const handleUpdateSpace = async () => {
    const errors = await formref.value.validate();
    if (errors) return;
    if (formData.isPrivate) {
      handleUpdateOnPrivate();
    } else {
      handleUpdateOnCloud();
    }
  };
  const handleCancel = () => {
    router.back();
  };
  const fetchFormData = async (params) => {
    copyFormData = cloneDeep(formData);
    if (!id) return;
    try {
      const { data } = await getFormData(params);
      formData = Object.assign(formData, data);
      const resourceData = find(
        resourceList.value,
        (item) => item.value === formData.url
      );
      formData.resourceID = get(resourceData, 'id') || '';
      formData.resourceURL = get(resourceData, 'value') || '';
      formData.clientID = '';
      formData.isPrivate = ['private_oauth2', 'private_access_token'].includes(
        formData.type || ''
      );
      copyFormData = cloneDeep(formData);
      console.log('configInfo:', formData);
    } catch (error) {
      console.log(error);
    }
  };

  const onOk = () => {
    copyFormData = cloneDeep(formData);
  };

  const handleResourceChange = (value) => {
    const data = find(resourceList.value, (item) => item.value === value);
    formData.resourceID = get(data, 'id') || '';
    formData.resourceURL = value;
  };
  const getResourceList = async () => {
    if (!id || formData.isPrivate) return;
    try {
      spaceLoading.value = true;
      const { data } = await queryAccessResource({ id: id as string });
      resourceList.value = map(data, (item) => {
        return {
          value: item.url,
          label: item.name,
          id: item.id,
        };
      });
      spaceLoading.value = false;
    } catch (error) {
      console.log(error);
      spaceLoading.value = false;
    }
  };
  const handleSaveJiraSpace = () => {
    router.back();
  };
  onBeforeRouteLeave(async (to, from) => {
    console.log('leave');
    if (!isEqual(copyFormData, formData)) {
      beforeLeaveCallback(to, from, () => {
        copyFormData = cloneDeep(formData);
        router.push({
          name: to.name as string,
        });
      });
      return false;
    }
    return true;
  });

  onMounted(async () => {
    getRepoTypeInfo();
    if (includes(cloudTypes, type)) {
      await getResourceList();
      fetchFormData({ id });
    } else {
      await fetchFormData({ id });
      getResourceList();
    }
  });
</script>

<style lang="less" scoped>
  .container {
    margin-top: 0;

    .title-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .title {
      margin-top: 20px;
      padding-bottom: 15px;
      font-weight: 500;
      font-size: 18px;
      text-transform: capitalize;
      // border-bottom: 1px solid #fff;
    }

    .general-card {
      padding-top: 15px;

      .cap-title {
        text-transform: capitalize;
      }

      .opts {
        margin-top: 40px;

        &.configed {
          // margin-top: 0;
        }
      }

      .re-config {
        display: flex;
        // justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--seal-border-gray);

        :deep(.arco-btn) {
          margin-left: 15px;
          text-transform: capitalize;
        }
      }

      .label {
        text-transform: capitalize;
        // border-bottom: 1px solid var(--seal-border-gray);
      }

      .token-tips {
        display: inline-block;
        padding: 10px 10px;
        background-color: #fdddc3;

        .arco-icon {
          margin-right: 5px;
          color: var(--seal-color-warning);
        }
      }

      .bt-line {
        padding-bottom: 10px;
        border-bottom: 1px solid var(--seal-border-gray);
      }

      .create-steps {
        width: 100%;
        padding: 12px;
        font-size: 12px;
        background-color: var(--color-fill-2);
        border-radius: 2px;

        .step {
          &.sub {
            padding-left: 10px;
          }
        }
      }

      .repo-icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        vertical-align: -5px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
      }

      .btn-wrap {
        width: 200px;
        margin: 0 auto;
        margin-top: 40px;
      }
    }
  }
</style>
