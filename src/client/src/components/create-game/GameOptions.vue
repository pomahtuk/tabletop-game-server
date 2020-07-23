<template>
  <LinesContainer class-name="game-settings panel k-container">
    <h1>options</h1>
    <TextInput :value="gameSettings.name" @input="setGameName" type="text" placeholder="game name" />
    <!--  switch for pwd  -->
    {{ gameSettings.password || "none" }}
  </LinesContainer>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import LinesContainer from "../base/LinesContainer.vue";
  import {Action, State} from "vuex-class";
  import {GameSettings} from "@/store/state";
  import TextInput from "@/components/base/TextInput.vue";
  import {actionTypes} from "@/store/create-game/actions";

  @Component({
    components: {
      LinesContainer,
      TextInput
    }
  })
  export default class GameOptions extends Vue {
    @State("gameSettings") gameSettings!: GameSettings;

    @Action(actionTypes.SET_GAME_NAME) setGameName!: (name: string) => void
  }
</script>

<style scoped>

</style>
