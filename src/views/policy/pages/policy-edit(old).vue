<template>
  <div class="container policy-edit">
    <a-card class="general-card" :bordered="false">
      <a-form
        ref="formref"
        auto-label-width
        :model="formData"
        :disabled="builtInDisabled"
      >
        <div class="label">{{ $t('policy.detail.edit.basic') }}</div>
        <a-form-item
          :label="$t('policy.detail.edit.policyName')"
          field="name"
          :rules="[{ required: true, message: $t('policy.detail.rules.name') }]"
        >
          <a-input v-model="formData.name"></a-input>
        </a-form-item>
        <a-form-item
          v-if="category === 'whiteList'"
          id="policy-formdata-category"
          :label="$t('policy.detail.edit.group')"
          field="category"
          :rules="[
            { required: true, message: $t('policy.detail.rules.category') },
          ]"
        >
          <a-select v-model="formData.category" @change="handleCategoryChange">
            <a-option
              v-for="item in categoryList"
              :key="item.value"
              :value="item.value"
              :label="$t(item.label)"
            ></a-option>
          </a-select>
        </a-form-item>
        <a-form-item
          id="policy-formdata-type"
          :label="$t('policy.detail.edit.type')"
          field="type"
          :validate-trigger="['change']"
          :rules="[
            { required: true, message: $t('policy.detail.rules.catgory') },
          ]"
        >
          <a-select v-model="formData.type" @change="handleTypeChange">
            <a-option
              v-for="item in categoriesList"
              :key="item.value"
              :value="item.value"
              :label="$t(item.label)"
            ></a-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="category !== 'whiteList'"
          :label="$t('policy.detail.edit.sererity')"
          field="severity"
          :rules="[
            {
              required: category !== 'whiteList',
              message: $t('policy.detail.rules.level'),
            },
          ]"
        >
          <a-select v-model="formData.severity">
            <a-option
              v-for="item in levelList"
              :key="item.value"
              :value="item.value"
              :label="$t(item.label)"
            ></a-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :label="$t('policy.detail.edit.description')"
          field="description"
          :rules="[
            { required: true, message: $t('policy.detail.rules.description') },
          ]"
        >
          <a-textarea v-model="formData.description" class="desc"></a-textarea>
        </a-form-item>
        <a-form-item
          v-if="policyId"
          :disabled="true"
          :label="$t('policy.table.number')"
        >
          <a-input :model-value="formData.code"></a-input>
        </a-form-item>
        <div class="label">{{ $t('policy.table.switch') }}</div>
        <a-form-item label="" class="no-bottom-gap" :disabled="false">
          <a-switch v-model="formData.enabled" />
        </a-form-item>
        <div class="label">{{ $t('policy.detail.edit.scope') }}</div>
        <a-form-item
          :label="$t('policy.detail.edit.available')"
          :disabled="false"
        >
          <a-select v-model="useInScope">
            <a-option
              v-for="item in scopeTypeList"
              :key="item.value"
              :value="item.value"
              :label="$t(item.label)"
            ></a-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="useInScope === 'all'"
          :disabled="false"
          field="scopeAll"
          :rules="[
            { required: true, message: $t('policy.detail.rules.scope') },
          ]"
        >
          <a-space :size="20">
            <a-checkbox
              v-model="formData.bindings.isAllResource"
              @change="handleScopeAllChange"
              >{{ $t('policy.detail.operator.all.projects') }}</a-checkbox
            >
            <a-checkbox
              v-if="formData.category === 'sca'"
              v-model="formData.bindings.isAllProxy"
              @change="handleScopeAllChange"
              >{{ $t('policy.detail.operator.all.proxy') }}</a-checkbox
            >
          </a-space>
        </a-form-item>
        <a-space v-if="useInScope === 'partial'" :size="0">
          <a-form-item
            label=""
            :disabled="false"
            field="scopePartial"
            :rules="[
              {
                required: true,
                message: $t('policy.detail.rules.scopePartial'),
              },
            ]"
          >
            <a-space direction="vertical" style="margin-right: 10px">
              <span class="s-label"
                >{{ $t('policy.detail.edit.projects') }}:</span
              >
              <a-select
                v-model="formData.bindings.repositoryIDs"
                multiple
                allow-clear
                :max-tag-count="2"
                @change="handleScopePartialChange"
              >
                <a-option
                  v-for="item in projectsList"
                  :key="item.value"
                  :value="item.value"
                  ><span
                    ><span
                      class="repo-icon"
                      :style="{
                        'display': 'inline-block',
                        'width': '16px',
                        'height': '16px',
                        'margin-right': '5px',
                        'vertical-align': '-3px',
                        'background-repeat': 'no-repeat',
                        'background-position': 'center center',
                        'background-size': 'contain',
                        'background-image': `url(${repoIcon[item.provider]})`,
                      }"
                    ></span
                    ><span>{{ item.label }}</span></span
                  ></a-option
                >
                <template #empty>
                  <div
                    class="extenal-link"
                    style="
                      padding: 10px 5px;
                      font-size: 12px;
                      text-align: center;
                    "
                  >
                    <a-link class="extenal-link" @click="handleToImportRepo"
                      >{{ $t('policy.detail.edit.importPro')
                      }}<icon-double-right
                    /></a-link>
                  </div>
                </template>
              </a-select>
            </a-space>
            <a-space v-if="formData.category === 'sca'" direction="vertical">
              <span class="s-label">{{ $t('policy.detail.edit.proxy') }}:</span>
              <a-select
                v-model="formData.bindings.proxyIDs"
                multiple
                allow-clear
                :max-tag-count="2"
                @change="handleScopePartialChange"
              >
                <a-option
                  v-for="item in proxiesUsedList"
                  :key="item.value"
                  :value="item.value"
                  ><span
                    class="repo-icon"
                    :style="{
                      'margin-left': '5px',
                      'display': 'inline-block',
                      'width': '16px',
                      'height': '16px',
                      'margin-right': '5px',
                      'vertical-align': '-4px',
                      'background-repeat': 'no-repeat',
                      'background-position': 'center center',
                      'background-size': 'contain',
                      'background-image': `url(${repoIcon[item.provider]})`,
                    }"
                  ></span
                  ><span>{{ item.label }}</span></a-option
                >
                <template #empty>
                  <div
                    class="extenal-link"
                    style="
                      padding: 10px 5px;
                      font-size: 12px;
                      text-align: center;
                    "
                  >
                    <a-link @click="handleToSetProxy"
                      >{{ $t('policy.detail.edit.setProxy')
                      }}<icon-double-right
                    /></a-link>
                  </div>
                </template>
              </a-select>
            </a-space>
          </a-form-item>
        </a-space>
        <div v-if="useInScope === 'tags'">
          <a-form-item
            :disabled="false"
            field="tagsText"
            :rules="[
              { required: true, message: $t('policy.detail.rules.tags') },
            ]"
          >
            <!-- <div class="s-label">Tags:</div> -->
            <a-input
              v-model="formData.tagsText"
              allow-clear
              :placeholder="$t('common.input.holder')"
              @change="handleTagsChange"
            ></a-input>
            <template #extra>
              <span>{{ $t('policy.detail.edit.setTags') }}</span>
            </template>
          </a-form-item>
        </div>
        <div class="label">{{ $t('policy.detail.edit.constraint') }}</div>
        <a-form-item
          :label="$t('policy.detail.edit.format')"
          class="format-item"
        >
          <a-radio-group
            v-model="format"
            type="button"
            size="small"
            @change="handleFormatChange"
          >
            <a-radio value="form"
              ><icon-code-block />{{
                $t('policy.detail.operator.condition.form')
              }}</a-radio
            >
            <a-radio value="expr"
              ><icon-code-square />{{
                $t('policy.detail.operator.condition.express')
              }}</a-radio
            >
          </a-radio-group>
        </a-form-item>
        <div id="policy-condition-box">
          <div
            v-if="format === 'form'"
            class="container-wrap"
            :class="{ 'en-lang': lang === 'en' }"
          >
            <div class="conditions-box">
              <a-form-item
                class="small-form-item condition-type condition-opts"
                field="constraint.operator"
                :rules="[{ required: true, message: '' }]"
              >
                <a-select v-model="formData.constraint.operator">
                  <a-option
                    v-for="item in constraintsTypeList"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></a-option>
                </a-select>
              </a-form-item>
              <div
                v-for="(cItem, cIndex) in formData.constraint.conditions"
                :key="`${formData.constraint.conditions.length}.${cIndex}`"
                class="condition-row"
              >
                <a-space
                  :size="10"
                  align="center"
                  fill
                  class="condition-row-space"
                >
                  <!-- conditionType -->
                  <a-form-item
                    :key="`conditionType.${cIndex}`"
                    class="small-form-item condition-type"
                    :validate-trigger="['change', 'blur']"
                    :field="`constraint.conditions.${cIndex}.conditionType`"
                    :rules="{
                      required: true,
                      validator: (val, callback) => {
                        handleValidateConditionType(val, callback, cIndex);
                      },
                    }"
                  >
                    <a-select
                      v-model="cItem.conditionType"
                      :disabled="!formData.type"
                      @click="handleClickDisable"
                      @change="
                        (val) => handleConditionTypeChange(val, cIndex, cItem)
                      "
                    >
                      <a-option
                        v-for="sItem in policyCategoryConditionList"
                        :key="sItem.conditionType"
                        :value="sItem.conditionType"
                      >
                        <a-tooltip
                          :content="
                            sItem.conditionType === 'vulnerabilitySeverity'
                              ? $t('policy.detail.condition.serverity')
                              : setLabel(sItem.conditionType)
                          "
                        >
                          <span>{{
                            sItem.conditionType === 'vulnerabilitySeverity'
                              ? $t('policy.detail.condition.serverity')
                              : setLabel(sItem.conditionType)
                          }}</span>
                        </a-tooltip>
                      </a-option>
                      <template #empty><span></span></template>
                    </a-select>
                    <template v-if="!conditionHasOperator(cItem)" #extra>
                      <span>{{ getConditionDescript(cItem) }}</span>
                    </template>
                  </a-form-item>
                  <!-- hasOperator -->
                  <a-space
                    v-if="conditionHasOperator(cItem)"
                    fill
                    class="condition-op-val"
                  >
                    <!-- operator -->
                    <a-form-item
                      :key="`operator.${cIndex}`"
                      class="small-form-item operator"
                      hide-label
                      hide-asterisk
                      :validate-trigger="['change']"
                      :field="`constraint.conditions.${cIndex}.operator`"
                      :rules="[
                        {
                          required: true,
                          validator: (val, callback) => {
                            handleValidateOperator(val, callback, cIndex);
                          },
                        },
                      ]"
                    >
                      <a-select
                        v-model="cItem.operator"
                        @change="(val) => handleItemOperatorChange(val, cItem)"
                      >
                        <a-option
                          v-for="pItem in getOperatorList(cItem)"
                          :key="pItem.value"
                          :value="pItem.value"
                          :label="setLabel(pItem.label)"
                        ></a-option>
                        <template #empty><span></span></template>
                      </a-select>
                    </a-form-item>
                    <!-- value? -->
                    <a-form-item
                      :key="`value.${cIndex}`"
                      class="small-form-item"
                      hide-label
                      :field="`constraint.conditions.${cIndex}.value`"
                      :rules="[
                        {
                          required: true,
                          validator: (val, callback) => {
                            handleValidateValue(val, callback, cIndex);
                          },
                        },
                      ]"
                    >
                      <span v-if="cItem.operator === 'withinRange'">
                        <a-slider
                          v-model="cItem.value"
                          :step="0.1"
                          :min="getConditionValueRange(cItem, 'min')"
                          :max="getConditionValueRange(cItem, 'max')"
                          :style="{
                            'width': '200px',
                            'margin-left': '10px',
                            'display': 'inline-block',
                          }"
                          range
                        />
                        <span
                          style="display: inline-block; margin-left: 10px"
                          >{{ handleSliderChange(cItem) }}</span
                        >
                      </span>
                      <RangeInput
                        v-else-if="cItem.operator === 'versionWithinRange'"
                        v-model="cItem.value"
                        @change="(val) => handleVersionChange(val, cIndex)"
                      >
                      </RangeInput>
                      <a-input-number
                        v-else-if="
                          getConditionData(cItem)?.valueType === 'number'
                        "
                        v-model="cItem.value"
                        :min="0"
                        :disabled="!cItem.operator"
                      ></a-input-number>
                      <div
                        v-else-if="getConditionValueOptions(cItem).length"
                        style="flex: 1"
                      >
                        <a-select
                          v-model="cItem.value"
                          allow-search
                          class="condition-value-opts"
                          :disabled="!cItem.operator"
                          :max-tag-count="2"
                          allow-clear
                          :multiple="multipleOperator.includes(cItem.operator)"
                        >
                          <a-option
                            v-for="(vItem, vIndex) in getConditionValueOptions(
                              cItem
                            )"
                            :key="vIndex"
                            :value="vItem.value"
                            :label="setLabel(vItem.label)"
                          ></a-option>
                          <template #empty><span></span></template>
                        </a-select>
                      </div>
                      <!-- inputOperator.includes(cItem.operator) -->
                      <a-input
                        v-else
                        v-model="cItem.value"
                        :disabled="!cItem.operator"
                      ></a-input>
                    </a-form-item>
                  </a-space>
                  <a-space
                    v-if="!builtInDisabled"
                    class="icon-btn-wrap"
                    :class="{ single: conditionHasOperator(cItem) }"
                  >
                    <icon-plus-circle-fill
                      v-show="
                        cIndex === conditionsLength - 1 &&
                        policyCategoryConditionList.length > 1
                      "
                      @click="handleAddCondition"
                    />
                    <span
                      v-show="
                        !(
                          cIndex === conditionsLength - 1 &&
                          policyCategoryConditionList.length > 1
                        )
                      "
                      class="holder-el"
                    ></span>
                    <icon-minus-circle-fill
                      v-show="showMinusButton"
                      @click="handleDeleteCondition(cIndex)"
                    />
                  </a-space>
                </a-space>
                <a-divider
                  v-show="cIndex !== formData.constraint.conditions.length - 1"
                  style="margin-top: 0"
                ></a-divider>
              </div>
            </div>
          </div>
        </div>
        <div id="policy-formdata-expr">
          <div v-if="format === 'expr'" class="expr-wrap">
            <div class="container-wrap" :class="{ expr: format === 'expr' }">
              <a-form-item
                class="small-form-item"
                field="expression"
                :rules="[
                  {
                    required: true,
                    message: testFail
                      ? testFail
                      : $t('policy.detail.rules.expression'),
                  },
                ]"
              >
                <slCompleter
                  v-model="formData.expression"
                  :source="completerData"
                  :disabled="!!expressionEditable"
                  @click="handleClickDisable"
                  @input="handleExpressionInput"
                ></slCompleter>
                <template #extra>
                  <div>
                    <div
                      >{{ $t('policy.detail.edit.exprRef') }}：<a-link
                        href="https://github.com/seal-io/seal-doc"
                        target="_blank"
                        >https://github.com/seal-io/seal-doc</a-link
                      ></div
                    >
                    <a-space direction="vertical" :size="10">
                      <div v-show="!!testFail" class="test-fail">{{
                        testFail
                      }}</div>
                      <a-button
                        type="outline"
                        size="small"
                        class="test-btn"
                        @click.stop="handleTest"
                      >
                        <template #icon>
                          <icon-loading
                            v-show="testLoading"
                            style="font-size: 16px"
                          />
                          <icon-check-circle
                            v-show="testSuccess"
                            style="color: rgb(0, 180, 42); font-size: 16px"
                          />
                        </template>
                        {{ $t('policy.button.test') }}</a-button
                      >
                    </a-space>
                  </div>
                </template>
              </a-form-item>
            </div>
            <!-- <div
              v-show="keys(completerData).length"
              id="policy-field-map"
              class="policy-field-map"
            >
              <highlightBlock
                :code="JSON.stringify(completerData, null, 2)"
                lang-type="json"
              ></highlightBlock>
            </div> -->
          </div>
        </div>
        <div v-if="category !== 'whiteList'" class="label">{{
          $t('policy.detail.action')
        }}</div>
        <a-form-item
          v-if="category !== 'whiteList'"
          :disabled="category === 'whiteList'"
          :label="$t('policy.detail.action')"
          field="actions"
          :rules="[
            { required: true, message: $t('policy.detail.rules.action') },
          ]"
        >
          <a-select v-model="formData.action">
            <a-option
              v-for="item in normalActionList"
              :key="item.value"
              :value="item.value"
              :label="$t(item.label)"
            ></a-option>
          </a-select>
        </a-form-item>
        <a-form-item class="edit-footer-wrap" :disabled="false">
          <EditPageFooter>
            <template #save>
              <a-button
                :loading="submitLoading"
                type="primary"
                class="cap-title-save save-btn"
                @click="handleSubmit"
                >{{ $t('common.button.save') }}</a-button
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
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import qs from 'query-string';
  import {
    each,
    get,
    keys,
    map,
    join,
    hasIn,
    split,
    cloneDeep,
    assignIn,
    lowerFirst,
    isNumber,
    toString,
    toNumber,
    trim,
    isEqual,
    some,
  } from 'lodash';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import RangeInput from '@/components/range-input/index.vue';
  import { globalModal } from '@/hooks/global-modal';
  import localStore from '@/utils/localStore';
  import { initDriver } from '@/utils/driver';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import { reactive, ref, computed, onMounted, nextTick } from 'vue';
  import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { commonRequestList } from '@/api/commonListRequest';
  import {
    getPolicyConfigSchmas,
    createPolicy,
    updatePolicy,
    checkExpression,
    queryPolicyDetail,
  } from '@/api/policy';
  import { queryPolicyList } from '@/views/intergration/api/policy-list';
  import { repoIcon } from '@/views/intergration/config';
  import slCompleter from '@/components/sl-completer/index.vue';
  import highlightBlock from '@/components/highlight-block/index.vue';
  import {
    typeMap,
    levelList,
    scopeTypeList,
    allScopeList,
    constraintsTypeList,
    partialScopeList,
    actionList,
    policyTypeCategory,
    operatorMapToValueType,
    inputOperator,
    categoryList,
    numberConditionMap,
  } from '../config';
  import {
    ConditionItem,
    FormDataType,
    ConditionCategoryPropertiesType,
    OperatorItemConfig,
    ConditionItemConfig,
    CategoryItemConfig,
    ProjectItem,
  } from '../config/interface';
  import { steps } from '../config/driver-config';
  import { usePluginPolicy } from '../hooks/use-plugin-policy';
  // import policyConditionData from '../config/policy-condition-data';
  // import policyExpressData from '../config/policy-express-data';

  type ConditionOptions = {
    label: string;
    value: string | number;
  };
  type usedInScopeType = 'all' | 'partial' | 'tags';
  const pageKey = 'POLICY_DRIVER_KEY';
  const route = useRoute();
  const router = useRouter();
  const { t, locale } = useI18n();
  const { getPluginPolicySchemas } = usePluginPolicy();
  // multiple operator
  const multipleOperator = ['in', 'notin'];
  const arrayOperator = ['in', 'notin', 'withinRange', 'versionWithinRange'];
  const validateArrayValueOperator = ['versionWithinRange'];
  const submitLoading = ref(false);
  const testLoading = ref<boolean>(false);
  const testSuccess = ref<boolean>(false);
  const testFail = ref('');
  const format = ref<string>('form');
  const formref = ref();
  const useInScope = ref<usedInScopeType>('all');
  const { category } = route.params;
  const { policyId } = route.query;
  const conditionList = ref<CategoryItemConfig[]>([]);
  const projectsList = ref<ProjectItem[]>([]);
  const proxiesUsedList = ref<ProjectItem[]>([]);
  const expressionKeysMap = reactive({});
  let configSchmasData = reactive({});
  let copyFormData: any = {};
  const formData: FormDataType = reactive({
    severity: route.params.category === 'whiteList' ? 'low' : '',
    action: route.params.category === 'whiteList' ? 'permit' : 'block',
    name: '',
    category: route.params.category === 'whiteList' ? 'sca' : category,
    tagsText: '',
    type: '',
    enabled: true,
    description: '',
    scopeAll: '',
    scopePartial: '',
    bindings: {
      isAllProxy: false,
      isAllResource: false,
      tags: [],
      proxyIDs: [],
      repositoryIDs: [],
    },
    expression: '',
    constraint: {
      operator: 'AND',
      conditions: [{ conditionType: '', value: '', operator: '' }],
    },
  });
  // computed====start
  const builtInDisabled = computed(() => {
    return !!policyId && formData.builtIn;
  });
  const expressionEditable = computed(() => {
    return formData.builtIn || !formData.type;
  });
  const normalActionList = computed(() => {
    const list = actionList.filter((item) => {
      return item.value !== 'permit';
    });
    return list;
  });
  const lang = computed(() => {
    return locale.value === 'zh-CN' ? 'zh-cn' : 'en';
  });
  const categoriesList = computed(() => {
    const key = formData.category as string;
    const list = policyTypeCategory[key] || [];
    if (category === 'whiteList' && key === 'sast') {
      return list.filter((item) => item.type !== 'sast');
    }
    if (category === 'sast') {
      return list.filter((item) => item.type !== 'whiteList');
    }
    return list;
  });
  const conditionsLength = computed(() => {
    return formData.constraint.conditions.length;
  });
  const showMinusButton = computed(() => {
    return formData.constraint.conditions.length > 1;
  });
  const policyCategoryConditionList = computed(() => {
    const categoryData = conditionList.value.find((item) => {
      return item.category === formData.type;
    });
    return categoryData?.conditions || [];
  });
  const completerData = computed(() => {
    return (
      get(expressionKeysMap, `${formData.category}.${formData.type}`) || {}
    );
  });
  // setlabel
  const setLabel = (text) => {
    const localeText = get(typeMap, `${lowerFirst(text)}`);
    if (localeText) return t(localeText);
    console.log('locale==', localeText);
    return text;
  };
  // computed=====end
  const handleValidateConditionType = (value, callback, index) => {
    value = get(formData, `constraint.conditions.${index}.conditionType`);
    if (!value) {
      callback(t('policy.detail.rules.conditionType'));
    } else {
      callback();
    }
  };
  const handleValidateOperator = (value, callback, index) => {
    value = get(formData, `constraint.conditions.${index}.operator`);
    if (!value) {
      callback(t('policy.detail.rules.operator'));
    } else {
      callback();
    }
  };
  const handleValidateValue = (value, callback, index) => {
    value = get(formData, `constraint.conditions.${index}.value`);
    const operator = get(formData, `constraint.conditions.${index}.operator`);
    // console.log('validateValue====', value);
    if (!value && value !== 0) {
      callback(t('policy.detail.rules.condition.value'));
    } else if (
      validateArrayValueOperator.includes(operator) &&
      some(value, (v) => !v)
    ) {
      callback(t('policy.detail.rules.version'));
    } else {
      callback();
    }
  };
  const handleToImportRepo = () => {
    router.push({
      name: 'projectsList',
    });
  };
  const handleToSetProxy = () => {
    router.push({
      name: 'allIntegration',
    });
  };
  const handleExpressionInput = () => {
    console.log('expressioninput:', formData.expression);
  };
  const handleClickDisable = () => {
    if (!formData.builtIn && !formData.type) {
      globalModal({
        contentText: 'policy.detail.edit.tips',
      });
    }
  };
  const handleFormatChange = (val) => {
    if (val === 'form' && !formData.constraint) {
      formData.constraint = {
        operator: 'AND',
        conditions: [{ conditionType: '', value: '', operator: '' }],
      };
    }
  };
  const handleTagsChange = (value) => {
    formData.bindings.tags = split(value, ';') || [];
  };

  const getConditionData = (item) => {
    const conditionData = policyCategoryConditionList.value.find((s) => {
      return s.conditionType === item.conditionType;
    });
    return conditionData;
  };
  const handleVersionChange = (val, cIndex) => {};
  const handleItemOperatorChange = (val, item) => {
    if (
      val === 'withinRange' &&
      (!item.value || join(item.value, ',') === '0,0')
    ) {
      const conditionData = getConditionData(item);
      const max = get(conditionData, 'max') || 0;
      const min = get(conditionData, 'min') || 0;
      item.value = [min, max];
      return [min, max];
    }
    return '';
  };
  const handleTypeChange = (val) => {
    console.log('formType:', val);
    formData.constraint.conditions.length = 1;
    setTimeout(() => {
      const conditionData = get(policyCategoryConditionList.value, '0') || {};
      each(formData.constraint.conditions, (item) => {
        item.conditionType = conditionData.conditionType;
        item.operator = get(conditionData, 'operatorConfigs.0.value');
        item.value = '';
      });
    }, 100);
  };
  const getOperatorList = (item) => {
    const conditionData = getConditionData(item);
    return get(conditionData, 'operatorConfigs') || [];
  };
  const getConditionValueOptions = (item) => {
    const conditionData = getConditionData(item);
    let valueOptions: ConditionOptions[] = [];
    valueOptions = get(conditionData, 'valueConfigs') || [];
    console.log('valueOptions===', valueOptions, item);
    return valueOptions;
  };
  const handleConditionTypeChange = (value, index, item) => {
    const operatorList = getOperatorList(item);
    const operator = get(operatorList, '0.value');
    formData.constraint.conditions[index].operator = '';
    formData.constraint.conditions[index].value = '';
    if (operatorList.length) {
      formData.constraint.conditions[index].operator = operator;
    }
    if (operator === 'withinRange') {
      formData.constraint.conditions[index].value = handleItemOperatorChange(
        operator,
        item
      );
    }
  };
  const conditionHasOperator = (item) => {
    const conditionData = getConditionData(item);
    return conditionData?.hasOperator;
  };
  const getConditionDescript = (item) => {
    const conditionData = getConditionData(item);
    return setLabel(conditionData?.description);
  };
  const getConditionValueRange = (item, type) => {
    const conditionData = getConditionData(item);
    if (type === 'min') return conditionData?.min || 0;
    return conditionData?.max || 0;
  };
  const handleSliderChange = (cItem) => {
    const val = cloneDeep(cItem.value);
    val.sort((a, b) => a - b);
    return join(val, ',');
  };

  const handleAddCondition = () => {
    formData.constraint.conditions.push({
      conditionType: '',
      value: '',
      operator: '',
    });
  };
  const handleDeleteCondition = (index) => {
    formData.constraint.conditions.splice(index, 1);
  };
  const setPolicyConditionConfig = (policyConditionData = {}) => {
    // {sca:  {}, sast: {}, configuration: {}}
    const policyCondition =
      get(
        policyConditionData,
        'components.schemas.policyCondition.properties'
      ) || {};
    const policyCategoryData =
      get(policyCondition, `${formData.category}.properties`) || {};
    // conditionList
    conditionList.value = map(keys(policyCategoryData), (key) => {
      const data = policyCategoryData[key] || {};
      const conditions = get(data, 'properties') || {};
      // conditions: vulnerabilitySeverity、vulnerabilityCVS3Score
      const arr: Array<ConditionItemConfig> = map(
        // set operator
        keys(conditions),
        (conditionKey) => {
          const conditionData = conditions[conditionKey] || {};
          const operatorConfigs =
            get(conditionData, 'properties.operator.enum') || [];
          const hasOperator = hasIn(conditionData, 'properties.operator');
          // operator
          const list: Array<OperatorItemConfig> = map(
            operatorConfigs,
            (operator) => {
              return {
                valueType: operatorMapToValueType[operator] || 'string',
                value: operator,
                label: operator,
              };
            }
          );
          const valueConfigs =
            get(conditionData, 'properties.value.enum') || [];
          return {
            conditionType: conditionKey,
            description:
              get(conditions[conditionKey] || {}, 'description') || '',
            valueConfigs: map(valueConfigs, (o) => {
              return {
                label: o,
                value: o,
              };
            }),
            hasOperator,
            label: `policy.${key}.condition.${conditionKey}`,
            min: get(conditionData, 'properties.value.minimum') || 0,
            max: get(conditionData, 'properties.value.maximum') || 0,
            valueType: get(conditionData, 'properties.value.type'),
            operatorConfigs: list,
            api: get(conditionData, 'properties.value.$ref') || '',
            resultPath:
              get(conditionData, 'properties.value.description') || '',
          };
        }
      );
      return {
        category: key,
        description: data.description,
        conditions: arr,
      };
    });
    console.log('conditionList==', conditionList.value);
  };
  const getKeysMap = (obj, keysMap) => {
    const properties = get(obj, 'properties');
    if (!properties) return;
    keys(properties).forEach((key) => {
      const data = get(properties, `${key}`);
      keysMap[key] = get(data, 'properties') ? {} : '';
      if (data) {
        getKeysMap(data, keysMap[key]);
      }
    });
  };
  const setPolicyExpressionConfig = (policyExpressData = {}) => {
    const policyExpression =
      get(policyExpressData, 'components.schemas.policyExpressionInput') || {};
    getKeysMap(policyExpression, expressionKeysMap);
    console.log('expression===', expressionKeysMap);
  };
  const handleScopePartialChange = () => {
    formData.scopePartial =
      formData.bindings.repositoryIDs?.length ||
      formData.bindings.proxyIDs?.length
        ? '1'
        : '';
  };
  const handleScopeAllChange = () => {
    formData.scopeAll =
      formData.bindings.isAllProxy || formData.bindings.isAllResource
        ? '1'
        : '';
  };
  const setUseInScope = () => {
    let scope = 'all';
    const proxyIDs = formData.bindings.proxyIDs || [];
    const repositoryIDs = formData.bindings.repositoryIDs || [];
    if (formData.bindings?.tags && formData.bindings.tags.length) {
      scope = 'tags';
    } else if (proxyIDs.length || repositoryIDs.length) {
      scope = 'partial';
    } else if (
      formData.bindings.isAllProxy ||
      formData.bindings.isAllResource
    ) {
      scope = 'all';
    }
    handleScopePartialChange();
    handleScopeAllChange();
    format.value = formData.expression ? 'expr' : 'form';
    useInScope.value = scope as usedInScopeType;
  };
  const saveFormData = async (data) => {
    submitLoading.value = true;
    if (!policyId) {
      await createPolicy(data);
    } else {
      await updatePolicy(data);
    }
    submitLoading.value = false;
    router.back();
  };
  const validateExpression = async (data) => {
    testLoading.value = true;
    testSuccess.value = false;
    try {
      await checkExpression(data);
      testLoading.value = false;
      testFail.value = '';
      testSuccess.value = true;
    } catch (error: any) {
      testSuccess.value = false;
      testFail.value = error.msg as string;
      testLoading.value = false;
      console.log('testFail:', testFail.value);
    }
  };
  const setValuebeforeSubmit = () => {
    const dataInfo = cloneDeep(formData);
    // setbindings
    dataInfo.bindings.tags = split(get(dataInfo, 'tagsText'), ',');
    if (useInScope.value === 'all') {
      dataInfo.bindings.tags = [];
      dataInfo.bindings.repositoryIDs = [];
      dataInfo.bindings.proxyIDs = [];
    }
    if (useInScope.value === 'partial') {
      dataInfo.bindings.tags = [];
      dataInfo.bindings.isAllProxy = false;
      dataInfo.bindings.isAllResource = false;
    }
    if (useInScope.value === 'tags') {
      dataInfo.bindings.repositoryIDs = [];
      dataInfo.bindings.proxyIDs = [];
      dataInfo.bindings.isAllProxy = false;
      dataInfo.bindings.isAllResource = false;
    }
    // set conditions
    if (format.value === 'form') {
      dataInfo.constraint.conditions.forEach((item) => {
        if (item.operator === 'withinRange') {
          const list = item.value as Array<number>;
          item.value = list.sort((a, b) => a - b);
        }
        item.value = Array.isArray(item.value)
          ? item.value.join(',')
          : item.value;
        item.value = isNumber(item.value) ? toString(item.value) : item.value;
      });
    } else {
      dataInfo.constraint = null as never;
      dataInfo.expression = trim(dataInfo.expression);
    }
    return dataInfo;
  };
  const handleSubmit = async () => {
    const res = await formref.value.validate();
    if (!res) {
      copyFormData = cloneDeep(formData);
      const dataInfo = setValuebeforeSubmit();
      try {
        saveFormData(dataInfo);
      } catch (error) {
        submitLoading.value = false;
        console.log(error);
      } finally {
        submitLoading.value = false;
      }
    }
  };
  const handleTest = async () => {
    const res = await formref.value.validateField('expression');
    if (!res) {
      const dataInfo = setValuebeforeSubmit();
      try {
        validateExpression(dataInfo);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleCancel = () => {
    router.back();
  };
  const setFormDataValue = (obj) => {
    const data = cloneDeep(obj);
    data.tagsText = split(get(data, 'bindings.tags'), ',');
    each(get(data, 'constraint.conditions'), (item) => {
      if (arrayOperator.includes(item.operator)) {
        item.value = split(item.value, ',');
      }
      if (get(numberConditionMap, `${item.conditionType}`)) {
        item.value = item.value ? toNumber(item.value) : item.value;
      }
    });
    return data;
  };
  const fetchData = async () => {
    if (!policyId) return;
    const params = {
      id: policyId as string,
    };
    const { data } = await queryPolicyDetail(params);
    const obj = setFormDataValue(data);
    assignIn(formData, obj);
    setUseInScope();
  };
  const getProjectsList = async () => {
    const api = '/repositories';
    const { data } = await commonRequestList(api);
    const list = get(data, 'items') || [];
    projectsList.value = map(list, (item) => {
      return {
        value: item.id,
        label: item.fullName,
        provider: item.provider,
      };
    });
  };
  const fetchProxyList = async () => {
    try {
      const { data } = await queryPolicyList();
      const list = data.items || [];
      proxiesUsedList.value = map(list, (item) => {
        return {
          value: item.id,
          label: item.name,
          provider: item.type,
        };
      });
    } catch (error) {
      console.log(error);
      proxiesUsedList.value = [];
    }
  };
  const initConfigData = () => {
    copyFormData = cloneDeep(formData);
    getProjectsList();
    fetchProxyList();
  };
  const setValuesConfigsFromApi = () => {
    each(conditionList.value, (item) => {
      item.conditions = get(item, 'conditions') || [];
      each(item.conditions, async (sItem) => {
        if (!sItem.api) {
          sItem.valueConfigs = get(sItem, 'valueConfigs') || [];
        }
        if (sItem.api) {
          const model = qs.parse(sItem.resultPath || '') || {};
          const { data } = await commonRequestList(sItem.api);
          const list = get(data, 'items') || [];
          sItem.valueConfigs = map(list, (pItem) => {
            return {
              label: get(pItem, `${model.label}`) as string,
              value: get(pItem, `${model.value}`) as string,
            };
          });
        }
      });
    });
  };
  const handleCategoryChange = () => {
    setTimeout(() => {
      formData.type = get(categoriesList.value, '0.value');
    });
    handleTypeChange(formData.type);
    setPolicyConditionConfig(configSchmasData);
    setPolicyExpressionConfig(configSchmasData);
    setValuesConfigsFromApi();
  };
  const fetchComponentsSchemas = async () => {
    const { data } = await getPolicyConfigSchmas();
    configSchmasData = data;
    setPolicyConditionConfig(configSchmasData);
    setPolicyExpressionConfig(configSchmasData);
  };
  const showExpression = () => {
    format.value = 'expr';
  };
  const showForm = () => {
    format.value = 'form';
  };
  const getDriverExpire = async () => {
    // localStore.removeValue(pageKey)
    const d = await localStore.getValue(pageKey);
    console.log('isExpiration=======d', d);
    if (!d) {
      localStore.setValue(pageKey, 'policy', null, 7);
      return true;
    }
    if (get(d, 'isExpiration')) {
      localStore.setValue(pageKey, 'policy', null, 7);
    }
    return get(d, 'isExpiration');
  };
  const driverReset = () => {
    setTimeout(() => {
      showForm();
      document.body.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  const runDriver = async () => {
    if (policyId) return;
    const isExpiration = await getDriverExpire();
    console.log('isExpiration===', isExpiration);
    // is valid
    if (!isExpiration) return;
    const isWhite = category === 'whiteList';
    const driver = initDriver(steps, {
      showExpression,
      showForm,
      onReset: driverReset,
      isWhite,
    });
    driver.start();
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
    await fetchData();
    await fetchComponentsSchemas();
    initConfigData();
    nextTick(() => {
      setValuesConfigsFromApi();
      runDriver();
    });
    await getPluginPolicySchemas({ category: formData.category });
  });
</script>

<style lang="less" scoped>
  .policy-edit.container {
    :deep(.arco-card-body) {
      padding: 20px;
    }

    .expr-wrap {
      position: relative;
      // padding-right: 350px;
      .policy-field-map {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 350px;
        padding: 0 10px;
        overflow-y: hidden;
        background-color: var(--color-fill-2);
      }

      :deep(.high-light-wrapper) {
        position: absolute;
        top: 10px;
        bottom: 10px;
        width: 330px;
        overflow-y: auto;

        pre {
          margin: 0;
        }

        .hljs {
          height: max-content;
          background: #fff;
        }
      }
    }

    :deep(.arco-slider-bar) {
      height: 6px;
    }

    :deep(.arco-slider-track::before) {
      height: 6px;
    }

    .test-fail {
      color: rgb(var(--danger-6));
    }

    :deep(.arco-btn) {
      &.test-btn {
        .arco-btn-icon {
          margin-right: 0;
        }
      }
    }

    :deep(.arco-form-item) {
      &.format-item {
        margin-bottom: 0;
      }
    }

    .icon-btn-wrap {
      margin-bottom: 20px;

      .holder-el {
        display: inline-block;
        width: 22px;
        height: 22px;
      }
    }

    pre {
      font-family: inherit;
    }

    .cap-title-save {
      width: 96px;
    }

    .btn-space {
      justify-content: center;
      margin-top: 60px;
    }

    .label {
      margin-top: 20px;
      margin-bottom: 20px;
      padding-bottom: 10px;
      color: var(--color-text-2);
      font-weight: 500;
      border-bottom: 1px solid var(--seal-border-gray);

      &:first-child {
        margin-top: 0;
      }
    }

    .arco-checkbox {
      .repo-icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 5px;
        vertical-align: -4px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
      }
    }

    :deep(.arco-form) {
      // .arco-textarea {
      //   box-sizing: border-box;
      //   width: 500px;
      // }
      .extenal-link {
        text-align: center;
      }

      .arco-checkbox {
        .repo-icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-right: 5px;
          vertical-align: -4px;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: contain;
        }
      }

      .desc.arco-textarea-wrapper {
        width: 360px;

        .arco-textarea {
          width: 360px;
        }
      }

      .text-block {
        box-sizing: border-box;
        width: 500px;
        padding: 12px;
        font-size: 12px;
        background-color: var(--color-fill-1);
      }

      .row-text {
        line-height: 18px;
        text-indent: 10px;
      }

      .conditions-box {
        padding: 0;
        border: 1px solid var(--color-border-1);
        border-radius: 4px;

        &.en-lang {
          margin-left: 97px;
        }

        .arco-select-view {
          // background-color: #fff;
        }

        .condition-row {
          padding: 0 12px;
        }

        .arco-icon-minus-circle-fill,
        .arco-icon-plus-circle-fill {
          // margin-bottom: 15px;
          color: var(--sealblue-6);
          font-size: 22px;
          cursor: pointer;
        }

        .small-form-item {
          .arco-select-view {
            width: 280px;
          }

          .arco-input-wrapper {
            flex: 1;
            width: 100%;
          }
        }

        &.operator {
          .arco-select-view {
            width: 110px;
          }
        }

        .arco-space-fill.condition-row-space {
          > .arco-space-item:nth-child(2) {
            flex: 1;
            max-width: 500px;
          }

          .condition-value-opts {
            flex: 1;
            width: 100%;
          }
        }

        .arco-space-fill.condition-op-val {
          > .arco-space-item:nth-child(2) {
            flex: 1;
          }
        }
      }

      .arco-input-wrapper {
        width: 360px;
      }

      .small-form-item {
        .arco-select-view {
          width: 180px;
        }

        &.operator {
          .arco-select-view {
            width: 180px;
          }
        }
      }

      .arco-form-item.no-bottom-gap {
        margin-bottom: 10px;
      }

      .item-text {
        margin-left: 8px;
      }

      .container-wrap {
        margin-left: 58px;

        &.en-lang {
          margin-left: 91px;
        }

        &.expr {
          margin-left: 0;
        }
        // background-color: var(--color-fill-2);
      }

      .arco-select-view-single {
        width: 360px;
      }

      .arco-form-item-label-col {
        padding-right: 10px;
      }

      .arco-form-item.condition-type {
        .arco-form-item-label-col {
          flex: auto !important;
          justify-content: flex-start;
        }

        &.condition-opts {
          padding: 5px 12px;
          background-color: var(--color-fill-3);

          .arco-select-view {
            background-color: #fff;
          }
        }
      }

      .arco-form-item-label {
        font-size: 12px;
      }

      .arco-checkbox {
        font-size: 12px;
      }

      .arco-select-view {
        width: 360px;
        font-size: 12px;
      }

      .s-label {
        color: var(--color-text-2);
        font-size: 12px;
      }

      .arco-radio-label {
        font-size: 12px;
      }
    }
  }
</style>
