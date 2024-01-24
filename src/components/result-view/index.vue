<script lang="tsx">
  import { defineComponent, ref, computed, watch } from 'vue';

  export default defineComponent({
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      },
      subTitle: {
        type: String,
        default: ''
      }
    },
    setup(props, { slots }) {
      return () => <a-empty></a-empty>;
      // return () => (
      //   <a-result
      //     title={props.title}
      //     subtitle={props.subTitle}
      //     v-slots={{
      //       icon: () => {
      //         return slots.icon ? slots.icon() : <icon-empty />;
      //       },
      //       extra: () => {
      //         return slots.extra ? slots.extra() : null;
      //       }
      //     }}
      //   ></a-result>
      // );
    }
  });
</script>
