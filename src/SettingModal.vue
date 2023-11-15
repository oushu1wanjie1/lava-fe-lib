<script setup>
import { useVModel } from '@vueuse/core';
import { ref } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const visibleLocal = useVModel(props, 'visible')
const formData = ref({
  // coding
  clientId: '',
  clientSecret: '',

  // gpt
  apiKey: '',
  baseURL: ''
})
const activeMenuItem = ref('0')

</script>
<template lang="pug">
t-dialog(v-model:visible="visibleLocal" width="50%" header="设置")
  t-layout
    t-aside
      t-menu.rounded(class="!bg-gray-300" v-model:value="activeMenuItem")
        t-menu-item(value="0") Coding
        t-menu-item(value="1") Gpt
    t-content.p-4(:style="{ background: 'white' }")
      t-form(:data="formData")
        template(v-if="activeMenuItem === '0'")
          t-form-item(label="Cliend Id" name="clientId")
            t-input(v-model="formData.clientId")
          t-form-item(label="Client Secret" name="clientSecret")
            t-input(v-model="formData.clientSecret")
        template(v-if="activeMenuItem === '1'")
          t-form-item(label="Api Key" name="apiKey")
            t-input(v-model="formData.apiKey")
          t-form-item(label="Base Url" name="baseURL")
            t-input(v-model="formData.baseURL")
</template>