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
    },
    minWidth: {
      type: Number,
      default: 100
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 100
    },
    wrapper: {
      type: String, // window, parentNode
      default: 'window'
    },
    actEdges: {
      type: Object,
      default() {
        return {
          top: true
        };
      }
    }
  });
  const resizeContainer = ref();
  const defaultEdges = {
    left: false,
    right: false,
    bottom: false,
    top: false
  };
  const emits = defineEmits(['change', 'update:width', 'update:height']);
  const resize = () => {
    interact(resizeContainer.value).resizable({
      edges: { ...defaultEdges, ...props.actEdges },
      listeners: {
        move(event) {
          // get the inner heigth of the window
          const clientHeight = window.innerHeight;
          const clientWidth =
            props.wrapper === 'window'
              ? window.innerWidth
              : event.target.parentNode.clientWidth;
          // get the height of the container
          let containerHeight = event.rect.height;
          // get the width of the container
          let containerWidth = event.rect.width;

          if (containerHeight >= clientHeight) {
            // if the height of the container is greater than the height of the window, set the height of the container to the height of the window
            event.target.style.height = `${clientHeight}px`;
            containerHeight = clientHeight;
          }
          if (containerWidth >= clientWidth) {
            // if the width of the container is greater than the width of the window, set the width of the container to the width of the window
            event.target.style.width = `${clientWidth}px`;
            containerWidth = clientWidth;
          }
          let { x, y } = event.target.dataset;
          x = (parseFloat(x) || 0) + event.deltaRect.left;
          y = (parseFloat(y) || 0) + event.deltaRect.top;

          Object.assign(event.target.style, {
            width: `${containerWidth}px`,
            height: `${containerHeight}px`
          });

          Object.assign(event.target.dataset, { x, y });

          emits('change', {
            height: containerHeight,
            width: containerWidth
          });
          emits('update:width', containerWidth);
          emits('update:height', containerHeight);
        }
      },
      modifiers: [
        interact.modifiers.restrictSize({
          min: {
            width: props.minWidth,
            height: props.minHeight
          }
        }),
        interact.modifiers.restrictEdges({
          outer: {
            top: 0
          }
        })
        // interact.modifiers.restrictRect({
        //   restriction: 'parent'
        // })
      ],
      inertia: true
    });
  };
  onMounted(() => {
    resize();
  });
</script>

<style lang="less" scoped></style>
