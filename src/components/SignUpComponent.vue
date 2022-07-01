<script setup>
import { ref } from "vue";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";

import { store } from "../store";

import * as cometChatService from "../services/cometchat";
import * as firebaseService from "../services/firebase";
import * as uiService from "../services/ui";

const avatar = ref(null);
const aboutRef = ref(null);
const confirmPasswordRef = ref(null);
const emailRef = ref(null);
const filepickerRef = ref(null);
const fullnameRef = ref(null);
const passwordRef = ref(null);

function chooseAvatar() {
  filepickerRef.value.click();
}

async function signup() {
  try {
    const { about, fullname, email, password, confirmPassword } = getInputs();
    if (
      isSignupValid({
        about,
        fullname,
        email,
        password,
        confirmPassword,
      })
    ) {
      const id = uuidv4();
      const createdAccount = { id, fullname, email, about };
      uiService.showLoading();
      await firebaseService.createAccount(email, password);
      await firebaseService.upload({
        key: "users",
        id,
        payload: avatar.value,
        entity: createdAccount,
        callback: onAvatarUploaded,
      });
      uiService.hideLoading();
      uiService.alert(
        `${email} was created successfully! Please sign in with your created account`
      );
      store.setIsSignUpShown(false);
    }
  } catch (error) {
    console.log(error);
    uiService.hideLoading();
  }
}

async function onAvatarUploaded(entity, url) {
  entity.image = url;
  await firebaseService.insert({
    key: "users",
    id: entity.id,
    payload: entity,
  });
  await cometChatService.createAccount({
    cometChat: store.cometChat,
    id: entity.id,
    fullname: entity.fullname,
    avatar: url,
  });
}

function getInputs() {
  const about = aboutRef.value.value;
  const fullname = fullnameRef.value.value;
  const email = emailRef.value.value;
  const password = passwordRef.value.value;
  const confirmPassword = confirmPasswordRef.value.value;
  return { about, fullname, email, password, confirmPassword };
}

function isSignupValid({ about, fullname, email, password, confirmPassword }) {
  if (!avatar.value) {
    uiService.alert("Please upload your avatar");
    return false;
  }
  if (validator.isEmpty(fullname)) {
    uiService.alert("Please input your fullname");
    return false;
  }
  if (!validator.isEmail(email)) {
    uiService.alert("Please input your email");
    return false;
  }
  if (
    validator.isEmpty(password) ||
    !validator.isLength(password, { min: 6 })
  ) {
    uiService.alert(
      "Please input your password. You password must have at least 6 characters"
    );
    return false;
  }
  if (validator.isEmpty(confirmPassword)) {
    uiService.alert("Please input your confirm password");
    return false;
  }
  if (password !== confirmPassword) {
    uiService.alert("Confirm password and password must be the same");
    return false;
  }
  if (validator.isEmpty(about)) {
    uiService.alert("Please input your description");
    return false;
  }
  return true;
}

function uploadAvatar(e) {
  const reader = new FileReader();
  if (e.target.files[0]) {
    reader.readAsDataURL(e.target.files[0]);
  }
  reader.onload = (readerEvent) => {
    avatar.value = readerEvent.target.result;
  };
}
</script>

<template>
  <div class="signup">
    <div class="signup__content">
      <div class="signup__container">
        <div class="signup__title">Sign Up</div>
        <div class="signup__close">
          <img
            alt="close"
            @click="store.setIsSignUpShown(false)"
            src="https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/__geKiQnSG-.png"
          />
        </div>
      </div>
      <div class="signup__subtitle"></div>
      <div class="signup__form">
        <div v-if="avatar" class="signup__user-avatar" @click="chooseAvatar">
          <img :src="avatar" alt="avatar" />
        </div>
        <div
          v-if="!avatar"
          @click="chooseAvatar"
          class="signup__upload-container"
        >
          Choose File
        </div>
        <input
          class="signup__upload-avatar"
          hidden
          @change="uploadAvatar"
          ref="filepickerRef"
          type="file"
        />
        <input type="text" placeholder="Fullname" ref="fullnameRef" />
        <input type="text" placeholder="Email" ref="emailRef" />
        <input type="password" placeholder="Password" ref="passwordRef" />
        <input
          type="password"
          placeholder="Confirm Password"
          ref="confirmPasswordRef"
        />
        <textarea
          class="signup__about"
          placeholder="Describe yourself here..."
          ref="aboutRef"
        ></textarea>
        <button class="signup__btn" @click="signup">Sign Up</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* The Modal (background) */
.signup {
  background-color: rgba(255, 255, 255, 0.8);
  display: block; /* Hidden by default */
  height: 100%; /* Full height */
  left: 0;
  /* overflow: auto; */
  position: fixed; /* Stay in place */
  top: 0;
  width: 100%; /* Full width */
  z-index: 1; /* Sit on top */
}

/* Modal Content/Box */
.signup__content {
  background-color: #fefefe;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%);
  margin: 0% auto; /* 15% from the top and centered */
  /* margin-top: 10%; */
  width: 27rem; /* Could be more or less, depending on screen size */
}

.signup__container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.signup__title {
  font-size: 1.25rem;
  font-weight: 600;
  padding: 1.25rem 0 0.5rem 1.25rem;
}

.signup__close {
  align-items: center;
  display: grid;
  justify-items: right;
  padding: 1.25rem 1.25rem 0.5rem 0;
}

.signup__close img:hover {
  cursor: pointer;
}

.signup__subtitle {
  background: #e5e7eb;
  height: 1px;
  margin-bottom: 0.5rem;
  width: 100%;
}

.signup__form {
  width: 100%;
  padding: 1.25rem;
}

.signup__user-avatar {
  padding-bottom: 0.5rem;
  text-align: center;
}

.signup__about {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  font-family: inherit;
  font-size: 0.9375rem;
  height: 3.5rem;
  padding: 0.75rem;
  width: 100%;
}

.signup__user-avatar img {
  border-radius: 0.5rem;
  height: 6rem;
  object-fit: cover;
  width: 6rem;
}

.signup__user-avatar img:hover {
  cursor: pointer;
}

.signup__upload-container {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  display: block;
  font-size: 0.9375rem;
  margin-bottom: 0.75rem;
  padding: 0.875rem 1rem;
  width: 100%;
}

.signup__upload-container:hover {
  cursor: pointer;
}

.signup__upload-avatar {
  display: none !important;
}

.signup__form input {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  display: block;
  font-size: 0.9375rem;
  margin-bottom: 0.75rem;
  padding: 0.875rem 1rem;
  width: 100%;
}

.signup__form select {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  display: block;
  font-size: 0.9375rem;
  height: 2.625rem;
  margin-bottom: 0.75rem;
  outline: none;
  padding: 0 1rem;
  width: 100%;
}

.signup__btn {
  background-color: #0b65c2;
  border: 0;
  color: #fff;
  display: block;
  font-size: 1rem;
  font-weight: 600;
  margin: 1.25rem auto;
  outline: none;
  padding: 0.875rem 1rem;
}

.signup__btn:hover {
  cursor: pointer;
  opacity: 0.8;
}
</style>
