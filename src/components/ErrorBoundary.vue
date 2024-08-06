<template>
  <div>
    <slot v-if="!error"></slot>
    <div v-else>
      <h1>出错了！</h1>
      <pre>{{ error }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { error: null }
  },
  errorCaptured(err) {
    this.error = err
    return false
  }
}
</script>