import 'reflect-metadata'
import { createApp } from 'vue'
import App from './app.vue'
import router from './router'
import theme from '/-/plugins/theme'
import icons from '/-/plugins/icons'
import api from '/-/plugins/api'
import dayjs from '/~/plugins/dayjs'
import directives from '/-/directives'
import components from '/-/components'
import slider from '/-/plugins/slider'
import iconsHero from '/-/plugins/icons/hero'
import './index.css'

const app = createApp(App)

app.use(theme)
app.use(icons, {
  ...iconsHero
})
app.use(directives)
app.use(components)
app.use(slider)
app.use(dayjs)

app.use(api, {
  default: 'main',
  resources: [
    {
      name: 'main',
      baseUrl: ''
    },
  ]
})

app.use(router)
app.mount('#app')
