<template>
  <div id="containerOci" class="container">
    <a-modal
      top="10%"
      :align-center="false"
      :width="800"
      :ok-text="$t('common.button.save')"
      :visible="show"
      :mask-closable="false"
      :body-style="{ 'max-height': '400px', 'overflow': 'auto' }"
      modal-class="oci-modal"
      :title="$t('projects.resource.container.title')"
      @cancel="handleCancel"
      @ok="handleOk"
      @before-open="handleBeforeOpen"
      @before-close="handleBeforeClose"
    >
      <a-spin :loading="loading" style="width: 100%; text-align: center">
        <a-form ref="formref" :model="formData" auto-label-width>
          <div style="display: flex; width: 100%">
            <a-form-item
              hide-asterisk
              field="containerRegistryID"
              :label="$t('projects.resource.container.registry')"
              validate-trigger="change"
              :rules="[
                {
                  required: true,
                  message: $t('projects.resource.rule.registry')
                }
              ]"
            >
              <template #label>
                <div ref="labelWrap" class="label-wrap">{{
                  $t('projects.resource.container.registry')
                }}</div>
              </template>
              <a-select
                v-model="formData.containerRegistryID"
                :options="optionsList"
                style="max-width: 300px"
                @change="handleRegistryChange"
              >
                <template #option="{ data }">
                  <a-tooltip :key="data.value" :content="data.label">
                    <span
                      ><span class="image-name">{{ `(${data.name})` }}</span
                      ><span>{{ data.label }}</span></span
                    >
                  </a-tooltip>
                </template>
              </a-select>
            </a-form-item>
            <a-divider
              direction="vertical"
              style="height: 32px; border-left: 2px solid #fff"
              margin="0"
            ></a-divider>

            <a-form-item
              field="name"
              :label-col-props="{ span: 0 }"
              validate-trigger="change"
              :rules="[
                {
                  required: true,
                  message: $t('projects.resource.rule.name')
                }
              ]"
            >
              <a-input
                v-model="formData.name"
                style="border-radius: 0 2px 2px 0"
                :placeholder="$t('resource.oci.name.holder')"
                @change="handleRegistryChange"
              >
                <template #suffix>
                  <a-tooltip
                    :content="$t('projects.resource.tabfix.version.desc')"
                  >
                    <icon-question-circle style="font-size: 12px" />
                  </a-tooltip>
                </template>
              </a-input>
            </a-form-item>
          </div>
          <div
            v-for="(item, index) in formData.versionSelector"
            :key="index"
            class="row-wrap"
          >
            <!-- select type -->
            <div style="display: flex">
              <a-form-item
                style="max-width: 500px"
                :label="$t('projects.resource.tabfix.version')"
                :wrapper-col-style="{ flex: 1 }"
                :field="`versionSelector.${index}.operator`"
              >
                <template #label>
                  <span
                    >{{ $t('projects.resource.tabfix.version') }}
                    {{ index + 1 }}</span
                  >
                </template>
                <template #extra>
                  {{ $t(item.extra || '') }}
                </template>
                <a-select
                  v-model="item.operator"
                  allow-search
                  @change="(val) => handleTagTypeChange(val, item)"
                >
                  <a-option
                    v-for="(s, sIndex) in tagsTypeList"
                    :key="sIndex"
                    :disabled="
                      s.value === 'equal' &&
                      item.operator !== 'equal' &&
                      some(
                        formData.versionSelector,
                        (v) => v.operator === 'equal'
                      )
                    "
                    :label="$t(s.label)"
                    :value="s.value"
                  >
                  </a-option>
                </a-select>
              </a-form-item>
              <a-button
                type="primary"
                size="mini"
                style="position: relative; top: 3px; margin-left: 20px"
                @click="handleClickDelete(index)"
                ><icon-minus
              /></a-button>
            </div>
            <div style="display: flex">
              <div :style="{ flex: `0 0 ${labelWidth}`, marginRight: '16px' }">
              </div>
              <!-- select version -->
              <a-form-item
                v-if="item.operator === 'equal'"
                :label-col-props="{ span: 0 }"
                :wrapper-col-style="{ flex: 1 }"
                :field="`versionSelector.${index}.tagValue`"
                validate-trigger="change"
                :rules="[
                  {
                    required: true,
                    message: $t('projects.resource.rule.tags')
                  }
                ]"
              >
                <a-select
                  v-model="item.tagValue"
                  :placeholder="$t('resource.oci.tagType.holder')"
                  allow-clear
                  :virtual-list-props="{
                    height: 150,
                    fixedSize: true,
                    threshold: 10
                  }"
                  :options="customTagsList"
                  :trigger-props="{ contentClass: 'image-import-modal' }"
                  :loading="queryLoading"
                  class="tags-drop-list tags-selector"
                  style="text-align: left; border-radius: 2px 0 0 2px"
                  multiple
                  :max-tag-count="2"
                >
                  <template #option="{ data }">
                    <span>{{ data.label }}</span>
                  </template>
                  <template #empty><span></span></template>
                </a-select>
              </a-form-item>
              <a-divider
                v-if="item.operator !== 'equal'"
                direction="vertical"
                style="height: 32px; borderleft: 2px solid #fff"
                margin="0"
              ></a-divider>
              <!-- keyword -->
              <a-form-item
                v-if="['fuzzy', 'greaterThan'].includes(item.operator)"
                :label-col-props="{ span: 0 }"
                :wrapper-col-style="{ flex: 1 }"
                :field="`versionSelector.${index}.value`"
                validate-trigger="change"
                :rules="[
                  {
                    required: true,
                    message: $t('projects.resource.rule.value')
                  }
                ]"
              >
                <a-input
                  v-model="item.value"
                  :max-length="20"
                  show-word-limit
                  :placeholder="$t('resource.oci.value.holder')"
                ></a-input>
              </a-form-item>
              <a-divider
                v-if="['fuzzy', 'greaterThan'].includes(item.operator)"
                direction="vertical"
                style="height: 32px; borderleft: 2px solid #fff"
                margin="0"
              ></a-divider>
              <!-- match count -->
              <a-form-item
                v-if="
                  ['fuzzy', 'greaterThan', 'latestN'].includes(item.operator)
                "
                row-class="count-row-wrap"
                :field="`versionSelector.${index}.limit`"
                :wrapper-col-style="{ flex: 'initial', width: '160px' }"
                :label-col-props="{ span: 0 }"
                validate-trigger="change"
                :rules="[
                  {
                    required: true,
                    message: $t('projects.resource.rule.limit')
                  }
                ]"
              >
                <a-input-number
                  v-model="item.limit"
                  :min="1"
                  :max="10"
                  :placeholder="$t('resource.oci.limit.holder')"
                  style="width: 100%"
                ></a-input-number>
              </a-form-item>

              <a-divider
                direction="vertical"
                style="height: 32px; borderleft: 2px solid #fff"
                margin="0"
              ></a-divider>
              <!-- add tags -->
              <a-form-item
                :field="`versionSelector.${index}.tags`"
                :wrapper-col-style="{ flex: 1 }"
                :label-col-props="{ span: 0 }"
              >
                <a-select
                  v-model="item.tags"
                  class="tags-selector"
                  :trigger-props="{
                    contentClass:
                      !item.tags.length && !item?.tagsList?.length
                        ? 'input-select-drop-list'
                        : ''
                  }"
                  multiple
                  allow-create
                  unique-value
                  :max-tag-count="1"
                  :style="{
                    textAlign: 'left',
                    borderRadius:
                      item.operator === 'equal' ? '0 2px 2px 0' : '0'
                  }"
                  :placeholder="$t('projects.resource.container.tagholder')"
                >
                  <a-option style="display: none"></a-option>
                  <a-option
                    v-for="(m, mIndex) in item.tagsList"
                    :key="mIndex"
                    :value="m.value"
                    >{{ m.label }}</a-option
                  >
                  <template #empty><span></span></template>
                  <template #search-icon>
                    <a-tooltip
                      :content="
                        $t('projects.resource.container.tagholder.desc')
                      "
                    >
                      <icon-question-circle />
                    </a-tooltip>
                  </template>
                  <template #arrow-icon>
                    <a-tooltip
                      :content="
                        $t('projects.resource.container.tagholder.desc')
                      "
                    >
                      <icon-question-circle />
                    </a-tooltip>
                  </template>
                </a-select>
              </a-form-item>
            </div>
          </div>
          <a-form-item>
            <template v-if="!formData.versionSelector.length" #label>
              <span>{{ $t('projects.resource.tabfix.version') }}</span>
            </template>
            <a-button type="primary" size="mini" @click="handleAddVersion"
              ><icon-plus
            /></a-button>
          </a-form-item>
        </a-form>
      </a-spin>
      <template #footer>
        <EditPageFooter>
          <template #save>
            <a-button
              :loading="submitLoading"
              type="primary"
              class="cap-title cancel-btn"
              @click="handleOk"
              >{{ $t('common.button.save') }}</a-button
            >
          </template>
          <template #cancel>
            <a-button
              :type="'outline'"
              class="cap-title cancel-btn"
              @click="handleCancel"
              >{{ $t('common.button.cancel') }}</a-button
            >
          </template>
        </EditPageFooter>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import {
    cloneDeep,
    join,
    map,
    pick,
    some,
    each,
    get,
    split,
    omit
  } from 'lodash';
  import useAxiosSource from '@/hooks/use-axios-cancel';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { computed, PropType, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLocale from '@/hooks/locale';
  import {
    getRegistriesList,
    getRegistyRepoTags
  } from '@/views/intergration/api/registry';
  import { submitFormData, tableListRow, updateFormData } from '@/api/projects';
  import useLoading from '@/hooks/loading';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    provider: {
      type: String,
      default() {
        return '';
      }
    },
    registryId: {
      type: String,
      default() {
        return '';
      }
    },
    imageData: {
      type: Object as PropType<tableListRow>,
      default() {
        return {};
      }
    }
  });
  interface VersionSelector {
    operator: string;
    value: string;
    limit: number | undefined;
    tagValue?: string[];
    tags: string[];
    extra?: any;
    tagsList?: Array<{ label: string; value: string }>;
  }
  const axiosSource = useAxiosSource();
  let axiosToken = axiosSource();
  const { t } = useI18n();
  const { loading, setLoading } = useLoading();
  const queryLoading = ref(false);
  const { currentLocale } = useLocale();
  const optionsList = ref<{ label: string; value: string; name?: string }[]>(
    []
  );
  const tagsTypeList = [
    { label: 'resource.oci.tagType.default', value: 'equal' },
    { label: 'resource.oci.tagType.custom', value: 'fuzzy' },
    {
      label: 'resource.oci.tagType.lastn',
      value: 'latestN',
      desc: 'resource.oci.tagType.lastn.desc'
    },
    {
      label: 'resource.oci.tagType.greatThan',
      value: 'greaterThan',
      desc: 'resource.oci.tagType.greatThan.desc'
    }
  ];
  const customTagsList = ref<{ label: string; value: string }[]>([]);
  const emit = defineEmits(['save', 'update:show', 'reset']);
  const submitLoading = ref(false);
  const formref = ref();
  const matchDesc = ref('');
  const formData = reactive({
    name: '',
    containerRegistryID: '',
    provider: '',
    kind: 'containerImage',
    id: '',
    versionSelector: [
      // {
      //   operator: 'equal',
      //   value: '',
      //   tagValue: [],
      //   limit: undefined,
      //   tags: [],
      //   tagsList: [] as Array<{ label: string; value: string }>,
      // },
    ] as VersionSelector[],
    imageTags: []
  });

  const labelWidth = computed(() => {
    return currentLocale.value === 'en-US' ? '117px' : '66px';
  });
  const handleAddVersion = () => {
    const res = some(
      formData.versionSelector,
      (item) => item.operator === 'equal'
    );
    const operator = res ? 'fuzzy' : 'equal';
    formData.versionSelector.push({
      operator,
      value: '',
      extra: '',
      tagValue: [],
      limit: undefined,
      tags: [],
      tagsList: []
    });
  };
  const handleClickDelete = (index) => {
    formData.versionSelector.splice(index, 1);
  };
  const handleTagTypeChange = (val, item) => {
    const data = tagsTypeList.find((s) => s.value === val);
    item.extra = data?.desc || '';
  };
  const handleCancel = () => {
    emit('update:show', false);
  };
  const setBatchResourceList = () => {
    const data = {
      name: formData.name,
      containerRegistryID: formData.containerRegistryID,
      provider: props.provider,
      kind: 'containerImage',
      id: formData.id
    };
    const versionSelector: VersionSelector[] = formData.versionSelector.map(
      (item) => {
        if (item.operator === 'equal') {
          item.value = join(item.tagValue, ',');
          item.limit = undefined;
        }
        return {
          ...pick(item, ['value', 'tags', 'limit', 'operator'])
        };
      }
    );
    return {
      ...data,
      versionSelector
    };
  };
  const getRegistryRepoTags = async () => {
    try {
      const params = {
        repository: formData.name,
        id: formData.containerRegistryID
      };
      queryLoading.value = true;
      const { data } = await getRegistyRepoTags(params, axiosToken?.token);
      const list = data?.tags || [];
      customTagsList.value = map(list, (val) => {
        return {
          label: val,
          value: val
        };
      });
      queryLoading.value = false;
    } catch (error) {
      console.log(error);
      customTagsList.value = [];
      queryLoading.value = false;
    }
  };
  const handleRegistryChange = () => {
    if (!formData.containerRegistryID || !formData.name) return;
    each(formData.versionSelector, (item) => {
      item.tagValue = [];
      item.value = '';
    });
    getRegistryRepoTags();
  };
  const initRegistryVersions = () => {
    if (!formData.containerRegistryID || !formData.name) return;
    getRegistryRepoTags();
  };
  const handleBeforeClose = () => {
    console.log('cancel:');
    axiosToken?.cancel();
    formData.name = '';
    formData.provider = '';
    formData.id = '';
    formData.containerRegistryID = '';
    formData.versionSelector = [
      // {
      //   operator: 'equal',
      //   value: '',
      //   tagValue: [],
      //   limit: undefined,
      //   tags: [],
      //   tagsList: [],
      // },
    ];
    optionsList.value = [];
    customTagsList.value = [];
    formref.value.resetFields();
    setLoading(false);
    queryLoading.value = false;
    emit('reset');
  };

  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        let data = setBatchResourceList();
        submitLoading.value = true;
        if (!formData.id) {
          data = omit(data, ['id']) as any;
          await submitFormData(data);
        } else {
          await updateFormData(data);
        }
        setTimeout(() => {
          emit('save');
          emit('reset');
        }, 200);
        emit('update:show', false);
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };

  const getOptionList = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        perPage: 1000,
        provider: props.provider
      };
      const result = await getRegistriesList(params);
      console.log('result===', result);
      const { data } = result;
      const list = data?.items || [];
      const arr = map(list, (item) => {
        return {
          ...item,
          label: item.url,
          value: item.id
        };
      });
      optionsList.value = [].concat(arr as never[]);
      console.log('optionsList', optionsList.value);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const openInitData = () => {
    let versionSelector: VersionSelector[] =
      get(props.imageData, 'versionSelector') || [];
    if (versionSelector.length) {
      versionSelector = map(versionSelector, (item) => {
        return {
          ...item,
          tagValue: item.operator === 'equal' ? split(item.value, ',') : [],
          tagsList: map(item.tags, (val) => {
            return {
              value: val,
              label: val
            };
          })
        };
      });
    }
    formData.versionSelector = [].concat(versionSelector as never[]);
    formData.id = get(props.imageData, 'dataId') || '';
    formData.containerRegistryID =
      get(props.imageData, 'containerRegistryID') || '';
    formData.name = get(props.imageData, 'fullName') || '';
  };
  const handleBeforeOpen = async () => {
    axiosToken = axiosSource();
    await getOptionList();
    openInitData();
    initRegistryVersions();
  };
</script>

<style lang="less">
  .arco-trigger-content.image-import-modal {
    .arco-select-dropdown-list-wrapper {
      max-height: 140px;
    }
  }

  .oci-modal {
    .arco-select-view-multiple.arco-select-view-size-medium
      .arco-select-view-tag {
      max-width: 80px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .arco-btn-size-small {
      padding: 0 8px;
    }

    .row-wrap {
      .arco-row-justify-start.count-row-wrap {
        flex-basis: fit-content !important;
      }

      .arco-divider-vertical {
        border-left: 2px solid #fff;
      }
    }

    .arco-btn-size-mini {
      padding: 0 7px;
    }

    .arco-select.tags-selector {
      .arco-select-view-inner {
        display: flex;
      }
    }
  }
</style>

<style lang="less" scoped>
  .image-name {
    // font-size: 12px;
    color: var(--color-text-3);
  }
</style>
