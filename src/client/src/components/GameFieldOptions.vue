<template>
  <LinesContainer class-name="map-settings panel k-container">
    <h1>map</h1>
    {{gameFieldSettings.filedWidth}} x {{gameFieldSettings.fieldHeight}}
    <br/>
    {{ gameFieldSettings.neutralPlanets }}
  </LinesContainer>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import LinesContainer from "./LinesContainer.vue";
  import {Action, State} from "vuex-class";
  import {GameFieldSettings} from "@/store/state";
  import {actionTypes} from "@/store/actions";

  @Component({
    components: {
      LinesContainer
    }
  })
  export default class GameFieldOptions extends Vue {
    @State("gameFieldSettings") gameFieldSettings!: GameFieldSettings;

    @Action(actionTypes.SET_GAME_FIELD_SETTINGS) setGameFieldSettings!: () => void
  }
</script>

<style scoped>

</style>
