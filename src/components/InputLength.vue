<!-- 
<div>
  <input type="text">
  <InputLength></InputLength>
</div>

<div>
  <textarea></textarea>
  <InputLength></InputLength>
</div>
 -->

<template>
  <span ref="span">{{ value.length }}</span>
</template>

<script>
export default {
  title: '',
  components: {},
  data() {
    return {
      value: '',
    }
  },
  computed: {},
  async mounted() {
    var span = this.$refs.span
    var input = span.parentNode.querySelector('input,textarea')
    this.input = input
    this.value = input.value

    input.addEventListener(
      'input',
      (this.handler = e => {
        this.value = input.value
      })
    )
  },
  async destroyed() {
    this.input.removeEventListener('input', this.handler)
  },
  methods: {},
}
</script>
