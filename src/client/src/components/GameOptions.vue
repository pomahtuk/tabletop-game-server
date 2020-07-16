<template>
  <LinesContainer class-name="game-settings panel k-container">
    <h1>options</h1>
    {{gameSettings.name}}
    <br/>
    {{gameSettings.password || "none"}}
  </LinesContainer>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import LinesContainer from "./LinesContainer.vue";
  import {Action, State} from "vuex-class";
  import { GameSettings} from "@/store/state";
  import {actionTypes} from "@/store/actions";

  @Component({
    components: {
      LinesContainer
    }
  })
  export default class GameOptions extends Vue {
    @State("gameSettings") gameSettings!: GameSettings;

    @Action(actionTypes.SET_GAME_SETTINGS) setGameSettings!: () => void
  }
</script>

<style scoped>

</style>
