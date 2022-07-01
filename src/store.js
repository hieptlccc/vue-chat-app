import { reactive } from "vue";

export const store = reactive({
  cometChat: null,
  user: null,
  isSignUpShown: false,
  setCometChat(cometChat) {
    this.cometChat = cometChat;
  },
  setUser(user) {
    this.user = user;
  },
  setIsSignUpShown(isSignUpShown) {
    this.isSignUpShown = isSignUpShown;
  },
});
