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

    <div class="wrapper">
      <div
        class="block"
        :style="{ backgroundColor: 'red', left: `${left}px`, top: `${top}px` }"
      ></div>
      <div
        class="block"
        :style="{ backgroundColor: 'blue', left: '0', top: '0' }"
      ></div>
      <button
        @click="
          () => {
            top -= 1;
          }
        "
      >
        top
      </button>
      <button
        @click="
          () => {
            left -= 1;
          }
        "
      >
        left
      </button>
    </div>

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

const left = ref(110);
const top = ref(110);

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
