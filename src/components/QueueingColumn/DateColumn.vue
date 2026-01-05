<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import moment from "moment";
const time = ref("");
const date = ref("");
let intervalId = null;

const updateTime = () => {
  time.value = moment().format("hh:mm:ss a");
  date.value = moment().format("MMMM DD, YYYY");
};
onMounted(() => {
  updateTime();
  intervalId = setInterval(updateTime, 1000);
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <q-card class="full-height row items-center justify-center">
    <q-card-section>
      <div class="text-h1 text-weight-bold row justify-center">
        {{ time }}
      </div>
      <div class="text-h3 text-weight-regular row justify-center q-mt-md">
        {{ date }}
      </div>
    </q-card-section>
  </q-card>
</template>
