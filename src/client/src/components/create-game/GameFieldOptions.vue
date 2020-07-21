<template>
  <LinesContainer class-name="map-settings panel k-container">
    <h1>map</h1>

    <v-slider
      label="Field Width"
      thumb-label="always"
      :value="gameFieldSettings.filedWidth"
      @change="setGameFieldWidth"
      color="#3A7BDB"
      track-color="rgba(101, 246, 255, 0.3)"
      min="4"
      max="20"
      ticks="always"
    ></v-slider>

    <v-slider
      label="Field Height"
      thumb-label="always"
      :value="gameFieldSettings.fieldHeight"
      @change="setGameFieldHeight"
      color="#3A7BDB"
      track-color="rgba(101, 246, 255, 0.3)"
      min="4"
      max="20"
      ticks="always"
    ></v-slider>

    <v-slider
      label="Neural planets"
      thumb-label="always"
      :value="gameFieldSettings.neutralPlanets"
      @change="setGameNeutralPlanetsCount"
      color="#3A7BDB"
      track-color="rgba(101, 246, 255, 0.3)"
      min="0"
      :max="maxPlanets"
      ticks="always"
    ></v-slider>

  </LinesContainer>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import LinesContainer from "../base/LinesContainer.vue";
  import {Action, State} from "vuex-class";
  import {GameFieldSettings, GamePlayerSettings} from "@/store/state";
  import {actionTypes} from "@/store/actions";
  import getPlanetLimit from "../../../../server/gamelogic/helpers/getPlanetLimit";

  @Component({
    components: {
      LinesContainer
    }
  })
  export default class GameFieldOptions extends Vue {
    @State("gameFieldSettings") gameFieldSettings!: GameFieldSettings;
    @State("gamePlayerSettings") gamePlayerSettings!: GamePlayerSettings;

    @Action(actionTypes.SET_GAME_FIELD_WIDTH) setGameFieldWidth!: (width: number) => void
    @Action(actionTypes.SET_GAME_FIELD_HEIGHT) setGameFieldHeight!: (height: number) => void
    @Action(actionTypes.SET_GAME_NEUTRAL_PLANETS_COUNT) setGameNeutralPlanetsCount!: (neutralPlanets: number) => void
    
    get maxPlanets(): number {
      const fieldSize = this.gameFieldSettings.filedWidth * this.gameFieldSettings.fieldHeight;
      return getPlanetLimit(fieldSize, this.gamePlayerSettings.initialPlayers.length);
    }
  }
</script>

<style lang="scss">
  @import "src/styles/base";
  
  .v-label {
    color: $main-color !important;
  }
  
  .v-input__slider {
    margin-bottom: 10px;
  }
</style>
