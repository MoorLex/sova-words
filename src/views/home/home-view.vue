<template>
  <div class="max-w-screen-sm mx-auto space-y-6 p-6">
    <template v-for="(game, idx) in list"
              :key="idx">
      <RouterLink :to="{ name: 'game', params: { id: game.id } }"
                  class="block">
        <div class="rounded-xl overflow-hidden border-4 bg-cover bg-center"
             :style="{ borderColor: game.color, backgroundImage: `url(/scenes/${game.id}/card.svg)` }">
          <div class="px-10 py-6 sm:px-16 sm:py-10 relative"
               :style="{ color: game.color }">
            <div class="font-black text-lg">
              {{ game.name }}
            </div>
            <div class="font-medium text-sm">
              {{ game.description }}
            </div>
            <BaseButton :theme="false"
                        size="sm"
                        class="mt-3"
                        :style="{ backgroundColor: game.contrast, color: game.color }">
              Начать
            </BaseButton>
          </div>
        </div>
      </RouterLink>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useGames } from '/~/state/games'

export default defineComponent({
  name: 'Home',
  setup() {
    const { list } = useGames()

    return {
      list
    }
  }
})
</script>
