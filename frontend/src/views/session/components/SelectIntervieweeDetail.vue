<template>
  <label
    class="form-check-label"
    :for="member.user.userId"
    style="margin-bottom:1.3vh; margin-top:1.3vh; margin-left:2,3vh; height: fit-content;"
  >
    <input
      class="form-check-input"
      @change="change()"
      type="radio"
      :id="member.user.userId"
      :value="member.user.userId"
      name="selectInterviewee"
      v-model="interviewUser"
      style="margin-top:1.5vh; color:#653FD3"
    />
    &nbsp;&nbsp;&nbsp;
    <img
      class="profile-photo"
      :src="profileImg"
      style="box-shadow: 0px 0px 7px 1px rgba(0, 0, 0, 0.6); margin-left:3vh; margin-right: 2vh;"
    />
    {{ member.user.userName }}
  </label>
</template>

<script>
import { profile } from "@tensorflow/tfjs-core";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "SelectIntervieweeDetail",
  props: {
    member: Object,
    studentindex: Number,
    sub: Object
  },
  data() {
    return {
      interviewUser: "",
      profileImg: ""
    };
  },
  mounted() {
    this.profileImg = this.member.user.userImg;
    if (this.profileImg == null) {
      this.profileImg = require(`@/assets/images/session/profile.png`);
    }
  },
  computed: {
    clientData() {
      // 이름 띄우기
      const { clientData } = this.getConnectionData();
      return clientData;
    }
  },
  methods: {
    ...mapActions(["changeInterviewUser"]),
    change() {
      this.changeInterviewUser(this.interviewUser);
    },
    getConnectionData() {
      const { connection } = this.sub.stream;
      return JSON.parse(connection.data);
    }
  }
};
</script>

<style scoped>
.profile-photo {
  border-radius: 100%;
  background-color: #c4c1c9;
  margin-left: 3vh;
  height: 5.4vh;
  width: 51.72px;
  height: 51.72px;
}
.form-check-input {
  color: #653fd3;
}
.form-check-input:checked {
  background-color: #917fc7;
  border-color: #917fc7;
}
</style>
