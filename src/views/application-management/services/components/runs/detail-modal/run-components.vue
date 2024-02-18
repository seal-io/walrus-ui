<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, ref, computed } from 'vue';
  import i18n from '@/locale';
  import FilterBox from '@/components/filter-box/index.vue';
  import ComponentList from './component-list.vue';
  import { RevisionStatus } from '../../../config';

  export default defineComponent({
    name: 'RunComponents',
    props: {
      runData: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    setup(props, ctx) {
      const query = ref('');

      const dataList = computed(() => {
        if (!query.value) {
          return props.runData?.componentChanges || [];
        }
        return _.filter(props.runData?.componentChanges || [], (item) => {
          return item.name.includes(query.value);
        });
      });
      const handleSearch = () => {
        console.log('search', query.value);
      };

      const renderNoChanges = () => {
        if (props.runData.status?.summaryStatus === RevisionStatus.Planning) {
          return i18n.global.t('resource.revisons.components.changes');
        }
        return i18n.global.t('resource.revisons.components.nochanges');
      };
      return () => (
        <div>
          <FilterBox
            style={{ marginBottom: '10px' }}
            v-slots={{
              params: () => {
                return (
                  <>
                    <a-input
                      v-model={query.value}
                      allow-clear
                      style={{ width: '360px' }}
                      placeholder={i18n.global.t(
                        'common.search.name.placeholder'
                      )}
                      onClear={() => handleSearch()}
                      onPress-enter={() => handleSearch()}
                      v-slots={{
                        prefix: () => <icon-search />
                      }}
                    ></a-input>
                  </>
                );
              }
            }}
          ></FilterBox>
          <ComponentList
            dataList={dataList.value}
            v-slots={{
              empty: () => {
                return (
                  <result-view
                    v-slots={{
                      icon: () => {
                        return (
                          <>
                            {query.value ? (
                              <icon-find-replace />
                            ) : (
                              <icon-subscribe-add />
                            )}
                          </>
                        );
                      }
                    }}
                    title={
                      query.value
                        ? i18n.global.t('common.result.nodata.title', {
                            type: i18n.global.t(
                              'applications.instance.tab.resource'
                            )
                          })
                        : renderNoChanges()
                    }
                  ></result-view>
                );
              }
            }}
          ></ComponentList>
        </div>
      );
    }
  });
</script>
