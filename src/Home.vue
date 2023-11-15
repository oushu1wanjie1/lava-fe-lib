<script setup>
import axios from 'axios'
import SettingModal from './SettingModal.vue'
import { ref } from 'vue'

const settingModalVisible = ref(false)
</script>

<template lang="pug">
div.mx-10
  h1.text-5xl.my-20
    span Hello,Kijin.
    span.text-td-primary 西瓜要大酒
  t-row(:gutter="10")
    t-col(:span="3")
      t-card(title="coding小工具")
        template(#actions)
          t-button(variant="text" theme="primary" @click="$router.push({ name: 'Coding' })") 进入
        span 在coding上进行一些骚操作
    t-col(:span="3")
      t-card(title="My Gpt")
        template(#actions)
          t-button(variant="text" theme="primary" @click="$router.push({ name: 'Coding' })") 进入
        span 搞一下gpt
  t-sticky-tool.fixed(:offset="[0, 40]" @click="settingModalVisible = true")
    t-sticky-item(label="设置")
      template(#icon)
        t-icon(name="setting-1")
  setting-modal(v-model:visible="settingModalVisible")
</template>