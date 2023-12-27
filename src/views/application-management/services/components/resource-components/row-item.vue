<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent } from 'vue';
  import ComponentItem from './component-item.vue';

  export default defineComponent({
    props: {
      rowData: {
        type: Object,
        default: () => ({})
      },
      index: {
        type: Number,
        default: 0
      }
    },
    setup(props, { slots }) {
      const renderComponentItem = () => {
        return (
          <ComponentItem
            rowData={props.rowData}
            index={props.index}
            v-slots={{
              status: () => {
                return <>{slots?.status?.({ record: props.rowData })}</>;
              },
              actions: () => {
                return (
                  <>
                    {slots?.actions?.({
                      record: props.rowData,
                      rowIndex: props.index
                    })}
                  </>
                );
              }
            }}
          ></ComponentItem>
        );
      };

      const renderComponentChildren = () => {
        if (!props.rowData.children?.length) return null;
        return (
          <div class="children">
            {_.map(props.rowData.children, (item, cIndex) => {
              return (
                <ComponentItem
                  rowData={item}
                  index={Number(cIndex)}
                  treeLine={true}
                  isChildren={true}
                  key={cIndex}
                  v-slots={{
                    name: () => {
                      return (
                        <>
                          <i class="iconfont icon-node m-r-4"></i>
                          {item.name}
                        </>
                      );
                    },
                    status: () => {
                      return <>{slots?.status?.({ record: item })}</>;
                    },
                    actions: () => {
                      return (
                        <>
                          {slots?.actions?.({
                            record: item,
                            rowIndex: cIndex
                          })}
                        </>
                      );
                    }
                  }}
                ></ComponentItem>
              );
            })}
          </div>
        );
      };
      return () => (
        <>
          {renderComponentItem()}
          {renderComponentChildren()}
        </>
      );
    }
  });
</script>
