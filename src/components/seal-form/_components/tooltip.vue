<script lang="tsx">
  import i18n from '@/locale';
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup(props, { attrs }) {
      return () => (
        <>
          {attrs.popupInfo || attrs.doc ? (
            <a-tooltip
              content={attrs.popupInfo}
              v-slots={{
                content: () => {
                  if (!attrs.doc) {
                    return <span>{attrs.popupInfo}</span>;
                  }
                  return (
                    <>
                      <div>{attrs.popupInfo}</div>
                      <div>
                        <div>{attrs.doc?.description}</div>
                        <div class="align-right">
                          <a-link
                            href={attrs.doc?.url}
                            class="m-l-2"
                            target="_blank"
                            style="background-color: #fff"
                          >
                            {i18n.global.t('common.docs.link.tips')}
                          </a-link>
                        </div>
                      </div>
                    </>
                  );
                }
              }}
            >
              <icon-info-circle
                style="stroke-linecap: initial; cursor: default"
                class="m-l-2"
              />
            </a-tooltip>
          ) : null}
        </>
      );
    }
  });
</script>
