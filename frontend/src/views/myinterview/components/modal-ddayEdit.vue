<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              DDAY 를 설정해보세요

              <!-- {{ dday }} -->
              <!-- <button @click="checkdday()"></button> -->
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <input
                class="form-control"
                type="text"
                v-model="dday.ddayTitle"
                required
              />

              <br />
              <input
                class="form-control"
                type="date"
                v-model="dday.ddayDate"
                required
              />
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <div
                class="btn-group"
                role="group"
                aria-label="Basic outlined example"
              >
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  @click="updateDday([no, ddays]), $emit('close')"
                >
                  수정하기
                </button>
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  @click="$emit('close')"
                >
                  닫기
                </button>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  props: {
    dday: Object,
    no: Number
  },
  data() {
    return {
      ddays: {
        ddayDate: this.dday.ddayDate,
        ddayTitle: this.dday.ddayTitle
      },
      ddaykim: {}
    };
  },
  computed: {
    ...mapGetters(["currentDdays"])
  },
  methods: {
    ...mapActions(["createDday", "updateDday", "getDdayDetail"]),

    mounted() {
      console.log("밑에 디데이" + this.dday);
      console.log("키" + this.key);
    },
    created() {
      console.log("폼생성");
    }
  }
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
  color: #555555;
}

.modal-container {
  width: 400px;
  height: auto;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  border-radius: 20px;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.btn-outline-primary {
  --bs-btn-color: #9c7bfd;
  --bs-btn-border-color: #9c7bfd;
  --bs-btn-hover-color: #fff;
  --bs-btn-hover-bg: #9c7bfd;
  --bs-btn-hover-border-color: #9c7bfd;
  --bs-btn-focus-shadow-rgb: 13, 110, 253;
  --bs-btn-active-color: #fff;
  --bs-btn-active-bg: #9c7bfd;
  --bs-btn-active-border-color: #9c7bfd;
  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  --bs-btn-disabled-color: #9c7bfd;
  --bs-btn-disabled-bg: transparent;
  --bs-btn-disabled-border-color: #9c7bfd;
  --bs-gradient: none;
  border-width: 0.23vh;
}
</style>
