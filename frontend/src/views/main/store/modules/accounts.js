import axios from "axios";
import api_url from "@/api/api_url";
import http from "@/api/api_url";
import router from "@/common/lib/vue-router.js";

export default {
  state: () => ({
    token: localStorage.getItem("token") || "",
    kakaoToken: localStorage.getItem("token") || "",
    currentUser: {},
    profile: {},
    authError: null,
    isDuplicatedEmail: true,
    isDuplicatedId: true,
    isPasswordConfirm: false,
    isAuthorized: false,
    comfirmEmail: "",
    isAdmin: false
  }),

  mutations: {
    SET_TOKEN: (state, token) => (state.token = token),
    SET_KAKAOTOKEN: (state, token) => (state.kakaoToken = token),
    SET_CURRENT_USER: (state, user) => (state.currentUser = user),
    SET_AUTH_ERROR: (state, error) => (state.authError = error),
    SET_CHECK_EMAIL: (state, isDuplicatedEmail) =>
      (state.isDuplicatedEmail = isDuplicatedEmail),
    SET_CHECK_ID: (state, isDuplicatedId) =>
      (state.isDuplicatedId = isDuplicatedId),
    SET_PASSWORD_CONFIRM: (state, ispasswordconfirm) =>
      (state.isPasswordConfirm = ispasswordconfirm),
    SET_AUTHORIZED: (state, isAuthorized) =>
      (state.isAuthorized = isAuthorized),
    SET_COMFIRM_EMAIL: (state, comfirmEmail) =>
      (state.comfirmEmail = comfirmEmail),

    CLEER_CURRENT_USER: state => (state.currentUser = {}),
    SET_ADMIN: (state, isAdmin) => (state.idAdmin = isAdmin)
  },
  getters: {
    isValidedEmail: state => state.isValidedEmail,
    isDuplicatedEmail: state => state.isDuplicatedEmail,
    isDuplicatedId: state => state.isDuplicatedId,
    isLoggedIn: state => !!state.token,
    currentUser: state => state.currentUser,
    authError: state => state.authError,
    authHeader: state => ({ Authorization: `Bearer ${state.token}` }),
    isPasswordConfirm: state => state.isPasswordConfirm,
    isAuthorized: state => state.isAuthorized,
    comfirmEmail: state => state.comfirmEmail,
    isAdmin: state => state.isAdmin
  },
  actions: {
    saveToken({ commit }, token) {
      commit("SET_TOKEN", token);
      localStorage.setItem("token", token);
    },
    removeToken({ commit }) {
      commit("SET_TOKEN", "");
      localStorage.setItem("token", "");
    },
    passwordConfirm({ commit, getters }, credentials) {
      axios
        .get(api_url.accounts.passwordConfirm(), {
          params: credentials,
          headers: getters.authHeader
        })
        .then(() => {
          commit("SET_PASSWORD_CONFIRM", true);
          router.push({ name: "mypage" });
        })
        .catch(() => {
          alert("????????? ??????????????????.");
        });
    },

    deleteUser({ dispatch, getters }) {
      axios
        .delete(api_url.accounts.deleteUser(), {
          headers: getters.authHeader
        })
        .then(() => {
          dispatch("logout");
          router.push({ name: "main" });
        })
        .catch(err => {
          console.log(err);
        });
    },
    async updateUser({ dispatch, getters }, credentials) {
      console.log(credentials);
      const formData = new FormData();
      formData.append("multipartFile", credentials.userImg);
      formData.append("updateUserProfileReq.userEmail", credentials.userEmail);
      formData.append("updateUserProfileReq.userName", credentials.userName);
      console.log("???????????? ?????? ");
      console.log(getters.authHeader);
      console.log(formData.get);
      for (let value of formData.values()) {
        console.log(value);
      }
      await axios
        .put(api_url.accounts.updateUser(), formData, {
          headers: {
            Authorization: getters.authHeader.Authorization,
            "Context-Type": "multipart/form-data"
          }
        })
        .then(data => {
          console.log(data);
          dispatch("fetchCurrentUser");
          window.location.reload();
          window.location.reload();
          window.location.reload();
        })
        .catch(err => {
          console.log(err);
        });
    },
    login({ commit, dispatch }, credentials) {
      axios({
        url: api_url.accounts.login(),
        method: "post",
        data: credentials
      })
        .then(res => {
          console.log(res);
          const token = res.data.accessToken;
          const userType = res.data.userType;
          if (userType === "ADMIN") {
            commit("SET_ADMIN", true);
            console.log("??????????????????.");
          } else {
            console.log("???????????? ????????????.");
          }
          console.log("???????????????");
          dispatch("saveToken", token);
          dispatch("fetchCurrentUser");
          router.push({ name: "home" });
        })
        .catch(err => {
          console.error(err.response.data);
          commit("SET_AUTH_ERROR", err.response.data);

          alert("????????? ??????");
        });
    },
    kakaoLoginBtn({ commit, dispatch }) {
      window.Kakao.init("c6a528688d515ebe962756d06b24577e"); // Kakao Developers?????? ?????? ?????? -> JavaScript ???

      if (window.Kakao.Auth.getAccessToken()) {
        window.Kakao.API.request({
          url: "/v1/user/unlink",
          success: function(response) {
            console.log("????????????" + JSON.stringify(response));
            // saveToken(response)
            const token = response.kakao_account.email;
            dispatch("saveToken", token);
            // dispatch('fetchCurrentUser')
            router.push({ name: "home" });
          },
          fail: function(error) {
            console.log(error);
          }
        });
        window.Kakao.Auth.setAccessToken(undefined);
      }

      window.Kakao.Auth.login({
        success: function() {
          window.Kakao.API.request({
            url: "/v2/user/me",
            data: {
              // property_keys: ["kakao_account.email", "kakao_account.nickname"]
            },
            success: async function(response) {
              console.log("???????????????" + JSON.stringify(response));
              const kakaoacount = response.kakao_account;
              const name = kakaoacount.profile.nickname;
              const email = kakaoacount.email;
              const profile1 = kakaoacount.thumbnail_image_url;

              // {
              //   "userEmail": "ssafy@ssafy.com",
              //   "userId": "your_id",
              //   "userName": "?????????",
              //   "userPw": "your_password"
              // }

              const payload = {
                userEmail: email,
                userId: name,
                userName: name
              };

              // const splitedEmail = email.split("@");
              // const emailId = splitedEmail[0];
              // const emailaddress = splitedEmail[1];
              // const emailForSubmit = `?userEmail=${emailId}%40${emailaddress}`;
              // axios({
              //   url: api_url.accounts.emailDuplicateCheck() + emailForSubmit,
              //   method: "get"
              // })
              // .then(res => {
              //   // ????????? ????????? ??????
              //   console.log(res.data);
              //   // commit("SET_CHECK_EMAIL", false);
              //   console.log(emailForSubmit);
              //   axios({
              //     url: api_url.accounts.authEmail() + emailForSubmit,
              //     method: "post"
              //   })
              //     .then(res => {
              //       console.log(res.data);
              //       alert("??????????????? ??????????????????");
              //     })
              //     .catch(err => {
              //       console.log(err.response);
              //       alert("??????????????? ???????????? ?????????????????????.");
              //     });
              // })
              // .catch(err => {
              //   console.log(err.response);
              //   // commit("SET_CHECK_EMAIL", true);
              //   alert("???????????? ????????? ?????????");
              // });
              console.log(payload);
              // saveToken(response)
              const token = response.kakao_account.email;
              dispatch("saveToken", token);
              // dispatch('fetchCurrentUser')
              router.push({ name: "home" });
            },
            fail: function(error) {
              console.log(error);
            }
          });
        },
        fail: function(error) {
          console.log(error);
        }
      });
    },
    logout({ getters, commit, dispatch }) {
      if (getters.isLoggedIn) {
        dispatch("removeToken");
        alert("??????????????? ???????????? ???????????????.");
        commit("CLEER_CURRENT_USER");
        commit("SET_PASSWORD_CONFIRM", false);
        router.push({ name: "login" });
      } else {
        alert("???????????? ????????? ?????????");
      }
    },
    signup({ commit }, payload) {
      const credentials = payload.credential;
      delete credentials.userPw2;
      axios({
        url: api_url.accounts.signup(),
        method: "post",
        data: credentials
      })
        .then(res => {
          console.log(res.data);
          // const token = res.data.key
          // dispatch('saveToken', token)
          // dispatch('fetchCurrentUser')
          alert("???????????? ??????");
          // ???????????? ????????? : ???????????? ?????? false??? ??????????????? ??????
          commit("SET_CHECK_EMAIL", true);
          commit("SET_CHECK_ID", true);
          if (payload.isLoginPage) router.go({ name: "login" });
          else router.push({ name: "login" });
        })
        .catch(err => {
          commit("SET_AUTH_ERROR", err.response.data);
          alert("???????????? ??????");
        });
      // dispatch('login', credentialsForLogin)
    },
    async fetchCurrentUser({ commit, getters, dispatch }) {
      if (getters.isLoggedIn) {
        await axios({
          url: api_url.accounts.currentUserInfo(),
          method: "get",
          headers: getters.authHeader
        })
          .then(res => {
            console.log(res.data);
            const tempuser = {
              userEmail: res.data.userEmail,
              userImg: res.data.userImg,
              userId: res.data.userId,
              userName: res.data.userName
            };
            // console.log(tempuser);
            commit("SET_CURRENT_USER", tempuser);
          })
          .catch(err => {
            if (err.response.status === 401) {
              dispatch("removeToken");
              router.push({ name: "login" });
            }
          });
      }
    },
    findUserid({ commit }, credentials) {
      const splitedEmail = credentials.userEmail.split("@");
      const emailId = splitedEmail[0];
      const emailaddress = splitedEmail[1];
      const emailAndUserNameForSubmit = `?userEmail=${emailId}%40${emailaddress}&userName=${credentials.userName}`;
      axios({
        url: api_url.accounts.findUserid() + emailAndUserNameForSubmit,
        method: "get"
      })
        .then(res => {
          const userId = res.data.userId;
          console.log(userId);
          alert(`????????? ID??? ${userId} ?????????`);
          router.push({ name: "login" });
        })
        .catch(err => {
          console.error(err.response.data);
          alert(err.response.data.message);
          commit("SET_AUTH_ERROR", err.response.data);
        });
    },
    findPassword({ commit }, credentials) {
      console.log(credentials);
      const splitedEmail = credentials.userEmail.split("@");
      const emailId = splitedEmail[0];
      const emailaddress = splitedEmail[1];
      const emailAndUserNameAndUserIdForSubmit = `?userEmail=${emailId}%40${emailaddress}&userName=${credentials.userName}&userId=${credentials.userId}`;
      axios({
        url:
          api_url.accounts.findUserPassword() +
          emailAndUserNameAndUserIdForSubmit,
        method: "post"
      })
        .then(res => {
          alert("?????? ??????????????? ?????????????????????.");
          console.log(res);
          router.push({ name: "login" });
        })
        .catch(err => {
          console.log(err);
          alert("?????? ????????? ???????????? ????????? ????????????.");
          commit("SET_AUTH_ERROR", err.response.data);
        });
    },
    idDuplicateCheck({ commit, getters }, id) {
      const idForSubmit = `?id=${id}`;
      axios({
        url: api_url.accounts.idDuplicateCheck() + idForSubmit,
        method: "get"
      })
        .then(res => {
          // ????????? ????????? ??????
          console.log(res.data);
          commit("SET_CHECK_ID", false);
          console.log(getters.isDuplicatedId);
          alert("??????????????? ??????????????????");
        })
        .catch(err => {
          console.log(err.response);
          commit("SET_CHECK_ID", true);
          console.log(getters.isDuplicatedId);
          alert("???????????? ????????? ?????????");
        });
    },
    changePassword({ getters }, credentials) {
      axios({
        url: api_url.accounts.changepassword(),
        method: "put",
        data: {
          userPw: credentials.userPw,
          newPw: credentials.newPw
        },
        headers: getters.authHeader
      })
        .then(data => {
          console.log(data);
        })
        .catch(err => {
          console.log(credentials);
          console.log(err);
        });
    },
    sendAuthKeyToEmail({ commit }, email) {
      // ?????? => ?????? => true??? ??????
      // ?????? => ?????? => defalt false?????? ??? ??????
      const splitedEmail = email.split("@");
      const emailId = splitedEmail[0];
      const emailaddress = splitedEmail[1];
      const emailForSubmit = `?userEmail=${emailId}%40${emailaddress}`;
      alert("????????? ?????? ????????????. ????????? ??????????????????");
      axios({
        url: api_url.accounts.emailDuplicateCheck() + emailForSubmit,
        method: "get"
      })
        .then(res => {
          // ????????? ????????? ??????
          console.log(res.data);
          commit("SET_CHECK_EMAIL", false);
          console.log(emailForSubmit);
          axios({
            url: api_url.accounts.authEmail() + emailForSubmit,
            method: "post"
          })
            .then(res => {
              console.log(res.data);
              alert("??????????????? ??????????????????");
            })
            .catch(err => {
              console.log(err.response);
              alert("??????????????? ???????????? ?????????????????????.");
            });
        })
        .catch(err => {
          console.log(err.response);
          commit("SET_CHECK_EMAIL", true);
          alert("???????????? ????????? ?????????");
        });
    },
    checkAuthKey({ commit }, authInfo) {
      console.log(authInfo[0]);
      console.log(authInfo[1]);

      const authKey = authInfo[0];
      const email = authInfo[1];

      const splitedEmail = email.split("@");
      const emailId = splitedEmail[0];
      const emailaddress = splitedEmail[1];
      const emailForSubmit = `userEmail=${emailId}%40${emailaddress}`;

      const keyAndEmailForSubmit = `?authKey=${authKey}&${emailForSubmit}`;
      axios({
        url: api_url.accounts.checkAuthKey() + keyAndEmailForSubmit,
        method: "get"
      })
        .then(res => {
          console.log(res.data);
          commit("SET_AUTHORIZED", true);
          commit("SET_COMFIRM_EMAIL", email);
          alert("????????? ?????????????????????.");
        })
        .catch(err => {
          console.log(err.response);
          commit("SET_AUTHORIZED", false);
          alert("????????? ?????????????????????.");
        });
    },
    changeAuthState({ commit, getters }, state) {
      commit("SET_AUTHORIZED", state);
    },
    changeFalseAuthState({ commit, getters }) {
      if (getters.isAuthorized === true) {
        commit("SET_AUTHORIZED", false);
      }
    }
  }
};
