<script lang="tsx">
  import { defineComponent, ref, computed } from 'vue';
  import i18n from '@/locale';
  import FilterBox from '@/components/filter-box/index.vue';
  import ComponentList from './component-list.vue';

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
      // const dataList = ref([
      //   {
      //     id: 1,
      //     name: 'test1',
      //     type: 'kubernetes',
      //     changeType: 'update'
      //   },
      //   {
      //     id: 2,
      //     name: 'test2',
      //     type: 'kubernetes',
      //     changeType: 'change'
      //   },
      //   {
      //     id: 3,
      //     name: 'test3',
      //     type: 'kubernetes',
      //     changeType: 'remove'
      //   }
      // ]);
      const dataList = computed(() => {
        return props.runData?.componentChanges || [];
      });
      const handleSearch = () => {
        console.log('search', query.value);
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
          <ComponentList dataList={dataList.value}></ComponentList>
        </div>
      );
    }
  });
</script>
