<template>
  <div class="create-game">
    <div class="left-column column">
      <GamePlayerOptions />
    </div>
    
    <div class="right-column column">
      <GameOptions />
      <GameFieldOptions />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import LinesContainer from "../components/LinesContainer.vue";
  import GameOptions from "@/components/GameOptions.vue";
  import {State} from "vuex-class";
  import {GameFieldSettings, GamePlayerSettings, GameSettings} from "@/store/state";
  import GameFieldOptions from "@/components/GameFieldOptions.vue";
  import GamePlayerOptions from "@/components/GamePlayerOptions.vue";
  
  @Component({
    components: {
      LinesContainer,
      GameOptions,
      GameFieldOptions,
      GamePlayerOptions
    }
  })
  export default class CreateGame extends Vue {
    @Prop() private className!: string;

    @State("gameSettings") gameSettings!: GameSettings;
    @State("gamePlayerSettings") gamePlayerSettings!: GamePlayerSettings;
    @State("gameFieldSettings") gameFieldSettings!: GameFieldSettings;
    
    // method to create game
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/base";
  
  .create-game {
    margin: 5vh auto 0 auto;
    width: 80vw;
    display: flex;
    justify-content: space-around;
    align-items: stretch;
    
    .column {
      flex-grow: 1;
      padding: 20px;
      box-sizing: border-box;
    }
    
    .right-column  {
      padding-left: 10px;
      
      .panel:first-child {
        margin-bottom: 20px;
      }
    }
    
    .left-column {
      padding-right: 10px;
      
      .panel {
        height: 100%;
      }
    }
    
    .panel {
      border: 1px solid #65F6FF;
      background: rgba($main-color, 0.1);
    }
  }
</style>
