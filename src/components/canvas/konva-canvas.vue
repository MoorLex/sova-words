<template>
  <div id="container" />
</template>

<script lang="ts">
import Konva from 'konva'

export default {
  data() {
    return {
      stage: undefined as Konva
    }
  },
  mounted() {
    this.stage = new Konva.Stage({
      container: 'container'
    })

    this.checkScreen()
    this.init()

    window.addEventListener('resize', this.checkScreen)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkScreen)
  },
  methods: {
    checkScreen() {
      this.stage.size({
        width: this.$parent.$el.clientWidth,
        height: this.$parent.$el.clientHeight
      })
      this.stage.draw()
    },
    init() {
      const layer = new Konva.Layer()

      Konva.Image.fromURL('/scenes/button-1.svg', (darthNode) => {
        darthNode.setAttrs({
          x: this.stage.width() / 2,
          y: this.stage.height() / 2,
          scaleX: 2,
          scaleY: 2,
        })

        layer.add(darthNode)
      })
      Konva.Image.fromURL('/scenes/button-1.svg', (darthNode) => {
        darthNode.setAttrs({
          scaleX: 2,
          scaleY: 2,
        })

        const size = darthNode.size()
        const scale = darthNode.scale()

        darthNode.position({
          x: (this.stage.width() / 2) - (size.width * scale.x) - 10,
          y: (this.stage.height() / 2),
        })

        layer.add(darthNode)
      })
      Konva.Image.fromURL('/scenes/button-1.svg', (darthNode) => {
        darthNode.setAttrs({
          scaleX: 2,
          scaleY: 2,
        })

        const size = darthNode.size()
        const scale = darthNode.scale()

        darthNode.position({
          x: (this.stage.width() / 2) + (size.width * scale.x) + 10,
          y: (this.stage.height() / 2),
        })

        layer.add(darthNode)
      })

      this.stage.add(layer)
      this.stage.draw()
    }
  }
}
</script>
