<template>
  <div>
    <div id="app_chat_list" class="container" style="overflow-x: hidden">
      <Message
        v-for="(msg, index) in msgs"
        :key="index"
        :msg="msg.fromMessage"
        :myId="myId"
        :fromId="msg.fromId"
      />
    </div>
  </div>
</template>

<script>
import Message from "./Message";
export default {
  name: "MessageList",
  components: {
    Message
  },
  props: {
    msgs: Array,
    myId: String
  },
  data() {
    return {};
  },
  updated() {
    if (!this.isScrolled) {
      const objDiv = document.getElementById("app_chat_list");
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  },
  methods: {}
};
</script>

<style scoped>
.container {
  background: #ffff;
  overflow: scroll;
  border-radius: 10px 10px 10px 10px;
  height: 85vh;
}
.container::-webkit-scrollbar {
  width: 1.35vh;
}
.container::-webkit-scrollbar-track {
  background-color: #e5e5e5;
  border-radius: 1vh;
}
.container::-webkit-scrollbar-thumb {
  background-color: #afa8ba;
  border-radius: 1vh;
  background-clip: padding-box;
  border: 0.3vh solid transparent;
}
</style>
