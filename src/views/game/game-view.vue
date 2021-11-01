<template>
  <div class="fixed inset-0 dark:bg-gray-800">
    <div class="absolute inset-0 bg-center bg-contain bg-no-repeat"
         :style="{ backgroundImage: `url(/scenes/${id}/background.svg)`, backgroundColor: selectedGame.background }" />
    <canvas ref="canvas"
            class="w-full h-full relative" />

    <BaseDialog ref="winDialog"
                title="Вы победили!"
                disable-close>
      <div class="flex flex-col sm:flex-row">
        <RouterLink :to="{ name: 'home' }"
                    class="block w-full">
          <BaseButton class="w-full">
            Выбрать Уровень
          </BaseButton>
        </RouterLink>
        <div class="w-3 h-3" />
        <BaseButton class="w-full"
                    @click="reset">
          Повторить
        </BaseButton>
      </div>
    </BaseDialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { plainToClass } from 'class-transformer'
import { Observer } from '/-/helpers'
import { Api } from '/-/plugins/api'
import { Char } from '/~/models/char'
import { Line } from '/~/models/line'
import { Word } from '/~/models/word'
import { useGames } from '/~/state/games'
import { useCanvas, useCanvasObserver } from '/~/state/canvas'
import { generator, getAnagrams } from '/~/plugins/generator'
import anime from 'animejs/lib/anime.es.js'

