<template>
  <div className="App">
    啦啦啦啦啦
    <button
      @click="
        () => {
          appShow = !appShow;
        }
      "
    ></button>
    <micro-app
      v-if="appShow"
      name="app"
      url="http://localhost:3000"
    ></micro-app>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, ref } from "vue";

const appShow = ref(false);

window.addEventListener("click", () => {
  console.log("vue click!!");
  window.globalStr = "vue!!";
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.App {
  color: palegreen;
}
button {
  height: 100px;
  width: 100px;
}
</style>
