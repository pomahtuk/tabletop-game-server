<template>
  <div class="game-list">
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
          <td class="button"><Button title="Join" glow="true" /></td>
        </tr>
        <tr class="blank">
        </tr>
        </tbody>
      </table>
    </div>

    <div class="left-top-line"></div>
    <div class="left-line"></div>
    <div class="right-bottom-line"></div>
    <div class="bottom-line"></div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import Button from "@/components/Button.vue";

  export interface GameItem {
    created: string;
    name: string;
    players: string;
    fieldSize: string;
    neutralPlanets: number;
  }
  
  @Component({
    components: {
      Button
    }
  })
  export default class GameTable extends Vue {
    @Prop() private games!: GameItem[];
  }
</script>

<style scoped lang="scss">
  $main-color: #65F6FF;
  $main-transparent: rgba(101, 246, 255, 0.1);
  
  $scrollbarBG: transparent;
  $thumbBG: #3A7BDB;
  
  .game-list {
    margin: 5vh auto 0 auto;
    width: 80vw;
    border: 1px solid $main-color;
    background: $main-transparent;
    padding: 20px;
    position: relative;
    top: 0;
    left: 0;
    
    .wrapper {
      max-height: calc(80vh - 100px);
      overflow: auto;
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

    &:after {
      z-index: 1;
      display: block;
      content: "";
      position: absolute;
      bottom: -1px;
      left: 30%;
      width: 40%;
      height: 1px;
      border-radius: 5px;
      filter: blur(1px);
      background: rgb(101,246,255);
      background: linear-gradient(90deg, rgba(101,246,255,1) 0%, rgba(255,255,255,1) 30%, rgba(255,255,255,1) 70%, rgba(101,246,255,1) 100%);
      box-shadow: 0 0 5px $main-color;
    }

  }
  
  .left-line,
  .left-top-line,
  .bottom-line,
  .right-bottom-line {
    position: absolute;
    z-index: 1;
  }

  .left-line,
  .left-top-line {
    left: 3px;
    border-left: 1px solid $main-color;
  }
  
  .left-top-line {
    top: 3px;
    width: 40px;
    height: 145px;
    border-top: 1px solid $main-color;
  }
  
  .left-line {
    top: 163px;
    height: 48px;
  }
  
  .right-bottom-line,
  .bottom-line {
    bottom: 3px;
    border-bottom: 1px solid $main-color;
  }
  
  .bottom-line {
    right: 193px;
    width: 90px;
  }
  
  .right-bottom-line {
    right: 3px;
    width: 180px;
    height: 180px;
    border-right: 1px solid $main-color;
  }
  
  table {
    width: 100%;
    border: none;
    border-collapse: collapse;
    position: relative;
    left: 0;
    top: 0;
    z-index: 2;
    padding-bottom: 5px;
    
    tr, td {
      border: none;
      box-sizing: border-box;
      line-height: 40px;
    }

    td {
      text-align: center;
    }

    td:first-child {
      padding-left: 10px;
    }

    td:last-child {
      padding-right: 10px;
    }
    
    tbody {
      tr {
        td > span {
          padding: 10px 0;
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
          padding: 5px 0;
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
        padding-bottom: 20px;
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


