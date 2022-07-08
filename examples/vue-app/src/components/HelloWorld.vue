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

    <button
      @click="
        () => {
          router.push({ path: '/title' });
        }
      "
    >
      here
    </button>

    <micro-app
      v-if="appShow"
      app-name="app"
      url="http://localhost:3000"
      :data="data"
      @datachange="handleDataChange"
    />
  </div>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const appShow = ref(false);

const router = useRouter();
const route = useRoute();

window.addEventListener("click", () => {
  console.log("vue click!!");
  window.globalStr = "vue!!";
});

const data = ref({});

setTimeout(() => {
  data.value = { name: "xixi" };
}, 3000);

const handleDataChange = (v: any) => {
  console.log("父组件接受到的数据", v);
};
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

micro-app[aaa="113"] {
  color: royalblue;
}
</style>
