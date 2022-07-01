<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import validator from "validator";

import SignUpComponent from "./SignUpComponent.vue";

import { store } from "../store";

import * as cometChatService from "../services/cometchat";
import * as firebaseService from "../services/firebase";
import * as uiService from "../services/ui";

const router = useRouter();

const emailRef = ref(null);
const passwordRef = ref(null);

onMounted(() => {
  const authedUser = JSON.parse(localStorage.getItem("auth"));
  if (authedUser) {
    router.push({ path: "/" });
  } else {
    store.setUser(null);
  }
});

async function login() {
  try {
    uiService.showLoading();
    const { email, password } = getInputs();
    if (isUserCredentialsValid(email, password)) {
      await firebaseService.login(email, password);
      const user = await firebaseService.getSingleDataWithQuery({
        key: "users",
        query: "email",
        criteria: email,
      });
      await cometChatService.login(store.cometChat, user);
      saveAuthedInfo(user);
      uiService.hideLoading();
      router.push({ path: "/" });
    } else {
      uiService.hideLoading();
      uiService.alert(`Your user's name or password is not correct`);
    }
  } catch (error) {
    uiService.hideLoading();
  }
}

function getInputs() {
  const email = emailRef.value.value;
  const password = passwordRef.value.value;
  return { email, password };
}

function isUserCredentialsValid(email, password) {
  return validator.isEmail(email) && password;
}

function saveAuthedInfo(user) {
  store.setUser(user);
  localStorage.setItem("auth", JSON.stringify(user));
}
</script>

<template>
  <div class="login__container">
    <div class="login__welcome">
      <p style="color: #2c3e50; font-weight: bold">
        Build
        <span style="color: #0b65c2">Chat App</span>
        with Vue3
      </p>
    </div>
    <div class="login__form-container">
      <div class="login__form">
        <input type="text" placeholder="Email or phone number" ref="emailRef" />
        <input type="password" placeholder="Password" ref="passwordRef" />
        <button class="login__submit-btn" @click="login">Login</button>
        <span class="login__forgot-password">Forgot password?</span>
        <span class="login__signup" @click="store.setIsSignUpShown(true)"
          >Create New Account
        </span>
      </div>
    </div>
    <SignUpComponent v-if="store.isSignUpShown" />
  </div>
</template>

<style scoped>
.login__container {
  background-color: #f0f2f5;
  display: grid;
  grid-template-columns: 55% 45%;
  height: 100vh;
  width: 100vw;
}

.login__logo {
  width: 10.25rem;
  padding-left: 2.125rem;
}

.login__logo img {
  width: 10.25rem !important;
}

.login__welcome {
  padding-left: 10.5rem;
  padding-top: 13.5rem;
}

.login__welcome img {
  width: 18.75rem;
}

.mt-18 {
  margin-top: -1.125rem;
}

.login__welcome p {
  font-size: 2rem;
  padding-left: 2.125rem;
}

.login__form-container {
  padding-top: 6.5rem;
}

.login__form {
  background-color: #fff;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%);
  padding: 1.25rem;
  width: 24.75rem;
}

.login__form input {
  border: 1px solid #e5e7eb;
  font-size: 1rem;
  margin-bottom: 0.75rem;
  padding: 0.875rem 1rem;
  width: 100%;
}

.login__submit-btn {
  background-color: #0b65c2;
  border: 0;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  outline: none;
  padding: 0.875rem 1rem;
  width: 100%;
}

.login__submit-btn:hover {
  cursor: pointer;
  opacity: 0.8;
}

.login__forgot-password {
  border-bottom: 1px solid #e5e7eb;
  color: #2c3e50;
  display: block;
  font-size: 0.9375rem;
  font-weight: bold;
  padding: 1.25rem 0;
  text-align: center;
}

.login__forgot-password:hover {
  cursor: pointer;
}

.login__signup {
  color: #2c3e50;
  display: block;
  font-size: 0.9375rem;
  font-weight: bold;
  padding: 1.25rem 0;
  text-align: center;
}

.login__signup:hover {
  cursor: pointer;
  opacity: 0.8;
}
</style>
