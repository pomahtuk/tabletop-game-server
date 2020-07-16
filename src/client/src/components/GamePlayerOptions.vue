<template>
  <LinesContainer class-name="players-list panel k-container">
    <h1>players</h1>
    {{ gamePlayerSettings.numPlayers }}
    <br/>
    {{ gamePlayerSettings.initialPlayers }}
  </LinesContainer>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import LinesContainer from "./LinesContainer.vue";
  import {Action, State} from "vuex-class";
  import {ComputerPlayerType, GamePlayerSettings, Player} from "@/store/state";
  import {actionTypes} from "@/store/actions";

  @Component({
    components: {
      LinesContainer
    }
  })
  export default class GamePlayerOptions extends Vue {
    @State("gamePlayerSettings") gamePlayerSettings!: GamePlayerSettings;

    @Action(actionTypes.ADD_COMPUTER_PLAYER) addComputerPlayer!: (type: ComputerPlayerType) => void
    @Action(actionTypes.ADD_PLAYER) addPlayer!: (player: Player) => void
    @Action(actionTypes.SET_GAME_NUM_PLAYERS) setNumPlayers!: (number: number) => void
  }
</script>

<style scoped>

</style>
