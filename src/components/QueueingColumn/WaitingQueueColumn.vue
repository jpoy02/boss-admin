<script setup>
import { onMounted, ref, watch } from "vue";
import axios from "axios";

import { useQueueStore } from "src/stores/queueStore";
const queueStore = useQueueStore();
watch(
  () => queueStore.refreshKey,
  async () => {
    await fetchWaitingQueues();
  }
);

const data = ref([]);
const fetchWaitingQueues = async () => {
  try {
    const res = await axios.get(process.env.QUEUE_API + "/api/queues/waiting");
    data.value = res.data;
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await fetchWaitingQueues();
});
</script>

<template>
  <q-card class="my-card column overflow-hidden" style="height: 100%">
    <q-card-section
      class="row justify-between"
      style="background-color: #1976d2"
    >
      <div class="text-white text-weight-bold text-h4">WAITING...</div>
    </q-card-section>
    <q-card-section class="col row items-center justify-center">
      <div
        v-for="item in data"
        :key="item.id"
        class="text-weight-bold text-h2 q-mx-lg q-py-xs q-px-sm text-grey-9"
      >
        {{ item.queue_number }}
      </div>
    </q-card-section>
  </q-card>
</template>
