<template>
  <modal name="login-modal" :focus-trap="true" :height="'auto'">
    <div class="login-modal">
      <div class="wrapper">
        <div class="modal-title">
          {{ title }}
        </div>
        <div class="partition-form">
          <span v-if="userError" class="user-error">
            {{userError}}
          </span>
          
          <form @keypress.enter="handleGo">
            <TextInput label="email" type="email" placeholder="Email" v-model="email" />
            <TextInput v-if="variant === 'register'" label="username" type="text" placeholder="Username" v-model="username" />
            <TextInput v-if="variant !== 'restore'" label="password" type="password" placeholder="Password" v-model="password" />
          </form>
          
          <div v-if="Object.keys(errors).length > 0" class="errors">
            <span />
          </div>
  
          <div class="button-set">
            <Button glow="true" wide="true" title="GO" @click="handleGo" />
          </div>
          
          <div class="link-switches">
            <a class="forgot-password" @click="setVariant('restore')">Forgot password</a>
            <a class="register" @click="setVariant('register')" v-if="variant === 'login'">Registration</a>
            <a class="login" @click="setVariant('login')" v-if="variant !== 'login'">Log in</a>
          </div>
        </div>
        
        <div class="close-button">
          <button @click="$modal.hide('login-modal')">
            <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.5 1L16.5 17" stroke="#F1338B"/>
              <path d="M16.5 1L0.499999 17" stroke="#F1338B"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="top-right-line" />
      <div class="top-line" />
      <div class="bottom-left-line" />
      <div class="left-line" />
    </div>
  </modal>
</template>

<script lang="ts">
  import {Action, State} from "vuex-class";

  import { Component, Vue } from 'vue-property-decorator';
  import Button from "@/components/Button.vue";
  import TextInput from "@/components/TextInput.vue";
  import {actionTypes} from "@/store/actions";
  import validateUser, { ValidationError } from "@/validators/validateUser";
  import {UserData} from "@/api/users";
  
  export type Variant = "login" | "register" | "restore";
  
  @Component({
    components: {
      Button,
      TextInput
    }
  })
  export default class LoginModal extends Vue {
    private variant: Variant = "login";
    private errors?: ValidationError = {};
    
    private username = "";
    private password = "";
    private email = "";

    @State("userError") userError?: string;
    @Action(actionTypes.LOGIN_USER) login!: (userData: UserData) => Promise<void>
    @Action(actionTypes.REGISTER_USER) register!: (userData: UserData) => Promise<void>
    
    setVariant(variant: Variant) {
      this.errors = {};
      this.variant = variant;
    }

    handleGo() {
      // validate
      this.errors = {};
      const userData: UserData = {
        username: this.username,
          email: this.email,
        password: this.password
      }
      const { valid, errors } = validateUser(this.variant, userData);
      
      if (!valid) {
        this.errors = errors;
        return;
      }
      switch (this.variant) {
        case "login":
          return this.login(userData);
        case "register":
          return this.register(userData);
      }
    }
    
    get title(): string {
      switch (this.variant) {
        case "login":
          return "Log in"
        case "register":
          return "Register"
        default:
          return "Restore"
      }
    }
  }
</script>

<style lang="scss">
  $main-color: #65F6FF;
  $accent-color: #F1338B;
  
  .vm--overlay {
    background: rgba(18, 16, 45, 0.8);
    backdrop-filter: blur(10px);
  }
  
  .vm--modal {
    background: none;
    border-radius: 0;
    box-shadow: none;
    overflow: visible;
  }
  
  .login-modal {
    background: rgba(101, 246, 255, 0.1);
    border: 1px solid $main-color;
    position: relative;
    top: 0;
    left: 0;
    
    .wrapper {
      padding: 20px 60px;
      position: relative;
      top: 0;
      left: 0;
      z-index: 2;
    }

    &:after {
      z-index: 1;
      display: block;
      content: "";
      position: absolute;
      bottom: -1px;
      left: 32%;
      width: 36%;
      height: 1px;
      border-radius: 5px;
      filter: blur(1px);
      background: rgb(101,246,255);
      background: linear-gradient(90deg, rgba(101,246,255,1) 0%, rgba(255,255,255,1) 30%, rgba(255,255,255,1) 70%, rgba(101,246,255,1) 100%);
      box-shadow: 0 0 5px $main-color;
    }
    
    .modal-title {
      font-weight: 300;
      font-size: 24px;
      line-height: 29px;
      text-align: center;
      margin-bottom: 30px;
    }
    
    .top-right-line, 
    .top-line,
    .left-line,
    .bottom-left-line {
      position: absolute;
      z-index: 1;
    }

    .top-right-line,
    .top-line {
      top: 3px;
      border-top: 1px solid $main-color;
    }
    
    .top-right-line {
      right: 3px;
      height: 10px;
      border-right: 1px solid $main-color;
      width: 145px;
    }
    
    .top-line {
      width: 45px;
      right: 168px;
    }

    .left-line,
    .bottom-left-line {
      left: 3px;
      border-left: 1px solid $main-color;
    }
    
    .bottom-left-line {
      bottom: 3px;
      height: 95px;
      width: 195px;
      border-bottom: 1px solid $main-color;
    }
    
    .left-line {
      height: 20px;
      bottom: 103px;
    }
  }

  .close-button {
    position: absolute;
    top: -20px;
    right: -30px;
    z-index: 3;
    
    button {
      outline: none;
      border: none;
      background: none;
      cursor: pointer;
      
      &:hover path {
        stroke-width: 2px;
      }
    }
  }

  .link-switches {
    padding: 40px 0 30px 0;
    text-align: center;
    display: flex;
    justify-content: space-evenly;
    
    a {
      display: inline-block;
      padding-bottom: 5px;
      cursor: pointer;
      border-bottom: 1px solid transparent;

      &:hover,
      &:active {
        border-bottom: 1px solid $main-color;
      }
      
      &.forgot-password {
        color: $accent-color;
        
        &:hover,
        &:active {
          border-bottom: 1px solid $accent-color;
        }
      }
    }
  }

  .user-error {
    display: block;
    background: rgba(241, 51, 139, 0.2);
    border: 1px solid $accent-color;
    box-sizing: border-box;
    backdrop-filter: blur(5px);
    padding: 10px 20px;
    margin-bottom: 15px;

    color: $accent-color;
  }
</style>
