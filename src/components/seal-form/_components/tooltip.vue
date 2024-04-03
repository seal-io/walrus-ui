<script lang="tsx">
  import i18n from '@/locale';
  import { defineComponent } from 'vue';

  interface Attrs {
    doc?: {
      description: string;
      url: string;
    };
    popupInfo?: string;
    [key: string]: any;
  }

  export default defineComponent({
    setup(props, ctx) {
      const attrs = ctx.attrs as Attrs;
      const popupInfo = attrs.popupInfo || attrs['popup-info'];
      return () => (
        <>
          {popupInfo || attrs.doc ? (
            <a-tooltip
              content={popupInfo}
              trigger="hover"
              v-slots={{
                content: () => {
                  if (!attrs.doc) {
                    return <span>{popupInfo}</span>;
                  }
                  return (
                    <>
                      <div>{popupInfo}</div>
                      <div>
                        <div>{attrs.doc?.description}</div>
                        <div class="align-right">
                          <a-link
                            href={attrs.doc?.url}
                            class="m-l-2"
                            target="_blank"
                            style="background-color: var(--color-white)"
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
