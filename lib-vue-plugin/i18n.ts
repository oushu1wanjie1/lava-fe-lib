import { createI18n } from 'vue-i18n'
import { messages } from '../lib-common/i18n'
export interface I18nPluginOptions {
  locale?: string
}
export default {
  install: (app: any, options: I18nPluginOptions = {}) => {
    const i18n = createI18n({
      legacy: false, // you must set `false`, to use Composition API
      locale: options.locale || 'zh-CN', // set locale
      fallbackLocale: 'zh-CN', // set fallback locale
      messages// set locale messages
    })
    app.use(i18n)
  }
}
