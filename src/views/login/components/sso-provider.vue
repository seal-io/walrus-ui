<script lang="tsx">
  import { defineComponent, ref, onMounted } from 'vue';
  import ProviderIcon from '@/components/provider-icon/index.vue';

  export default defineComponent({
    name: 'SsoProvider',
    props: {
      providers: {
        type: Array,
        default: () => []
      }
    },
    emits: ['select'],
    setup(props, { emit }) {
      const handleSelectType = (type, item) => {
        console.log('type', type);
        emit('select', type, item);
      };
      return () => (
        <div class="wrapper">
          <a-button
            class="password"
            type="primary"
            long
            onClick={() => handleSelectType('password', {})}
            v-slots={{
              icon: () => <icon-lock />
            }}
          >
            Login with password
          </a-button>
          <a-divider margin={45}>Or</a-divider>
          <div class="box">
            {props.providers.map((provider: any) => (
              <a-button
                key={provider.value}
                class="item"
                onClick={() => handleSelectType(provider.value, provider)}
                v-slots={{
                  icon: () => (
                    <ProviderIcon provider={provider.icon} size={28} />
                  )
                }}
              >
                <span class="text">{provider.label}</span>
              </a-button>
            ))}
          </div>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .password {
    height: 48px;
    margin: 30px 0;
    margin-top: 50px;
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-large);
    text-align: center;
  }

  .box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: max-content;

    .item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-right: 30px;
      cursor: pointer;

      &:last-child {
        margin-right: 0;
      }

      .text {
        margin-left: 8px;
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-large);
      }
    }
  }
</style>
