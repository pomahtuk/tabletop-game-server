<template>
  <table>
    <tbody>
    <tr v-for="(player, index) in players" :key="player.id">
      <td class="name"><span>{{player.username}}</span></td>
      <td class="type"><span>{{player.isComputer ? `bot: ${player.computerPlayerType}` : "human"}}</span></td>
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
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import Button from "@/components/base/Button.vue";
  import {Player} from "@/store/state";
  import {Action} from "vuex-class";
  import {actionTypes} from "@/store/actions";

  @Component({
    components: {
      Button
    }
  })
  export default class PlayerTable extends Vue {
    @Prop() private players!: Player[];
    @Action(actionTypes.REMOVE_PLAYER) removePlayer!: (index: number) => void
  }
</script>

<style scoped lang="scss">
  @import "src/styles/base";

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