export default defineComponent({
  name: 'Game',
  props: {
    id: {
      type: Number,
      default: 1,
    }
  },
  setup() {
    const { list } = useGames()
    const { initCanvas, resizeCanvas } = useCanvas()

    return {
      list,
      initCanvas,
      resizeCanvas,
    }
  },
  data() {
    return {
      config: {
        grid: {
          tileSize: 34,
          tileOffset: 6,
        },
        controls: {
          height: 80,
          offset: 20,
          size: 40
        }
      },
      chars: [],
      grid: [],
      lines: [],
      words: [],
      selected: [],
      images: {},
      game: undefined,
      lib: [],
      observer: new Observer(),
    }
  },
  computed: {
    selectedGame() {
      return this.list.find(({ id }) => id === this.id)
    },
    tileSize() {
      return this.config.grid.tileSize + this.config.grid.tileOffset
    },
    gameSize() {
      const { width, height } = useCanvas()
      const x = (this.game.width - 1) * this.tileSize
      const y = this.game.height * this.tileSize

      return {
        x,
        y,
        width: width.value,
        height: height.value - this.controlsCenter.height,
      }
    },
    controlsCenter() {
      const { width, height } = useCanvas()

      const center = this.getCharPosition(0, this.config.controls.height, this.selectedGame.wordsLength)
      const half = this.config.controls.size / 2
      const offset = this.config.controls.offset

      return {
        x: width.value / 2,
        y: height.value - center.radius - half - offset,
        height: (center.radius * 2) + (half * 2) + (offset * 2),
      }
    },
  },
  async mounted() {
    this.lib = await Api.fetch('/data/words.json')
    const images = [
      {
        key: 'char',
        src: `/scenes/${this.id}/char.svg`,
      },
      {
        key: 'tile',
        src: `/scenes/${this.id}/tile.svg`,
      }
    ]

    images.forEach((image) => {
      const baseImage = new Image()

      baseImage.src = image.src
      baseImage.alt = image.key

      this.images[image.key] = baseImage
    })

    this.init()

    document.body.classList.add('overflow-hidden')

    this.setupCanvas()
    this.setupEvents()

    this.drawLines()
    this.drawChars()
    this.drawGrid()
  },
  beforeUnmount() {
    document.body.classList.remove('overflow-hidden')
  },
  methods: {
    init() {
      const { anagrams, chars } = getAnagrams(this.lib, this.selectedGame.wordsLength, 3)

      this.game = generator(anagrams, chars)

      this.chars = []
      this.grid = []
      this.lines = []
      this.words = []
      this.selected = []

      this.setupGame()
    },

    setupCanvas() {
      this.initCanvas(this.$refs.canvas)

      window.addEventListener('resize', this.resizeCanvas)
    },

    setupEvents() {
      const { onPointerUp, onPointerDown, onPointerMove } = useCanvasObserver()

      onPointerUp((pointer) => {
        this.checkWord()

        this.chars.forEach((char) => {
          const mX = pointer.x - (char.x + this.controlsCenter.x)
          const mY = pointer.y - (char.y + this.controlsCenter.y)
          const dist = Math.sqrt((mY * mY) + (mX * mX))

          if (dist < char.radius * 0.5) {
            this.observer.broadcast('release-char', char)
          }

          this.observer.broadcast('blur-char', char)

          char.isHover = false
        })

        this.selected = []
      })

      onPointerDown((pointer) => {
        this.chars.forEach((char) => {
          const mX = pointer.x - (char.x + this.controlsCenter.x)
          const mY = pointer.y - (char.y + this.controlsCenter.y)
          const dist = Math.sqrt((mY * mY) + (mX * mX))

          if (dist < char.radius * 0.5) {
            this.observer.broadcast('click-char', char)
          }
        })
      })

      onPointerMove((pointer) => {
        this.chars.forEach((char) => {
          const mX = pointer.x - (char.x + this.controlsCenter.x)
          const mY = pointer.y - (char.y + this.controlsCenter.y)
          const dist = Math.sqrt((mY * mY) + (mX * mX))

          if (dist < char.radius * 0.5) {
            if (!char.isHover) {
              this.observer.broadcast('focus-char', char)
            }

            char.isHover = true
          } else {
            if (char.isHover) {
              this.observer.broadcast('blur-char', char)
            }

            char.isHover = false
          }
        })
      })
    },

    setupGame() {
      for (let y = 0; y < this.game.height; y++) {
        for (let x = 0; x < this.game.width; x++) {
          const item = this.game.ownerMap[y][x]

          const char = plainToClass(Char, {
            x: x,
            y: y,
            text: item?.letter?.toUpperCase(),
            radius: 0,
            scale: 0,
            target: item?.words,
            isOpen: false,
          })

          anime({
            targets: char,
            delay: 1000 + (y * 100),
            easing: 'easeInOutExpo',
            radius: this.config.grid.tileSize,
            complete: () => {
              if (!item) {
                anime({
                  targets: char,
                  easing: 'easeInOutExpo',
                  radius: 0,
                })
              }
            },
          })

          this.grid.push(char)
        }
      }

      this.game.positionObjArr.forEach((item) => {
        const word = plainToClass(Word, {
          x: item.xNum,
          y: item.yNum,
          text: item.wordStr,
          isOpen: false,
          isVertical: !item.isHorizon,
        })

        this.words.push(word)
      })

      this.game.chars.forEach((text, i) => {
        const center = this.getCharPosition(i, this.config.controls.height, this.selectedGame.wordsLength)

        const char = plainToClass(Char, {
          x: 0,
          y: 0,
          radius: this.config.controls.size,
          text: text.toUpperCase(),
          isClicked: false,
        })

        anime({
          targets: char,
          delay: 1000 + (i * 100),
          easing: 'easeInOutExpo',
          x: center.x,
          y: center.y,
        })

        this.chars.push(char)
      })

      this.words.forEach((word) => {
        const chars = this.grid.filter((char) => char.target?.includes(word.text))
        const char = chars[0]

        if (char) {
          const end = word.text.length - 1

          const line = plainToClass(Line, {
            x1: char.x,
            y1: char.y,
            x2: (word.isVertical ? 0 : end) + char.x,
            y2: (word.isVertical ? end : 0) + char.y,
            scale: 0,
            target: word.text
          })

          this.lines.push(line)
        }
      })
    },

    drawChars() {
      const { drawText, ctx, pointer } = useCanvas()
      const { onTick } = useCanvasObserver()

      this.observer.subscribe('focus-char', (char) => {
        anime({
          targets: char,
          duration: 200,
          radius: this.config.controls.size + 10,
        })

        if (pointer.value.isPressed && !this.selected.find((item) => item === char)) {
          this.selected.push(char)
        } else if (pointer.value.isPressed && this.selected[this.selected.length - 1] === char) {
          this.selected.pop()
        }
      })

      this.observer.subscribe('blur-char', (char) => {
        anime({
          targets: char,
          duration: 200,
          radius: this.config.controls.size,
        })
      })

      this.observer.subscribe('click-char', (char) => {
        if (!this.selected.find((item) => item === char)) {
          this.selected.push(char)
        }
      })

      onTick(() => {
        const x = this.controlsCenter.x
        const y = this.controlsCenter.y

        this.chars.forEach((char) => {
          const baseImage = this.images.char

          ctx.value.drawImage(baseImage, char.x + x - (char.radius / 2), char.y + y - (char.radius / 2), char.radius, char.radius)

          if (char.text) {
            drawText(char.text, char.x + x, char.y + y, char.radius, this.selectedGame.color)
          }
        })
      })
    },

    drawGrid() {
      const { drawText, ctx } = useCanvas()
      const { onTick } = useCanvasObserver()

      onTick(() => {
        this.grid.forEach((char) => {
          const x = (this.gameSize.width / 2) - (this.gameSize.x / 2) + (this.tileSize * char.x)
          const y = (this.gameSize.height / 2) - (this.gameSize.y / 2) + (this.tileSize * char.y)
          const baseImage = this.images.tile

          ctx.value.drawImage(baseImage, x - (char.radius / 2), y - (char.radius / 2), char.radius, char.radius)

          if (char.isOpen) {
            drawText(char.text, x, y, char.radius * char.scale, this.selectedGame.color)
          }
        })
      })
    },

    drawLines() {
      const { drawLine, pointer, width, height } = useCanvas()
      const { onTick } = useCanvasObserver()

      onTick(() => {
        const length = this.selected.length

        const x = (width.value / 2)
        const y = height.value - this.controlsCenter.height / 2

        const lineX = (this.gameSize.width / 2) - (this.gameSize.x / 2)
        const lineY = (this.gameSize.height / 2) - (this.gameSize.y / 2)

        this.lines.forEach((line) => {
          const start = {
            x: (line.x1 * this.tileSize) + lineX,
            y: (line.y1 * this.tileSize) + lineY,
          }
          const end = {
            x: (line.x2 * this.tileSize) + lineX,
            y: (line.y2 * this.tileSize) + lineY,
          }
          const endCalc = {
            x: Math.max(start.x, end.x * line.scale),
            y: Math.max(start.y, end.y * line.scale),
          }

          drawLine(start, endCalc, this.selectedGame.contrast, 3)
        })

        if (pointer.value.isPressed && length > 0) {
          for (let i = 0; i < length; i++) {
            const next = this.selected[i + 1]
            const itemStart = {
              x: this.selected[i].x + x,
              y: this.selected[i].y + y,
            }
            let itemEnd

            if (next) {
              itemEnd = {
                x: next.x + x,
                y: next.y + y,
              }
            } else {
              itemEnd = {
                x: pointer.value.x,
                y: pointer.value.y,
              }
            }

            drawLine(itemStart, itemEnd, this.selectedGame.contrast, 3)
          }
        }
      })
    },

    getCharPosition(i, radius, chars) {
      const angle = 360 / chars

      let x = radius * Math.sin(Math.PI * 2 * (angle * i) / 360)
      let y = radius * Math.cos(Math.PI * 2 * (angle * i) / 360)

      x = Math.round(x * 100) / 100
      y = Math.round(y * 100) / 100

      return {
        radius,
        x,
        y
      }
    },

    checkWord() {
      const find = this.words.find(({ text }) => {
        return text === this.selected.map(({ text }) => text).join('').toLowerCase()
      })

      if (find) {
        const chars = this.grid.filter(({ target }) => target?.includes(find.text))
        const line = this.lines.find(({ target }) => target === find.text)

        find.isOpen = true

        if (line) {
          anime({
            targets: line,
            easing: 'easeInOutExpo',
            scale: 1,
          })
        }

        chars.forEach((char, i) => {
          char.isOpen = true
          anime({
            targets: char,
            delay: i * 100,
            easing: 'easeInOutExpo',
            scale: 1,
          })
        })
      }

      if (this.words.every(({ isOpen }) => isOpen)) {
        this.$refs.winDialog.target('open')
      }
    },

    reset() {
      this.init()

      this.$refs.winDialog.target('close')
      document.body.classList.add('overflow-hidden')
    }
  }
})
</script>
