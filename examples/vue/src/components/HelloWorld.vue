<template>
  <div>
    <h1>{{ msg }}</h1>
    <button @click="count++">count is: {{ count }}</button>
    <div>
      <a @click="count--">Decrement count</a>
      <a href="/b">Go to page B from a later generated link</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      count: 0
    }
  }
}
</script>
