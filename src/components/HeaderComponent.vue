<script setup>
import { useRouter } from "vue-router";
import { store } from "../store";

const router = useRouter();

async function logout() {
  const isLogout = window.confirm("Do you want to log out ?");
  if (isLogout) {
    await store.cometChat.logout();
    removeAuthedInfo();
    router.push({ path: "/login" });
  }
}

function removeAuthedInfo() {
  store.setUser(null);
  localStorage.removeItem("auth");
}
</script>

<template>
  <div class="header">
    <div class="header__left">
      <span>Chat App</span>
      <img :src="store.user.image" alt="store.user.fullname" />
      <span>Hello, {{ store.user.fullname }}</span>
    </div>
    <div class="header__right">
      <div class="header__logout" @click="logout">Logout</div>
    </div>
  </div>
</template>

<style scoped>
.header {
  align-items: center;
  background: #0b65c2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  height: 3.5rem;
  width: 100%;
}

.header__left {
  align-items: center;
  color: #fff;
  display: flex;
  font-weight: bold;
  gap: 0.5rem;
  padding-left: 1rem;
}

.header__left img {
  border-radius: 50%;
  height: 2rem;
  object-fit: cover;
  width: 2rem;
}

.header__right {
  display: flex;
  justify-content: right;
}

.header__logout {
  color: #fff;
  font-weight: bold;
  padding-right: 1rem;
}

.header__logout:hover {
  cursor: pointer;
}
</style>
