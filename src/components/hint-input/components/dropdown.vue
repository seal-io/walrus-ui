<script lang="tsx">
  import { defineComponent, toRef } from 'vue';

  type resultItem = {
    label: string;
    value: string;
    type?: string;
    description?: string;
  };
  export default defineComponent({
    props: {
      data: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    setup(props) {
      const data = toRef(props, 'data');
      return () => (
        <span content={data.value.description}>
          {data.value.description ? (
            <span>
              {data.value.label}
              <span class="desc">{data.value.description}</span>
            </span>
          ) : (
            <span>{data.value.label}</span>
          )}
        </span>
      );
    }
  });
</script>
