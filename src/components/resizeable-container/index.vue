<template>
  <div id="resize-container" ref="resizeContainer">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import '@interactjs/auto-start';
  import '@interactjs/actions/drag';
  import '@interactjs/actions/resize';
  import '@interactjs/modifiers';
  import '@interactjs/dev-tools';
  import interact from '@interactjs/interact';

  const props = defineProps({
    minHeight: {
      type: Number,
      default: 360
    }
  });
  const resizeContainer = ref();
  const emits = defineEmits(['change']);
  const resize = () => {
    interact(resizeContainer.value).resizable({
      edges: { left: false, right: false, bottom: false, top: true },
      listeners: {
        move(event) {
          // get the inner heigth of the window
          const clientHeight = window.innerHeight;
          // get the height of the container
          const containerHeight = event.rect.height;
          if (containerHeight >= clientHeight) {
            // if the height of the container is greater than the height of the window, set the height of the container to the height of the window
            event.target.style.height = `${clientHeight}px`;
            emits('change', { height: clientHeight });
            return;
          }
          let { x, y } = event.target.dataset;
          x = (parseFloat(x) || 0) + event.deltaRect.left;
          y = (parseFloat(y) || 0) + event.deltaRect.top;

          Object.assign(event.target.style, {
            width: `${event.rect.width}px`,
            height: `${event.rect.height}px`
            // transform: `translate(${x}px, ${y}px)`
          });

          Object.assign(event.target.dataset, { x, y });
          emits('change', { height: event.rect.height });
        }
      },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: '100%', height: props.minHeight }
        }),
        interact.modifiers.restrictEdges({
          outer: {
            top: 0
          }
        })
      ],
      inertia: true
    });
  };
  onMounted(() => {
    resize();
  });
</script>

<style lang="less" scoped></style>
