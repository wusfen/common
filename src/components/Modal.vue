<!-- 
<Modal v-model="bool" no-close>
  <div slot="title">title</title>
  content
  <div slot="footer">footer</div>
</Modal>
-->
<template>
  <overlay :value="value" @input="input" :noClose="noClose">
    <div class="modal" :style="{ width: width }">
      <div class="header">
        <slot name="header">
          <div class="title">
            <slot name="title"><div></div></slot>
          </div>
          <div class="close" @click="input(false)">
            <i class="i-close"></i>
          </div>
        </slot>
      </div>
      <div class="body">
        <slot>modal</slot>
      </div>
      <div class="footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </overlay>
</template>
<script>
import Overlay from './Overlay.vue'
export default {
  props: {
    value: {
      default: true,
    },
    noClose: Boolean,
    width: String,
  },
  components: {
    Overlay,
  },
  data() {
    return {}
  },
  computed: {},
  mounted() {},
  methods: {
    input(value) {
      if (this.noClose) {
        return
      }

      this.$emit('input', value)
      if (!value) {
        this.$emit('close')
      }
    },
  },
}
</script>
<style lang="less" scoped>
.no-close {
  .close {
    display: none;
  }
}
.modal {
  position: relative;
  width: 600px;
  max-width: 100%;
  background: #ffffff;
  box-shadow: 0 2px 30px 5px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  &::before,
  &::after {
    content: '';
    display: table;
  }
  &.no-close {
    .close {
      display: none;
    }
  }
  .header {
    margin: 40px 0;
    .title {
      font-family: SourceHanSansCN-Regular;
      font-size: 30px;
      color: #ff387b;
      letter-spacing: -0.72px;
      text-align: center;
    }
    .close {
      position: absolute;
      top: 30px;
      right: 30px;
      width: 30px;
      height: 30px;
      opacity: 0.4;
    }
  }
  .body {
    margin: 40px 0;
    padding: 0 40px;
  }
  .footer {
    text-align: center;
    margin: 40px 0;
    /deep/ button {
      height: 64px;
      border-radius: 99em;
      &:only-child {
        min-width: 246px;
      }
    }
  }
}
</style>
