<script setup>
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { useQueueStore } from "stores/queueStore";

const queueStore = useQueueStore();
const queuesList = ref([]);

watch(
  () => queueStore.refreshKey,
  () => {
    initData();
  }
);

const cancelQueue = async (id, queue_number) => {
  try {
    if (
      prompt(
        `Are you sure you want to cancel ${queue_number}? \n Type BOSS to cancel`
      ) == "BOSS"
    ) {
      const res = await axios.post(
        process.env.QUEUE_API + `/api/queues/${id}/cancel`
      );
      if (res.data) alert(res.data.message);
    } else {
      alert("Wrong Input");
    }
    queueStore.triggerRefresh();
  } catch (error) {
    alert(error.response.data.error);
  }
};

const completeQueue = async (id, queue_number) => {
  try {
    if (confirm(`Are you sure to complete ${queue_number} ?`)) {
      const res = await axios.post(
        process.env.QUEUE_API + `/api/queues/${id}/complete`
      );
      if (res.data) alert(res.data.message);
    }
  } catch (error) {
    console.log("error: ", error);
  }
};

const initData = async () => {
  try {
    const res = await axios.get(process.env.QUEUE_API + "/api/queues");
    const sorted = res.data.sort((a, b) => {
      // 1️⃣ priority first
      if (a.priority !== b.priority) {
        return Number(b.priority) - Number(a.priority);
      }
      // 2️⃣ FCFS: older first
      return new Date(a.created_at) - new Date(b.created_at);
    });
    queuesList.value = sorted;
    console.log("sorted: ", sorted);
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await initData();
});

const statusColor = (status = "") => {
  switch (status.toLowerCase()) {
    case "waiting":
      return "grey-6";
    case "processing":
      return "blue";
    case "done":
      return "green";
    case "cancelled":
      return "red";
    case "expired":
      return "orange";
    default:
      return "grey";
  }
};
const categoryColor = (type = "") => {
  switch (type.toUpperCase()) {
    case "NEW":
      return "primary"; // blue – fresh / new application
    case "RENEW":
      return "teal"; // continuation / renewal
    case "OTHER":
      return "grey-7"; // neutral / miscellaneous
    default:
      return "grey";
  }
};
</script>
<template>
  <q-card flat bordered class="" style="min-height: 500px">
    <q-item>
      <q-item-section>
        <q-item-label class="text-weight-bold">
          <q-icon name="info" size="20px"></q-icon>
          <span class="q-ml-sm">Queue List</span>
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-separator />
    <q-card-section>
      <div class="q-gutter-y-sm">
        <q-card
          v-for="row in queuesList"
          :key="row.id"
          flat
          bordered
          class="q-pa-md"
          :class="row.status == 'cancelled' ? 'hidden' : ''"
        >
          <div class="row q-mb-md justify-between">
            <div class="">
              <span class="text-h4 text-weight-bold q-mr-xs">
                {{ row.queue_number }}
              </span>
              <q-badge
                outline
                align="top"
                :color="statusColor(row.status)"
                :label="row.status"
              />
            </div>
            <div class="">
              <q-badge
                class="q-mr-xs"
                outline
                align="top"
                :color="categoryColor(row.category)"
                :label="row.category"
              />
              <q-badge
                v-if="row.priority"
                outline
                align="top"
                color="red"
                label="Priority"
              />
            </div>
          </div>
          <div class="row q-gutter-x-md">
            <div class="col">
              <div class="row text-weight-bold text-subtitle2">
                {{ row.businessname }}
              </div>
              <div class="row text-weight-light text-caption">
                {{ row.ownername }}
              </div>
            </div>
            <div class="col">
              <div class="row no-wrap q-gutter-x-sm justify-end">
                <!-- <q-btn dense label="Edit" color="primary" class="col-grow" /> -->
                <q-btn
                  class="q-px-md"
                  dense
                  label="Cancel"
                  icon="delete"
                  outline
                  style="color: orangered"
                  @click="cancelQueue(row.id, row.queue_number)"
                />
                <q-btn
                  class="q-px-md"
                  dense
                  label="Complete"
                  icon="check"
                  outline
                  style="color: green"
                  @click="completeQueue(row.id, row.queue_number)"
                />
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </q-card-section>
  </q-card>
</template>
