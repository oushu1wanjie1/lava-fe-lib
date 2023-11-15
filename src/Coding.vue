<script setup>
import axios from 'axios'
import { ref } from 'vue'

const version = ref('')
const batchRelease = () => {
  axios.post('http://127.0.0.1:9003/batch-release', {
    branch: version.value
  }).then(res => {
    console.log(res.data)
  })
}
</script>

<template>
  <div :style="{ display: 'flex' }">
    <input placeholder="请输入release版本号，例如5.5.0.0" v-model="version" />
    <button :style="{ marginLeft: '10px' }" @click="batchRelease" :disable="!version">批量添加release</button>
  </div>
</template>