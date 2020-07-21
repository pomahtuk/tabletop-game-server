<template>
  <div class="home k-container">
    <Promised :promise="gamesPromise">
      <template v-slot:pending>
        <p>Refreshing</p>
      </template>
      
      <template v-slot>
        <GameTable @refresh="refreshList" />
      </template>
    </Promised>
  </div>
</template>

<script lang="ts">
import GameTable from '@/components/GameTable.vue'

import { Component, Vue } from 'vue-property-decorator';
import {Action} from "vuex-class";
import {actionTypes} from "@/store/actions";
import {GameItem} from "@/store/state";

@Component({
  components: {
    GameTable
  }
})
export default class Home extends Vue {
  @Action(actionTypes.GET_GAMES) loadGames!: () => Promise<GameItem[]>
  
  private gamesPromise: Promise<GameItem[]> | undefined;
  
  refreshList(): void {
    this.gamesPromise = this.loadGames();
  }
  
  created(): void {
    this.refreshList();
  }
}
</script>

<style lang="scss" scoped>
  @import "src/styles/base";
  
  .home {    
    margin: 5vh auto 0 auto;
    width: 80vw;
    min-height: 175px;
    border: 1px solid $main-color;
    background: $main-transparent;
    padding: 0;
  }
</style>
