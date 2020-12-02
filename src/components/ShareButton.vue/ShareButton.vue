<template>
  <button @click="isShowShareTips = true">
    <slot>分享</slot>
    <!-- move to body -->
    <Overlay ref="overlay" class="shareTips" v-model="isShowShareTips">
      <img src="./img/share-tips.png" alt="请点击右上角分享" />
    </Overlay>
  </button>
</template>

<script>
import Overlay from '@common/components/Overlay'

export default {
  props: {},
  components: {
    Overlay,
  },
  data() {
    return {
      isShowShareTips: false,
    }
  },
  computed: {},
  async mounted() {
    // move to body
    var overlay = this.$refs.overlay
    document.body.appendChild(overlay.$el)
  },
  methods: {},
}
</script>

<style lang="less" scoped>
.shareTips {
  padding: 1em;
  background: rgba(0, 0, 0, 0.5);
  display: block;
  text-align: right;
  img {
    pointer-events: none;
    width: 560px;
    object-fit: contain;
  }
}
</style>
