<template>
  <div class="add-player">
    <div class="flex">
      <v-select
        :items="items"
        v-model="item"
        outlined
        color="#65F6FF"
      ></v-select>
      <div>
        <Button wide="true" glow="true" @click="handleClick">Add</Button>
      </div>
    </div>
    
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";

  import {ComputerPlayerType} from "@/store/state";
  import {Action} from "vuex-class";
  import {actionTypes, PlayerTypeString} from "@/store/actions";
  import Button from "@/components/base/Button.vue";
  
  interface SelectItem {
    text: string;
    value: ComputerPlayerType | "human";
  }

  @Component({
    components: {
      Button
    }
  })
  export default class AddPlayer extends Vue {
    @Action(actionTypes.ADD_PLAYER) addPlayer!: (playerType: PlayerTypeString) => void
    
    private handleClick(): void {
      this.addPlayer(this.item);
    }
    
    private item: PlayerTypeString = "human";
    
    private items: SelectItem[] = [
      {
        text: "human",
        value: "human"
      },
      {
        text: `bot: ${ComputerPlayerType.EASY.toString()}`,
        value: ComputerPlayerType.EASY
      },
      {
        text: `bot: ${ComputerPlayerType.NORMAL.toString()}`,
        value: ComputerPlayerType.NORMAL
      },
      {
        text: `bot: ${ComputerPlayerType.HARD.toString()}`,
        value: ComputerPlayerType.HARD
      }
    ]
  }
</script>

<style lang="scss">
  @import "src/styles/base";
  
  .add-player {
    margin-top: $spacing-main;
  }
  
  .flex {
    display: flex;
    
    & > .div {
      flex: 3 1;
    }
    
    button.glow.wide {
      padding: 17.5px 0 !important;
    }
  }

  div.v-select__selection--comma {
    color: $main-color !important;
  }

  div.v-text-field--outlined fieldset {
    border: 1px solid $main-color;
    border-radius: 0;
  }

  div.v-text-field--outlined.v-input--is-focused fieldset {
    border: 1px solid $main-color;
    box-shadow: 0 0 $spacing-small $glow-color;
    border-radius: 0;
  }
  
  h2 {
    font-weight: 300;
    font-size: 20px;
    line-height: 25px;
    margin: 0 0 $spacing-main 0;
  }
</style>
