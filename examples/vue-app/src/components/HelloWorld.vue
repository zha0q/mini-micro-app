<template>
  <div>
    <micro-app
      v-if="appShow"
      name="app"
      url="http://localhost:3000"
    ></micro-app>
    <button
      @click="
        () => {
          appShow = !appShow;
        }
      "
    ></button>
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
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
