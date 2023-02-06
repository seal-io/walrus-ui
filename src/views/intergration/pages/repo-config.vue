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
        <a-button
          v-if="id"
          type="primary"
          style="width: 120px"
          @click="handleImportProjects"
          >{{ $t('projects.button.add') }}</a-button
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
            >{{
              $t('intergration.createApp.reconfig', { repo: repo })
            }}</a-button
          >
        </div>

        <a-form
          ref="form"
          :model="formData"
          layout="vertical"
          @submit="handleSubmit"
        >
          <a-row v-if="!id || reConfigActive" :gutter="30">
            <a-col :span="12">
              <a-space direction="vertical" :size="0" fill>
                <template v-if="repo === 'GitLab'">
                  <a-form-item :hide-label="true">
                    <a-checkbox
                      v-model="isGitlabPrivate"
                      @change="handlePrivateChange"
                    >
                      <span style="color: #4e5969; font-size: 14px">{{
                        $t('intergration.createApp.gitlab.private', {
                          repo: repo,
                        })
                      }}</span>
                    </a-checkbox>
                  </a-form-item>
                  <a-form-item
                    v-show="isGitlabPrivate"
                    :label="$t('intergration.createApp.gitlaburl')"
                    :hide-label="false"
                    :hide-asterisk="true"
                    field="url"
                    :validate-trigger="['change']"
                    :rules="[
                      {
                        required: isGitlabPrivate,
                        message: $t('intergration.rules.gitlaburl'),
                      },
                      {
                        match: urlReg,
                        message: $t('system.rules.url'),
                      },
                    ]"
                  >
                    <a-input
                      v-model="formData.url"
                      placeholder="https://gitlab.example.com"
                      @blur="handleUrlBlur"
                    ></a-input>
                  </a-form-item>
                </template>
                <a-form-item
                  label="Client ID"
                  :hide-label="false"
                  :hide-asterisk="true"
                  field="clientId"
                  :validate-trigger="['change']"
                  :rules="[
                    {
                      required: true,
                      message: $t('intergration.rules.clientId'),
                    },
                  ]"
                >
                  <a-input
                    v-model="formData.clientId"
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
              </a-space>
            </a-col>
            <a-col :span="12">
              <github-steps
                v-if="repo === 'GitHub'"
                :repo="repo"
                :callback-url="redirectUrl"
                :source-info="repoTypeInfo"
              ></github-steps>
              <gitlab-steps
                v-if="repo === 'GitLab'"
                :repo="repo"
                :is-private="isGitlabPrivate"
                :private-url="formData.url"
                :source-info="repoTypeInfo"
                :callback-url="redirectUrl"
              ></gitlab-steps>
            </a-col>
          </a-row>
          <a-row v-if="id && !reConfigActive && isGitlabPrivate">
            <a-col :span="12">
              <a-form-item
                disabled
                :label="$t('intergration.createApp.gitlaburl')"
                :hide-label="false"
                :hide-asterisk="true"
                field="url"
                :validate-trigger="['change']"
                :rules="[
                  {
                    required: isGitlabPrivate,
                    message: $t('intergration.rules.gitlaburl'),
                  },
                  {
                    match: urlReg,
                    message: $t('system.rules.url'),
                  },
                ]"
              >
                <a-input
                  :model-value="formData.url"
                  placeholder="https://gitlab.example.com"
                  @blur="handleUrlBlur"
                ></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="30" class="opts">
            <a-col :span="12">
              <a-space direction="vertical" :size="12" fill>
                <div class="bt-line">{{ $t('intergration.accessRepo') }}</div>
                <a-radio-group
                  v-model="formData.managePrivateRepos"
                  direction="vertical"
                >
                  <a-radio
                    v-for="(item, index) in accessRepoOpts"
                    :key="index"
                    :value="item.value"
                    >{{ $t(item.label) }}</a-radio
                  >
                </a-radio-group>
              </a-space>
            </a-col>
            <a-col :span="12">
              <a-space direction="vertical" :size="12" fill>
                <div class="bt-line">{{ $t('intergration.scan.title') }}</div>
                <a-space direction="vertical">
                  <a-checkbox
                    v-for="item in scanOpts"
                    :key="item.key"
                    v-model="formData[item.key]"
                    >{{ $t(item.label) }}</a-checkbox
                  >
                </a-space>
              </a-space>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <EditPageFooter>
                <template #save>
                  <a-button
                    v-if="id && !reConfigActive"
                    :loading="submitLoading"
                    type="primary"
                    html-type="submit"
                    class="cap-title save-btn"
                    >{{ $t('intergration.button.save') }}</a-button
                  >
                  <a-button
                    v-else
                    :loading="submitLoading"
                    type="primary"
                    html-type="submit"
                    class="cap-title save-btn"
                    >{{
                      $t('intergration.button.connect', { repo: repo })
                    }}</a-button
                  >
                </template>
                <template #cancel>
                  <a-button
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
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import { cloneDeep, isEqual, capitalize, toLower, get } from 'lodash';
  import qs from 'query-string';
  import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
  import { ref, computed, onMounted, reactive, onUnmounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { urlReg } from '@/utils/validate';
  import githubSteps from '../components/github-steps.vue';
  import gitlabSteps from '../components/gitlab-steps.vue';
  import {
    submitFormData,
    getFormData,
    updateFormData,
  } from '../api/repo-config';
  import { sourceRepoList, accessRepoOpts, scanOpts, imgItem } from '../config';

  interface ParamsType {
    code: string;
    state: string;
  }
  interface FormType {
    clientId: string;
    clientSecret: string;
    code: string;
    provider: string;
    enable: boolean;
    id?: string;
    url?: string;
    redirectUrl?: string;
    managePrivateRepos: boolean;
    enablePullRequestCommenting: boolean;
    enableScheduleEvaluation: boolean;
    enableWebhookDrivenEvaluation: boolean;
  }
  const homeUrl = window.location.origin;
  const callbackUrl = homeUrl;
  // const redirectUrl = `${homeUrl}/integration/oauth`;
  const redirectUrl = `${homeUrl}/verify-auth`;

  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();
  const submitLoading = ref<boolean>(false);
  const repo = route.params.repo as string;
  const reConfigActive = ref(false);
  const { id } = route.query;
  const isGitlabPrivate = ref(false);
  const repoTypeInfo: imgItem = reactive({
    label: '',
    type: '',
    value: '',
    img: '',
    provider: toLower(repo),
    available: true,
    oauthUrl: '',
    settingUrl: '',
  });

  const title = computed(() => {
    return `${repo} ${t('intergration.setting.title')}`;
  });
  let copyFormData: any = {};
  let formData = reactive<FormType>({
    clientId: '',
    clientSecret: '',
    code: '',
    provider: toLower(repo),
    enable: false,
    url: '',
    redirectUrl: `${homeUrl}/verify-auth`,
    managePrivateRepos: true,
    enablePullRequestCommenting: true,
    enableScheduleEvaluation: true,
    enableWebhookDrivenEvaluation: false,
  });

  const handleClickReConfig = () => {
    reConfigActive.value = true;
  };

  const formatValue = (list: string[]) => {
    const len = list.length;
    const last = list[len - 1];
    if (last === '') {
      list.pop();
      formatValue(list);
    } else {
      return list.join('/');
    }
    return list.join('/');
  };

  const getRepoTypeInfo = () => {
    const data = sourceRepoList.find((item) => {
      return item.type === repo;
    });
    Object.assign(repoTypeInfo, data || {});
  };
  const handleSubmitFormData = async () => {
    submitLoading.value = true;
    try {
      if (id) {
        await updateFormData(formData);
        submitLoading.value = false;
        copyFormData = cloneDeep(formData);
        router.back();
      } else {
        const res = await submitFormData(formData);
        copyFormData = cloneDeep(formData);
        submitLoading.value = false;
        router.push({
          name: 'importRepo',
          query: {
            id: res?.data?.id,
          },
        });
      }
    } catch (error) {
      console.log(error);
      submitLoading.value = false;
    }
  };

  const storeageHandler = (params): void => {
    console.log('message:', params);
    let query: any = localStorage.getItem('code') || {};
    query = qs.parse(query);
    if (query?.code && query?.state === String(params.state)) {
      formData.code = query.code as string;
      localStorage.removeItem('code');
      handleSubmitFormData();
    }
  };
  // set request params to source repo
  const setLinkParams = () => {
    let params = {};
    if (repo === 'GitHub') {
      params = {
        client_id: formData.clientId,
        scope: 'repo,admin:repo_hook',
        redirect_uri: redirectUrl,
        state: Date.now(),
      };
    } else if (repo === 'GitLab') {
      params = {
        client_id: formData.clientId,
        response_type: 'code',
        redirect_uri: redirectUrl,
        state: Date.now(),
      };
    }
    return params;
  };
  const createCode = async () => {
    const params = setLinkParams();

    const oauthUrl =
      formData.url && isGitlabPrivate.value
        ? `${formData.url}/oauth/authorize`
        : repoTypeInfo.oauthUrl;

    const url = `${oauthUrl}?${qs.stringify(params)}`;

    window.open(
      url,
      '_blank',
      'fullscreen=no,scrollbars=yes,left=300,top=0,toolbar=no,height=800, width=700'
    );

    window.addEventListener('storage', (e) => {
      console.log(e);
      storeageHandler(params);
    });
  };
  const handleUpdateFormData = async () => {
    try {
      await updateFormData(formData);
      copyFormData = cloneDeep(formData);
      router.push({
        name: 'allIntegration',
      });
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
  };

  const handleSubmit = async ({ errors }) => {
    if (!errors) {
      try {
        console.log('valid:', { values: formData, errors });
        submitLoading.value = true;
        await save();
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
        console.log(error);
      }
    }
  };

  const handleUrlBlur = () => {
    const values = formData?.url?.split('/');
    formData.url = formatValue(values || []);
  };
  const handleCancel = () => {
    router.back();
  };
  const fetchFormData = async (params) => {
    copyFormData = cloneDeep(formData);
    if (!id) return;
    try {
      getFormData(params).then((res) => {
        formData = Object.assign(formData, res.data);
        formData.managePrivateRepos = !!get(res, 'data.managePrivateRepos');
        formData.enableScheduleEvaluation = !!get(
          res,
          'data.enableScheduleEvaluation'
        );
        formData.enableWebhookDrivenEvaluation = !!get(
          res,
          'data.enableWebhookDrivenEvaluation'
        );
        formData.enablePullRequestCommenting = !!get(
          res,
          'data.enablePullRequestCommenting'
        );
        isGitlabPrivate.value = !!formData.url;
        // formData.url = '';
        copyFormData = cloneDeep(formData);
        console.log('configInfo:', formData);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleImportProjects = () => {
    router.push({
      name: 'importRepo',
      query: {
        id,
      },
    });
  };

  const handlePrivateChange = () => {
    if (!isGitlabPrivate.value) {
      formData.url = '';
    }
  };
  const onOk = () => {
    copyFormData = cloneDeep(formData);
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
    fetchFormData({ id });
  });
  onUnmounted(() => {
    window.removeEventListener('storage', storeageHandler);
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
