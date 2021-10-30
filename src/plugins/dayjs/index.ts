import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/ru'
import 'dayjs/locale/en'
import 'dayjs/locale/bg'
import { watch } from 'vue'
import { useLocale } from '/-/plugins/locale'

export default {
  install: () => {
    const { lang } = useLocale()

    dayjs.extend(LocalizedFormat)
    dayjs.locale(lang.value)

    watch(lang, (lang) => dayjs.locale(lang))
  }
}
