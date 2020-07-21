<template>
  <button 
    @click="handleClick" 
    :class="{'primary-button': primary, 'lines-inverse': linesInverse, 'glow': glow, 'wide': wide, 'skinny': skinny}"
  >
    <span v-if="avatarUrl" class="avatar">
      <img :src="avatarUrl" alt="user-avatar" />
    </span>

    <slot></slot>
    
    <div class="line top-line" />
    <div class="line bottom-line" />
    <div class="line side-bottom-line"/>
    <div class="line side-top-line"/>
  </button>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class Button extends Vue {
    @Prop() private primary!: boolean;
    @Prop() private linesInverse!: boolean;
    @Prop() private glow!: boolean;
    @Prop() private wide!: boolean;
    @Prop() private avatarUrl?: string;
    @Prop() private skinny?: boolean;

    handleClick(e: Event): void {
      e.preventDefault();
      this.$emit('click');
    }
  }
</script>

<style scoped lang="scss">
  @import "src/styles/base";

  button {
    font-family: inherit;
    color: inherit;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    background: $main-transparent;
    border: 1px solid $main-color;
    box-sizing: border-box;
    box-shadow: 0 4px 4px rgba(black, 0.25);
    backdrop-filter: blur(4px);
    text-align: center;
    margin: 0 1px;
    cursor: pointer;
    outline: none;
    position: relative;
    top: 0;
    left: 0;
    min-width: 150px;
    padding: 12px $spacing-main;
    vertical-align: middle;
    
    &.wide {
      width: 100%;
    }
    
    &.skinny {
      min-width: 0;
      padding: 10px;
      line-height: 10px;
      
      .line {
        display: none;
      }
    }
    
    &:hover,
    &:focus {
      background: rgba($main-color, 0.3);
      box-shadow: 0 4px 4px rgba(black, 0.5);
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
    
    &.primary-button {
      color: $accent-color;
      background: rgba($accent-color, 0.2);
      border: 1px solid $accent-color;
      
      &:hover {
        background: rgba($accent-color, 0.4);
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
      background: rgba($glow-color, 0.9);
      border: 1px solid #00F0FF;
      box-sizing: border-box;
      box-shadow: 0 0 5px $glow-color;
      color: #09AEB8;
      font-weight: bold;
      padding: $spacing-small $spacing-biggest;
      
      &.wide {
        padding: $spacing-main 0;
      }
      
      &:hover, &:focus {
        background: rgba($glow-color, 1);
        box-shadow: 0 0 $spacing-main $glow-color;
      }
      
      .line {
        display: none;
      }
    }

    @media (min-width: 320px) and (max-width: 480px) {
      &.glow {
        padding: $spacing-smallest $spacing-main;
      }
    }
  }
  
  .avatar {
    border-radius: 50%;
    height: 25px;
    margin: -8px 5px -5px 0;
    display: inline-block;
    overflow: hidden;
    vertical-align: middle;
    
    img {
      height: 100%;
    }
  }
</style>
