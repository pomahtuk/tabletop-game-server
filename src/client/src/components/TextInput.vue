<template>
  <div class="input-wrapper">
    <input :aria-label="label" :placeholder="placeholder" :type="type" @input="handleInput" />
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

    handleInput(e: InputEvent) {
      this.$emit('input', (e.target as HTMLInputElement).value)
    }
  }
</script>

<style scoped lang="scss">
  .input-wrapper {
    border: 1px solid #65F6FF;
    margin-bottom: 10px;
    
    input {
      font-family: "Exo 2", sans-serif;
      font-size: 16px;
      line-height: 19px;
      background: none;
      width: 100%;
      border: none;
      outline: none;
      box-sizing: border-box;
      padding: 20px;
      /*font-weight: 600;*/
      color: #65F6FF;
    }

    input:focus {
      box-shadow: 0 0 10px #99FEFF;
    }

    input::placeholder {
      font-weight: 300;
      color: rgba(101, 246, 255, 0.5);
    }
  }
</style>
