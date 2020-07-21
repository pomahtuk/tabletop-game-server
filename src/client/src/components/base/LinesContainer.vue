<template>
  <div :class="`${className} k-lines`">
    <slot></slot>
    <div class="left-top-line" />
    <div class="right-bottom-line" />
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class LinesContainer extends Vue {
    @Prop() private className!: string;
  }
</script>

<style scoped lang="scss">
  @import "src/styles/base";

  h1 {
    font-weight: 300;
    font-size: 24px;
    line-height: 29px;
    margin: 0 0 $spacing-main 0;
  }
  
  .k-lines {
    position: relative;
    top: 0;
    left: 0;
    box-sizing: border-box;

    & > * {
      z-index: 2;
      position: relative;
    }

    & > div {
      &.left-top-line,
      &.bottom-line,
      &.right-bottom-line {
        position: absolute;
        z-index: 1;
      }

      &.left-top-line,
      &.right-bottom-line {
        &:after {
          display: block;
          content: "";
          position: absolute;
          background: $main-color;
          height: 1px;
          width: 1px;
        }
      }

      &.left-top-line {
        left: 3px;
        border-left: 1px solid $main-color;
      }

      &.left-top-line {
        top: 3px;
        width: 5%;
        height: 20%;
        border-top: 1px solid $main-color;

        &:after {
          height: 33%;
          left: -1px;
          bottom: 0;
          transform: translateY(150%);
        }
      }

      &.right-bottom-line {
        width: 20%;
        height: 30%;
        bottom: 3px;
        right: 3px;
        border-bottom: 1px solid $main-color;
        border-right: 1px solid $main-color;

        &:after {
          width: 50%;
          height: 1px;
          bottom: -1px;
          left: 0;
          transform: translateX(-120%);
        }
      }
    }
  }
</style>
