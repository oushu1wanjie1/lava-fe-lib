import { createI18n } from 'vue-i18n'
import { messages } from "../lib-common/i18n";

export default {
  install: (app: any, { locale = 'zh-CN' }) => {
    const i18n = createI18n({
      legacy: false, // you must set `false`, to use Composition API
      locale, // set locale
      fallbackLocale: 'zh-CN', // set fallback locale
      messages// set locale messages
    })
    app.use(i18n)
  }
}