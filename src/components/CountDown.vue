<!-- 
<CountDown
  seconds
  autostart
  @change
  @timeup
/>
 -->
<template>
  <s class="component">{{ value }}</s>
</template>

<script>
export default {
  props: {
    seconds: [String, Number],
    autostart: Boolean,
  },
  data() {
    return {
      value: 0,
    }
  },
  computed: {},
  async mounted() {
    this.value = this.seconds
    this.autostart && this.start()
  },
  methods: {
    start() {
      if (this.seconds) {
        this.value = this.seconds
        this.timer = setInterval(() => {
          this.value--
          this.$emit('change', this.value)

          if (this.value <= 0) {
            clearInterval(this.timer)
            this.$emit('timeup')
            this.$emit('timeout')
          }
        }, 1000)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.component {
  font: inherit;
  text-decoration: inherit;
  color: inherit;
}
</style>
