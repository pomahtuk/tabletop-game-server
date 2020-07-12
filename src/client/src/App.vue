<template>
  <div id="app">
    <div class="backdrop-before"></div>
    <div id="nav">
      <div class="logo">
        <span class="logo-accent">Konquest.</span>
        space
      </div>
      <div class="nav-links">
        <Button
          v-if="user"
          title="Start game"
          primary="true"
        />
        <Button
          v-if="!user"
          title="Log in"
          @click="$modal.show('auth-modal')"
          lines-inverse="true"
        />
        <Button
          v-if="user"
          :title="logoutText"
          @click="logoutUser"
          lines-inverse="true"
        />
      </div>
    </div>
    <router-view />
    <div class="backdrop-after"></div>

    <LoginModal />
    
  </div>
</template>

<script lang="ts">
  import Button from '@/components/Button.vue'
  import LoginModal from '@/components/AuthModal.vue'

  import { Component, Vue } from 'vue-property-decorator';
  import {Action, State} from "vuex-class";
  import { User } from "@/store/state";
  import {actionTypes} from "@/store/actions";

  @Component({
    components: {
      Button,
      LoginModal
    }
  })
  export default class App extends Vue {
    @State user?: User;
    @Action(actionTypes.CHECK_USER) checkUser!: () => Promise<void>
    @Action(actionTypes.LOGOUT_USER) logoutUser!: () => Promise<void>

    created() {
      this.checkUser();
    }
    
    get logoutText(): string {
      return this.user ? `${this.user.username} (log out)` : ""
    }
  }
</script>

<style lang="scss">
$main-color: #65F6FF;
$accent-color: #F1338B;
  
body {
  padding: 0;
  margin: 0;
  height: 100vh;
  width: 100vw;
  z-index: 0;
  background: url("../public/img/bg.png");
}

#app {
  font-family: 'Exo 2', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  color: $main-color;
  z-index: 2;
  position: relative;
  top: 0;
  left: 0;

  .backdrop-before,
  .backdrop-after {
    display: block;
    content: "";
    border-radius: 50%;
    position: absolute;
    z-index: 1;
  }

 .backdrop-before {
    width: 45vh;
    height: 45vh;
    left: -14vh;
    top: -14vh;
    background: rgba(64, 34, 119, 0.4);
    filter: blur(30vh);
  }

  .backdrop-after {
    width: 60vh;
    height: 60vh;
    right: -25vh;
    bottom: -25vh;
    background: rgba(101, 218, 255, 0.1);
    filter: blur(40vh);
  }

}

#nav {
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  z-index: 2;
  position: relative;
  top: 0;
  left: 0;
  
  .logo {
    color: $main-color;
    font-weight: bold;
    font-size: 16px;
    line-height: 19px;
    margin-top: 10px;
    
    .logo-accent {
      color: $accent-color;
    }
  }
}
</style>
