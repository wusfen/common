<template>
  <div class="page">
    <i></i>
    <small>哎呀，检测不到您的报名信息！</small>
    <div class="buttons">
      <button
        class="primary block round"
        @click="location.href = `${$server}/weChatApi/pages/ldyv3?cs=hema123`"
      >
        0元抢报6节编程课
      </button>
      <button
        class="primary block round"
        @click="location.href = `${$server}/weChatApi/pages/bindMobile`"
      >
        已报名，前往绑定手机
      </button>
    </div>
  </div>
</template>

<script>
export default {
  title: '',
  components: {},
  data() {
    return {}
  },
  computed: {},
  async mounted() {},
  methods: {},
}
</script>

<style lang="less" scoped>
.page {
  // background: #fff4f2 top/contain url('./img/bg-star.png');
  i {
    display: block;
    width: 520px;
    height: 452px;
    margin: 82px auto 0;
    // background: center/contain url('./img/img-noinformation.png');
  }
  small {
    display: block;
    margin-top: 32px;
    font-family: SourceHanSansCN-Regular;
    font-size: 32px;
    color: #666666;
    letter-spacing: 0;
    text-align: center;
  }
  .buttons {
    width: 560px;
    margin: 86px auto;
    button {
      margin: 48px 0;
    }
  }
}
</style>
