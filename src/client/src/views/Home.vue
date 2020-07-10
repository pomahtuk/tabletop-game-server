<template>
  <div class="home">
    <GameTable :games="games" />
  </div>
</template>

<script lang="ts">
  import GameTable, {GameItem} from '@/components/GameTable.vue'

import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    GameTable
  }
})
export default class Home extends Vue {
  games: GameItem[] = [...(new Array(20))].map((_, index) => (
    {
      created: Date.now().toString(),
      name: `${index} Name of game`,
      players: "1/2",
      fieldSize: "10 x 10",
      neutralPlanets: Math.ceil(index / 2)
    }
  ));
}
</script>
