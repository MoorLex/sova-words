import { reactive, readonly, toRef, watch } from 'vue'
import { useLocale } from '/-/plugins/locale'

interface stateInterface {
  menu: {
    label: string
    route: string
    extend?: boolean
  }[],
  isMenuVisible: boolean
}

const { lang, getLocal } = useLocale()

const state: stateInterface = reactive({
  menu: [],
  isMenuVisible: false,
})

watch(lang, () => init())

init()

function init() {
  state.menu = [
    {
      label: getLocal('core.home'),
      route: 'home',
      extend: false
    },
    {
      label: getLocal('core.contacts'),
      route: 'contacts-list',
      extend: false
    },
    {
      label: getLocal('core.schedules'),
      route: 'schedules-list',
      extend: false
    },
    {
      label: getLocal('core.services'),
      route: 'services-list',
      extend: true
    },
    {
      label: getLocal('core.articles'),
      route: 'articles-list',
      extend: true
    },
    {
      label: getLocal('core.products'),
      route: 'products-list',
      extend: true
    },
    {
      label: getLocal('core.albums'),
      route: 'albums-list',
      extend: true
    },
  ]
}

function hideMenu() {
  state.isMenuVisible = false
}

function showMenu() {
  state.isMenuVisible = true
}

function toggleMenu() {
  if (state.isMenuVisible) {
    hideMenu()
  } else {
    showMenu()
  }
}

export function useMenu() {
  return {
    menu: readonly(toRef(state, 'menu')),
    isMenuVisible: toRef(state, 'isMenuVisible'),
    hideMenu,
    showMenu,
    toggleMenu,
  }
}
