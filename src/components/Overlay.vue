<!-- 
<Overlay v-model="bool" no-close>
  content
</Overlay>
-->
<template>
  <transition name="overlay">
    <div
      v-if="value"
      class="overlay"
      :class="{ 'no-close': noClose }"
      @click.self="input(false)"
    >
      <slot></slot>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    value: {
      default: true,
    },
    noClose: Boolean,
  },
  data() {
    return {}
  },
  mounted() {},
  watch: {
    value: {
      handler() {
        document.documentElement.style.overflow = this.value ? 'hidden' : ''
      },
      immediate: true,
    },
  },
  methods: {
    input(value) {
      if (this.noClose) {
        return
      }

      this.$emit('input', value)
    },
  },
}
</script>
<style lang="less">
.overlay {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 2em 1em 4em;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  animation: none !important;
  scroll-boundary-behavior-y: none; // qqbrowser
  overscroll-behavior-y: contain; // chrome !ios
  @supports (backdrop-filter: blur(1ex)) {
    backdrop-filter: blur(1ex);
    background: rgba(0, 0, 0, 0.2);
  }

  > :first-child {
    margin-top: auto;
  }
  > * {
    flex: none;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
  > :last-child {
    margin-bottom: auto;
  }
}

// transition
.overlay-enter {
  opacity: 0;
  > * {
    transform: scale(0.8);
  }
}
.overlay-enter-active {
  transition: 0.3s;
  > * {
    transition: 0.3s;
  }
}
.overlay-enter-to {
  opacity: 1;
}
.overlay-leave {
}
.overlay-leave-active {
  transition: 0.3s;
  > * {
    transition: 0.3s;
  }
}
.overlay-leave-to {
  opacity: 0;
  > * {
    transform: scale(0.8);
  }
}
</style>
