<template>
  <div className="App">
    啦啦啦啦啦

    <button
      @click="
        () => {
          router.push({ path: '/title' });
        }
      "
    >
      here
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const appShow = ref(false);

const router = useRouter();
const route = useRoute();

const left = ref(110);
const top = ref(110);

axios
  .get(
    "https://content-manage-dev-1258344699.cos.ap-guangzhou.myqcloud.com/100002/upload/picture/202206/1536962228638834696.png?sign=q-sign-algorithm%3Dsha1%26q-ak%3DAKIDUnqdARRBeqlQovmLegRu74k9JCo8ByVl%26q-sign-time%3D1655275325%3B3233198525%26q-key-time%3D1655275325%3B3233198525%26q-header-list%3Dhost%26q-url-param-list%3D%26q-signature%3D6be102e7ae5e60bf620ac87655dd50c2f3b4d359"
  )
  .then((res) => console.log(res));

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

onMounted(() => {
  const blue = document.getElementsByClassName("block")[0];
  const red = document.getElementsByClassName("block")[1];

  console.log(blue, red);

  const observer = new IntersectionObserver(
    (entries) => {
      console.log(entries);
    },
    {
      root: blue,
    }
  );
  observer.observe(red);
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

.wrapper {
  height: 1500px;
  width: 500px;
  position: relative;
}

.block {
  position: absolute;
  height: 100px;
  width: 100px;
}

micro-app[aaa="113"] {
  color: royalblue;
}
</style>
