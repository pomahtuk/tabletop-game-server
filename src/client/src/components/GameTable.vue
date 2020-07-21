<template>
  <LinesContainer class-name="game-list">
    <div class="wrapper">
      <table>
        <thead>
        <tr>
          <td class="time">Time</td>
          <td class="name">Name</td>
          <td class="player">Players</td>
          <td class="field-size">Field size</td>
          <td class="neutral-planets">Neutral planets</td>
          <td><!-- Empty for button --></td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="game in games" :key="game.name">
          <td class="time"><span>{{game.created}}</span></td>
          <td class="name"><span>{{game.name}}</span></td>
          <td class="player"><span>{{game.players}}</span></td>
          <td class="field-size"><span>{{game.fieldSize}}</span></td>
          <td class="neutral-planets"><span>{{game.neutralPlanets}}</span></td>
          <td class="button"><Button glow="true">Join</Button></td>
        </tr>
        <tr class="blank">
        </tr>
        </tbody>
      </table>
      <div v-if="!gamesError && (!games || games.length === 0)" class="no-games">
        <!--    TODO: add refresh button    -->
        <span>No games found</span>
        <Button @click="$emit('refresh');">Refresh</Button>
      </div>
      <div v-if="gamesError" class="games-error">
        {{ gamesError }}
      </div>
    </div>
  </LinesContainer>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import Button from "@/components/base/Button.vue";
  import {GameItem} from "@/store/state";
  import {State} from "vuex-class";
  import LinesContainer from "@/components/base/LinesContainer.vue";
  
  @Component({
    components: {
      Button,
      LinesContainer
    }
  })
  export default class GameTable extends Vue {
    @State("games") games!: GameItem[];
    @State("gamesError") gamesError?: string;
  }
  
  // TODO: add refresh button pagination
</script>

<style scoped lang="scss">
  @import "src/styles/base";
  
  .game-list {
    padding: $spacing-main;
  }

  .no-games,
  .games-error {
    display: inline-block;
    margin: $spacing-main auto;
  }
  
  .no-games {
    span {
      display: block;
      text-align: center;
      margin-bottom: $spacing-main;
    }
  }
  
  .games-error {
    padding: 10px 20px;
    
    background: rgba($accent-color, 0.2);
    border: 1px solid $accent-color;
    box-sizing: border-box;
    backdrop-filter: blur(5px);

    color: $accent-color;
  }

  .left-top-line {
    min-width: 40px;
    min-height: 145px;
  }
  
  .right-bottom-line {
    min-width: 180px;
    min-height: 180px;
  }
  
  .wrapper {
    max-height: calc(80vh - 100px);
    overflow: auto;
    display: flex;
    flex-direction: column;
    scrollbar-width: thin;
    scrollbar-color: $thumbBG $main-color;

    &::-webkit-scrollbar {
      width: 3px;
    }
    &::-webkit-scrollbar-track {
      background: $main-color;
      width: 1px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: $thumbBG;
      border-radius: 6px;
      border: 2px solid $thumbBG;
    }

  }
  
  table {
    width: 100%;
    border: none;
    border-collapse: collapse;
    position: relative;
    left: 0;
    top: 0;
    z-index: 2;
    padding-bottom: $spacing-smallest;
    
    tr, td {
      border: none;
      box-sizing: border-box;
      line-height: 40px;
    }

    td {
      text-align: center;
    }

    td:first-child {
      padding-left: $spacing-small;
    }

    td:last-child {
      padding-right: $spacing-small;
    }
    
    tbody {
      tr {
        td > span {
          padding: $spacing-small 0;
        }
        
        &.blank {
          height: 2px;
        }
        
        &:nth-child(2n + 1) {
          background: rgba(101, 246, 255, 0.03);
        }
        
        &:hover {
          background: $main-transparent;
          outline: 1px solid #25CBFF;
          
          td.button > * {
            visibility: visible;
          }
        }
        
        td.button {
          padding: $spacing-smallest 0;
          width: 180px;
          
          & > * {
            visibility: hidden;
          }
        }
      }
    }

    thead tr {
      font-size: 12px;
      line-height: 14px;
      text-align: left;
      color: #177278;

      td {
        padding-bottom: $spacing-main;
      }
    }
  }
  
  @media (min-width: 320px) and (max-width: 480px) {
    .time,
    .button,
    .field-size {
      display: none;
    }

    .game-list:after {
      display: none;
    }
  }
</style>


