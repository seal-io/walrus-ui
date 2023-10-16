<script lang="tsx">
  import { defineComponent, inject } from 'vue';
  import i18n from '@/locale';
  import { moreMenu } from '../config';

  export default defineComponent({
    setup() {
      const { t } = i18n.global;
      const getGraph: any = inject('getGraph');
      const getNode: any = inject('getNode');

      const handleRemoveNode = () => {
        const graph = getGraph();
        const node = getNode();
      };
      const handleMoreMenuClick = (val) => {
        switch (val) {
          case 'remove':
            handleRemoveNode();
            break;
          default:
            break;
        }
      };
      return () => {
        return (
          <a-dropdown
            onSelect={handleMoreMenuClick}
            v-slots={{
              content: () => {
                return (
                  <>
                    {moreMenu.map((item) => {
                      return (
                        <a-doption value={item.value}>
                          <a-link type="text" status={item.status}>
                            <i class={['iconfont', 'mright-5', item.icon]} />
                            <span class="node-item-name">{t(item.label)}</span>
                          </a-link>
                        </a-doption>
                      );
                    })}
                  </>
                );
              }
            }}
          >
            <i class="more-action iconfont icon--more" />
          </a-dropdown>
        );
      };
    }
  });
</script>
