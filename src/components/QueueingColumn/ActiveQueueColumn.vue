<script setup>
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { useQueueStore } from "src/stores/queueStore";

const queueStore = useQueueStore();
const lastCalledQueueId = ref(null);

watch(
  () => queueStore.notifyKey,
  async () => {
    lastCalledQueueId.value = null;
    data.value = [];
    await fetchProcessingQueues();
    lastCalledQueueId.value = queueStore.lastCalledQueueId;
    queueStore.playNotification();
  }
);

watch(
  () => queueStore.refreshKey,
  async () => {
    await fetchProcessingQueues();
    lastCalledQueueId.value = queueStore.lastCalledQueueId;
    console.log("lastq: ", lastCalledQueueId.value);
  }
);

const data = ref([]);
const fetchProcessingQueues = async () => {
  try {
    const res = await axios.get(
      process.env.QUEUE_API + "/api/queues/processing"
    );
    const sortedItems = [...res.data].sort(
      (a, b) =>
        (a.active_counter_id ?? Infinity) - (b.active_counter_id ?? Infinity)
    );

    data.value = sortedItems;
    console.log(data.value);
  } catch (error) {
    console.log(error);
  }
};

const cardSize = () => {
  if (data.value.length <= 3) return "half";
  else return "fit";
};

const counterName = (name) => {
  // bplo", "mpdo", "meo", "mho", "payment", "admin
  if (name == "bplo") return "LICENSING";
  if (name == "mpdo") return "ZONING";
  if (name == "meo") return "ENGINEERING";
  if (name == "payment") return "MTO";
};

onMounted(async () => {
  await fetchProcessingQueues();
});
</script>

<template>
  <q-card class="row full-height q-py-sm">
    <div v-for="item in data" :key="item.id" class="col-4 q-px-sm q-py-sm">
      <q-card class="column" :class="cardSize()">
        <q-card-section
          class="row justify-between"
          style="background-color: #1976d2"
        >
          <!-- <div class="text-white text-weight-bold text-h4">
            Counter {{ item.active_counter_id }}
          </div> -->
          <div class="text-white text-weight-bold text-h4">
            {{ counterName(item.counter_name) }}
          </div>
        </q-card-section>
        <q-card-section
          class="col column items-center justify-center"
          style="padding: 0"
        >
          <div class="fit row">
            <div
              class="text-weight-bold text-h1 row items-center justify-center text-white"
              style="background-color: #1976d2; padding: 0px 2rem"
            >
              {{ item.active_counter_id }}
            </div>
            <div
              class="col text-weight-bold column items-center justify-center text-h1"
              style="background-color: white"
              :class="{ 'blink-row': item.id === lastCalledQueueId }"
            >
              {{ item.queue_number }}

              <q-badge
                rounded
                align="middle"
                color="green-1"
                class="q-px-md q-py-sm text-green-5"
              >
                <q-icon name="lens" color="" class="q-mr-sm" />
                Active</q-badge
              >
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-card>
</template>

<style scoped>
.half {
  width: 100%;
  height: 50%;
}
.third {
  width: 100%;
  height: calc(100% / 3);
}

@keyframes blink {
  0% {
    color: black;
  }
  50% {
    color: gray;
  }
  100% {
    color: black;
  }
}

.blink-row {
  animation: blink 1s ease-in-out 5;
}
</style>
