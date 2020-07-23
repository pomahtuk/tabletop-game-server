<template>
  <LinesContainer class-name="players-list panel k-container">
    <h1>players</h1>
    <PlayerTable :players="gamePlayerSettings.initialPlayers" />
    <AddPlayer :class="{'disabled': disableAdding}" />
  </LinesContainer>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import LinesContainer from "../base/LinesContainer.vue";
  import {Action, State} from "vuex-class";
  import {GamePlayerSettings} from "@/store/state";
  import Button from "@/components/base/Button.vue";
  import PlayerTable from "@/components/create-game/PlayerTable.vue";
  import AddPlayer from "@/components/create-game/AddPlayer.vue";
  import {actionTypes} from "@/store/create-game/actions";

  @Component({
    components: {
      LinesContainer,
      Button,
      PlayerTable,
      AddPlayer
    }
  })
  export default class GamePlayerOptions extends Vue {
    @State("gamePlayerSettings") gamePlayerSettings!: GamePlayerSettings;

    @Action(actionTypes.ADD_USER_AS_PLAYER) addUserAsPlayer!: () => void
    
    created(): void {
      this.addUserAsPlayer();
      console.log("created")
    }
    
    get disableAdding(): boolean {
      return this.gamePlayerSettings.initialPlayers.length >= 4
    }
  }
</script>

<style scoped lang="scss">
 .add-player.disabled {
   visibility: hidden;
 }
</style>
