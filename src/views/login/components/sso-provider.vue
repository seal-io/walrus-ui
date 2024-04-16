<script lang="tsx">
  import { defineComponent, ref, onMounted } from 'vue';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import { LoginTypeMap } from '../config';

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
            style={{ width: '380px' }}
            onClick={() =>
              handleSelectType(LoginTypeMap.Internal, {
                type: LoginTypeMap.Internal
              })
            }
            v-slots={{
              icon: () => <icon-lock class="size-16" />
            }}
          >
            <span>Login with password</span>
          </a-button>
          {/* <a-divider margin={45}>Or</a-divider> */}
          <div class="box">
            {props.providers.map((provider: any) => (
              <a-button
                key={provider.value}
                class="item"
                type="outline"
                style={{ width: '100%' }}
                onClick={() => handleSelectType(provider.value, provider)}
                v-slots={{
                  icon: () => (
                    <ProviderIcon provider={provider.icon} size={16} />
                  )
                }}
              >
                <span class="text">Login with {provider.label}</span>
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
    padding: 0 30px 10px;
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-large);
    text-align: center;
  }

  .box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: max-content;
    min-width: 100%;

    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 30px;
      cursor: pointer;

      &:last-child {
        margin-right: 0;
      }

      .text {
        font-size: var(--font-size-large);
      }
    }
  }
</style>
