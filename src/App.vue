<script setup>
import { onMounted } from "vue";
import { RouterView } from "vue-router";

import LoadingComponent from "./components/LoadingComponent.vue";

import { store } from "./store.js";

onMounted(() => {
  initAuthUser();
  initCometChat();
});

function initAuthUser() {
  const authenticatedUser = localStorage.getItem("auth");
  if (authenticatedUser) {
    store.setUser(JSON.parse(authenticatedUser));
  }
}

async function initCometChat() {
  const { CometChat } = await import("@cometchat-pro/chat");
  const appID = `${import.meta.env.VITE_COMETCHAT_APP_ID}`;
  const region = `${import.meta.env.VITE_COMETCHAT_REGION}`;
  const appSetting = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(region)
    .build();
  CometChat.init(appID, appSetting).then(
    () => {
      store.setCometChat(CometChat);
    },
    (error) => {}
  );
}
</script>

<template>
  <div>
    <RouterView />
    <LoadingComponent />
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

input {
  outline: none;
  border: none;
}

::-webkit-scrollbar {
  display: none;
}

.app__container {
  background-color: #fff;
  left: 15rem;
  min-height: 100vh;
  position: fixed;
  top: 3.5rem;
  width: calc(100vw - 15rem);
}

.shown {
  display: block !important;
}

.hidden {
  display: none !important;
}
</style>
