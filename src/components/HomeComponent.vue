<script setup>
import HeaderComponent from "./HeaderComponent.vue";
import { CometChatUI } from "../cometchat-pro-vue-ui-kit/CometChatWorkspace/src/index";

import { store } from "../store";
</script>

<template>
  <div v-if="store.cometChat">
    <HeaderComponent />
    <div class="chat">
      <CometChatUI />
    </div>
  </div>
</template>

<style scoped>
.chat {
  height: calc(100vh - 3.5rem);
}
</style>
