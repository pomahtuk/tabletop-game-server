<template>
  <LinesContainer class-name="players-list panel k-container">
    <h1>players</h1>
    
    <v-slider
      label="Number of players"
      :value="gamePlayerSettings.numPlayers"
      @change="setNumPlayers"
      color="#3A7BDB"
      track-color="rgba(101, 246, 255, 0.3)"
      min="2"
      max="4"
      ticks="always"
      thumb-label="always"
    ></v-slider>
    
    <table class="">
      <tbody>
      <tr v-for="(user, index) in gamePlayerSettings.initialPlayers" :key="user.username">
        <td class="name"><span>{{user.username}}</span></td>
        <td class="type"><span>{{user.isComputer ? `bot: ${user.computerPlayerType}` : "human"}}</span></td>
        <td class="button" @click="() => removePlayer(index)">
          <Button skinny="true" primary="true">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L17 17" stroke="#F1338B"/>
              <path d="M17 1L0.999999 17" stroke="#F1338B"/>
            </svg>
          </Button>
        </td>
      </tr>
      </tbody>
    </table>
    
    add a player
  </LinesContainer>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import LinesContainer from "./LinesContainer.vue";
  import {Action, State} from "vuex-class";
  import {ComputerPlayerType, GamePlayerSettings, Player} from "@/store/state";
  import {actionTypes} from "@/store/actions";
  import Button from "@/components/Button.vue";

  @Component({
    components: {
      LinesContainer,
      Button
    }
  })
  export default class GamePlayerOptions extends Vue {
    @State("gamePlayerSettings") gamePlayerSettings!: GamePlayerSettings;

    @Action(actionTypes.ADD_COMPUTER_PLAYER) addComputerPlayer!: (type: ComputerPlayerType) => void
    @Action(actionTypes.ADD_PLAYER) addPlayer!: (player: Player) => void
    @Action(actionTypes.REMOVE_PLAYER) removePlayer!: (index: number) => void
    @Action(actionTypes.SET_GAME_NUM_PLAYERS) setNumPlayers!: (number: number) => void
  }
</script>

<style scoped lang="scss">
  @import "src/styles/base";
  
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
      text-align: left;
      
      &.name {
        width: 60%;
      }
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

          & > * {
            visibility: hidden;
          }
        }
      }
    }
  }

</style>
