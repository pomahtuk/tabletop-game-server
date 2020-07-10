<template>
  <button v-bind:class="{'primary': primary, 'lines-inverse': linesInverse, 'glow': glow}">
    {{ title }}
    <div class="line top-line"></div>
    <div class="line bottom-line"></div>
    <div class="line side-bottom-line"></div>
    <div class="line side-top-line"></div>
  </button>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class Button extends Vue {
    @Prop() private title!: string;
    @Prop() private primary!: boolean;
    @Prop() private linesInverse!: boolean;
    @Prop() private glow!: boolean;
  }
</script>

<style scoped lang="scss">
  $accent-color: #F1338B;
  $main-color: #65F6FF;

  button {
    font-family: inherit;
    padding: 0;
    color: inherit;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    background: rgba(101, 246, 255, 0.1);
    border: 1px solid $main-color;
    box-sizing: border-box;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(4px);
    text-align: center;
    margin: 0 1px;
    cursor: pointer;
    outline: none;
    position: relative;
    top: 0;
    left: 0;
    width: 150px;
    padding: 12px 0;
    
    &:hover {
      background: rgba(101, 246, 255, 0.3);
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.5);
    }
    
    .top-line,
    .bottom-line {
      position: absolute;
      height: 3px;
      right: 3px;
      border-right: 1px solid $main-color;
    }

    .top-line {
      width: 18px;
      top: 2px;
      border-top: 1px solid $main-color;
    }

    .bottom-line {
      width: 22px;
      bottom: 2px;
      border-bottom: 1px solid $main-color;
    }
    
    .side-bottom-line,
    .side-top-line {
      position: absolute;
      left: 3px;
      width: 1px;
      border-left: 1px solid $main-color;
    }

    .side-bottom-line {
      height: 17px;
      bottom: 2px;
    }

    .side-top-line {
      height: 8px;
      bottom: 25px;
    }
    
    &.lines-inverse {
      .top-line,
      .bottom-line {
        right: auto;
        left: 3px;
        border-right: none;
        border-left: 1px solid $main-color;
      }
      
      .top-line {
        width: 22px;
      }

      .bottom-line {
        width: 18px;
      }

      .side-bottom-line,
      .side-top-line {
        left: auto;
        right: 3px;
        bottom: auto;
      }

      .side-bottom-line {
        top: 2px;
      }

      .side-top-line {
        top: 25px;
      }
    }
    
    &.primary {
      color: $accent-color;
      background: rgba(241, 51, 139, 0.2);
      border: 1px solid $accent-color;
      
      &:hover {
        background: rgba(241, 51, 139, 0.4);
      }
      
      .top-line {
        border-top: 1px solid $accent-color;
        border-right: 1px solid $accent-color;
      }

      .bottom-line {
        border-bottom: 1px solid $accent-color;
        border-right: 1px solid $accent-color;
      }
      
      .side-bottom-line,
      .side-top-line {
        border-left: 1px solid $accent-color;
      }
      
      &.lines-inverse {
        .top-line,
        .bottom-line {
          border-right: none;
          border-left: 1px solid $accent-color;
        }
      }
    }
    
    &.glow {
      background: rgba(153, 254, 255, 0.9);
      border: 1px solid #00F0FF;
      box-sizing: border-box;
      box-shadow: 0 0 5px #99FEFF;
      color: #09AEB8;
      font-weight: bold;
      width: auto;
      padding: 10px 50px;
      
      &:hover {
        background: rgba(153, 254, 255, 1);
        box-shadow: 0 0 20px #99FEFF;
      }
      
      .line {
        display: none;
      }
    }

    @media (min-width: 320px) and (max-width: 480px) {
      &.glow {
        padding: 5px 20px;
      }
    }
  }
</style>
