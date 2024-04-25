<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, ref, onMounted } from 'vue';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import SealDivivder from '@/components/seal-divider/index.vue';
  import { LoginTypeMap } from '../config';

  export default defineComponent({
    name: 'SsoProvider',
    props: {
      providers: {
        type: Array,
        default: () => []
      },
      loaded: {
        type: Boolean,
        default: false
      }
    },
    emits: ['select'],
    setup(props, { emit }) {
      const handleSelectType = (type, item) => {
        console.log('type', type);
        emit('select', type, item);
      };

      const renderOtherProviders = (list) => {
        if (!list.length) {
          return null;
        }
        return (
          <>
            <SealDivivder style={{ marginTop: '20px', marginBottom: '12px' }}>
              Others
            </SealDivivder>
            <div class="others">
              {list.map((provider: any, index) => (
                <a-button
                  key={provider.value}
                  class="item"
                  shape="circle"
                  style={{ width: '36px', height: '36px' }}
                  onClick={() => handleSelectType(provider.value, provider)}
                  v-slots={{
                    icon: () => (
                      <ProviderIcon provider={provider.icon} size={16} />
                    )
                  }}
                ></a-button>
              ))}
            </div>
          </>
        );
      };
      const renderBox = () => {
        return (
          <div class="box">
            {_.slice(props.providers, 0, 2).map((provider: any, index) => (
              <a-button
                key={provider.value}
                class="item"
                type={index === 0 ? 'primary' : 'outline'}
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
            {props.loaded && (
              <a-button
                class="password item"
                type={props.providers.length ? 'outline' : 'primary'}
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
            )}
          </div>
        );
      };
      return () => (
        <div class="wrapper">{renderOtherProviders(props.providers)}</div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .password {
    padding: 0 30px;
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-large);
    text-align: center;
  }

  .others {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .item {
      margin-right: 20px;
    }
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
      margin-bottom: 20px;
      cursor: pointer;

      &:first-child {
        height: 48px;
        margin-top: 50px;
      }

      &:last-child {
        margin-right: 0;
      }

      .text {
        font-size: var(--font-size-large);
      }
    }
  }
</style>
