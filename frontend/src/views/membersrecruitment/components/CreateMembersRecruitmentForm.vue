<template>
  <div class="container">
    <h6>스터디 그룹을 만들어 보세요!</h6>
    <form id="createForm" @submit.prevent="submitType(action)" enctype="">
      <div class="py-2 row">
        <label class="title" for="recruitTitle">모집글 제목</label>
        <input
          class="box1"
          v-model="newrecruitmentInfo.recruitTitle"
          type="text"
          id="recruitTitle"
          placeholder="모집글 제목을 작성하세요"
        />
      </div>
      <div class="py-2">
        <span class="title"> 카테고리 </span>
        <label for="stdType" class="type" style="margin-left:13%"
          >기업 면접</label
        >
        <input
          v-model="newrecruitmentInfo.stdType"
          class="radio"
          name="stdType"
          type="radio"
          id="stdType"
          value="COM"
          @click="isCompany('COM')"
          checked
        />
        <label for="stdType" class="type">자율 면접</label>
        <input
          v-model="newrecruitmentInfo.stdType"
          class="radio"
          name="stdType"
          type="radio"
          id="stdType"
          value="FREE"
          @click="isCompany('FREE')"
        />
      </div>
      <div class="py-2 row">
        <label class="title" for="comName">기업명 </label>
        <input
          class="box1"
          v-model="newrecruitmentInfo.comName"
          type="text"
          id="comName"
          :disabled="company"
          placeholder="기업명을 입력하세요"
        />
      </div>
      <div class="py-2">
        <label class="title " for="startDate">기간</label>
        <input v-model="newrecruitmentInfo.startDate" type="date" id="Date" />
        ~
        <input v-model="newrecruitmentInfo.endDate" type="date" id="Date" />
      </div>

      <div class="py-2 row">
        <label class="title" for="stdDay">진행 일시 </label>
        <input
          class="box1"
          v-model="newrecruitmentInfo.stdDay"
          type="text"
          id="stdDay"
          placeholder="진행 일시를 입력하세요"
        />
      </div>
      <div class="py-2 row">
        <label class="title" for="stdLimit"> 모집 인원 </label>
        <input
          class="box1"
          v-model="newrecruitmentInfo.stdLimit"
          type="number"
          id="stdLimit"
          style="width:70px"
          min="1"
          max="10"
        />
      </div>
      <div class="py-2 row">
        <label class="title" for="stdName">스터디 이름 </label>
        <input
          class="box1"
          v-model="newrecruitmentInfo.stdName"
          type="text"
          id="stdName"
          placeholder="스터디 이름을 입력하세요"
        />
      </div>
      <div class="py-2 row">
        <label class="title" for="stdDetail"> 스터디 설명 </label>
        <textarea
          name="box2"
          class="box2"
          form="createForm"
          cols="30"
          rows="10"
          placeholder="스터디 설명을 작성하세요."
          v-model="newrecruitmentInfo.stdDetail"
          id="stdDetail"
          wrap="on"
        ></textarea>
        <!-- <input
          class="box2"
          v-model="newrecruitmentInfo.stdDetail"
          type="text"
          id="stdDetail"
          placeholder="스터디 설명을 작성하세요."
        /> -->
      </div>
      <div>
        <div class="py-2 row">
          <label for="inputImage" class="title">대표 이미지</label>
          <input
            class="box3"
            type="file"
            id="inputImage"
            ref="inputImage"
            @change="imageSelect()"
            multiple
          />
        </div>
        <button class="form-button-submit button">
          {{ action }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "CreateMembersRecruitmentForm",

  props: {
    recruitDetail: Object,
    action: String,
    recruitNo: String
  },

  data() {
    return {
      company: false,
      newrecruitmentInfo: {
        comName: this.recruitDetail.comName,
        endDate: this.recruitDetail.endDate,
        recruitTitle: this.recruitDetail.recruitTitle,
        startDate: this.recruitDetail.startDate,
        stdDay: this.recruitDetail.stdDay,
        stdDetail: this.recruitDetail.stdDetail,
        stdImg: this.recruitDetail.stdImg,
        stdLimit: this.recruitDetail.stdLimit,
        stdName: this.recruitDetail.stdName,
        stdType: this.recruitDetail.stdType || "COM"
      }
    };
  },

  computed: {
    findImage() {
      document.getElementById("inputImage").click();
    }
  },
  methods: {
    ...mapActions([
      "createRecruitment",
      "updateRecruitmentDetail",
      "deleteRecruitmentDetail"
    ]),
    imageSelect() {
      this.newrecruitmentInfo.stdImg = this.$refs.inputImage.files[0];
    },
    upload() {
      const formData = new FormData();
      formData.append("multipartFile", this.newrecruitmentInfo.stdImg);
      formData.append(
        "recruitInfoReq.comName",
        this.newrecruitmentInfo.comName
      );
      formData.append(
        "recruitInfoReq.endDate",
        this.newrecruitmentInfo.endDate
      );
      formData.append(
        "recruitInfoReq.recruitTitle",
        this.newrecruitmentInfo.recruitTitle
      );
      formData.append(
        "recruitInfoReq.startDate",
        this.newrecruitmentInfo.startDate
      );
      formData.append("recruitInfoReq.stdDay", this.newrecruitmentInfo.stdDay);
      formData.append(
        "recruitInfoReq.stdDetail",
        this.newrecruitmentInfo.stdDetail
      );
      formData.append(
        "recruitInfoReq.stdLimit",
        this.newrecruitmentInfo.stdLimit
      );
      formData.append(
        "recruitInfoReq.stdName",
        this.newrecruitmentInfo.stdName
      );
      formData.append(
        "recruitInfoReq.stdType",
        this.newrecruitmentInfo.stdType
      );
      return formData;
    },
    isCompany(type) {
      if (type === "COM") {
        this.company = false;
      } else {
        this.company = true;
      }
    },
    async submitType(action) {
      if (action === "만들기") {
        this.recruitmentConfirmation();
        const formData = await this.upload();
        this.createRecruitment(formData);
      } else if (action === "수정하기") {
        this.recruitmentConfirmation();
        const formData = await this.upload();
        this.updateRecruitmentDetail([this.recruitNo, formData]);
      }
    },
    async recruitmentConfirmation() {
      if (
        this.newrecruitmentInfo.endDate === "" ||
        this.newrecruitmentInfo.recruitTitle === "" ||
        this.newrecruitmentInfo.startDate === "" ||
        this.newrecruitmentInfo.stdDay === "" ||
        this.newrecruitmentInfo.stdDetail === "" ||
        this.newrecruitmentInfo.stdImg == "function File() { [native code] }" ||
        this.newrecruitmentInfo.stdLimit === "" ||
        this.newrecruitmentInfo.stdName === ""
      ) {
        alert("모든 내용을 입력해 주세요.");
        return;
      }
    }
  }
};
</script>

