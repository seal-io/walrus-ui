<script lang="tsx">
  import { computed, defineComponent } from 'vue';

  export default defineComponent({
    props: {
      list: {
        type: Array,
        default() {
          return [];
        }
      },
      itemWidth: {
        type: Number,
        default: 0
      },
      itemHeight: {
        type: Number,
        default: 0
      }
    },
    setup(props, { slots }) {
      const containerWidth = computed(() => {
        return props.itemWidth * props.list.length;
      });
      return () => (
        <div class="swiper-container">
          <div
            class="swiper-wrapper"
            style={{ width: `${containerWidth.value}px` }}
          >
            {props.list.map((item, index) => (
              <div class="swiper-slide" key={index}>
                {slots.default?.(item)}
              </div>
            ))}
          </div>
          <div class="swiper-pagination"></div>
        </div>
      );
    }
  });
</script>

<style lang="less"></style>
