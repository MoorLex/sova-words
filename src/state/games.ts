import { reactive, readonly, toRef } from 'vue'

interface stateInterface {
  list: {
    id: number
    name: string
    description: string
    color: string
    contrast: string
    background: string
    wordsLength: number
  }[]
}

const state: stateInterface = reactive({
  list: [
    {
      id: 1,
      name: 'Для начала',
      description: 'Найдите всего 5 слов',
      color: '#18686b',
      contrast: '#D78095',
      background: '#121529',
      wordsLength: 3,
    },
    {
      id: 2,
      name: 'Для начала',
      description: 'Найдите всего 5 слов',
      color: '#763D14',
      contrast: '#A2C62A',
      background: '#070F0C',
      wordsLength: 4,
    },
    {
      id: 3,
      name: 'Для начала',
      description: 'Найдите всего 5 слов',
      color: '#2D7779',
      contrast: '#EBF6FA',
      background: '#041112',
      wordsLength: 5,
    },
    {
      id: 4,
      name: 'Для начала',
      description: 'Найдите всего 5 слов',
      color: '#45595F',
      contrast: '#98AD9E',
      background: '#0D0607',
      wordsLength: 6,
    },
    {
      id: 5,
      name: 'Для начала',
      description: 'Найдите всего 5 слов',
      color: '#7E4C12',
      contrast: '#FAC119',
      background: '#110C07',
      wordsLength: 7,
    },
  ]
})

export function useGames() {
  return {
    list: readonly(toRef(state, 'list')),
  }
}
