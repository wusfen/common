<template>
  <Modal v-if="title || message" v-model="isShow" @close="cancel">
    <template slot="title">
      {{ title }}
    </template>
    <div class="message">
      {{ message }}
    </div>
    <template slot="footer">
      <button class="primary" @click="ok">确认</button>
      <!-- <button @click="cancel">取消</button> -->
    </template>
  </Modal>
</template>

<script>
import Modal from './Modal'

export default {
  components: { Modal },
  props: {
    title: String,
    message: String,
  },
  data() {
    return {
      isShow: true,
    }
  },
  computed: {},
  async mounted() {},
  methods: {
    ok() {
      this.isShow = false
      this.$emit('ok')
      this.$emit('close')
    },
    cancel() {
      this.isShow = false
      this.$emit('cancel')
      this.$emit('close')
    },
  },
}
</script>
<style lang="less" scope>
.message {
  display: flex;
  justify-content: center;
}
</style>
