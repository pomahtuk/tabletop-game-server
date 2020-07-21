<template>
  <div class="input-wrapper">
    <input :value="value" :aria-label="label" :placeholder="placeholder" :type="type" @input="handleInput" @change="handleChange" />
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class TextInput extends Vue {
    @Prop() private value!: string;
    @Prop() private label!: string;
    @Prop() private placeholder!: string;
    @Prop() private type!: "text" | "number" | "password";
    
    created(): void {
      console.log(this.value)
    }

    handleInput(e: InputEvent): void {
      this.$emit('input', (e.target as HTMLInputElement).value)
    }

    handleChange(e: InputEvent): void {
      this.$emit('change', (e.target as HTMLInputElement).value)
    }
  }
</script>

<style scoped lang="scss">
  @import "src/styles/base";
  
  .input-wrapper {
    border: 1px solid $main-color;
    margin-bottom: $spacing-small;
    
    input {
      font-family: "Exo 2", sans-serif;
      font-size: 16px;
      line-height: 19px;
      background: none;
      width: 100%;
      border: none;
      outline: none;
      box-sizing: border-box;
      padding: $spacing-main;
      /*font-weight: 600;*/
      color: $main-color;
    }

    input:focus {
      box-shadow: 0 0 $spacing-small $glow-color;
    }

    input::placeholder {
      font-weight: 300;
      color: rgba($main-color, 0.5);
    }
  }
</style>
