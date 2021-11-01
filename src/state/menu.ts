import { reactive, readonly, toRef } from 'vue'

interface stateInterface {
  menu: {
    label: string
    route: string
    extend?: boolean
  }[],
  isMenuVisible: boolean
}

const state: stateInterface = reactive({
  menu: [],
  isMenuVisible: false,
})

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