<style scoped>
h6 {
  font-family: "티머니 둥근바람 볼드";
  color: #3c1c9f;
  margin-right: 30px;
}

#file-button {
  background-color: #5cb85c;
  border: 0;
  outline: 0;
  border-radius: 10%;
  color: white;
  height: 30px;
  margin-bottom: 10px;
}
.type,
.radio {
  font-size: 15px;
  margin-left: 15px;
}
input[type="text"]:focus {
  border: 2px solid #555;
}
.container {
  border: #d76d77;
  border-radius: 10%;
  display: flex;
  flex-direction: column;
}
.create-form {
  width: 550px;
  height: 1000px;
  background: #f3f4ff;
}
.title {
  font-family: "티머니 둥근바람";
  width: 130px;
  height: 24px;
  font-style: normal;
  font-weight: 1000;
  font-size: 17px;
  line-height: 150%;
  color: #653fd3;
  margin-top: 4px;
  margin-left: 4px;
}
.box1 {
  width: 250px;
  height: 38px;
  font-size: 15px;
  background: #ffffff;
  border: 1px solid #ced4da;
  border-radius: 4px;
  margin-left: 15px;
}
.box1:disabled {
  background-color: #6c6d6ea2;
  content: "";
}
.box2 {
  width: 250px;
  line-height: 3vh;
  font-size: 15px;
  background: #ffffff;
  border: 1px solid #ced4da;
  border-radius: 4px;
  margin-top: 5px;
  margin-left: 15px;
}
.box3 {
  width: 280px;
  height: 38px;
  font-size: 15px;
  background: #ffffff;
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding-top: 4px;
  margin-left: 15px;
}
#stdLimit {
  width: 50px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

#Date {
  width: 100px;
  margin-right: 10px;
  background-color: #ffffff;
  color: #ced4da;
  border-radius: 10%;
  font-size: 14px;
  text-align: center;
  color: rgb(95, 94, 94);
  border: 0;
  outline: 0;
}
#Date:hover {
  background-color: #efefef;
}
#Date:active {
  background-color: #d1d1d1;
}
#endDate {
  width: 100px;
  margin-right: 0px;
}
input[type="button"],
input[type="submit"],
input[type="reset"],
button,
.button {
  -moz-transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  -webkit-transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  -ms-transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  -webkit-appearance: none;
  position: relative;
  display: inline-block;
  background-color: #ffffff;
  color: #653fd3;
  text-transform: uppercase;
  border-radius: 5px;
  border: 0;
  outline: 0;
  font-size: 0.8em;
  font-weight: 600;
  box-shadow: inset 0 0 0 2px #653fd3;
  font-weight: 500;
  text-align: center;
  font-size: 0.7em;
  letter-spacing: 2px;
  padding: 0.65em 2em 0.65em 2em;
  margin-top: 0.5em;
  margin-bottom: 2em;
  white-space: nowrap;
  overflow: hidden;
  height: 3em;
}
input[type="button"]:hover,
button:hover,
.button:hover {
  background-color: rgba(161, 104, 253, 0.05);
}
input[type="button"]:active,
button:active,
.button:active {
  background-color: rgba(161, 104, 253, 0.15);
}
</style>
