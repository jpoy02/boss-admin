<script setup>
import { ref, warn, watch } from "vue";
import axios from "axios";
import { useAuth } from "src/composables/useAuth";
import { useQueueStore } from "src/stores/queueStore";
import { useUtils } from "src/composables/useUtils";
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps({
  business_id: String,
});
const queueInfo = ref({});
const queueStore = useQueueStore();

watch(props, async () => {
  await fetchQueueInfo();
});
watch(
  () => queueStore.refreshKey,
  async () => {
    await fetchQueueInfo();
  }
);

const fetchQueueInfo = async () => {
  try {
    const { data } = await axios.get(
      process.env.QUEUE_API + `/api/queues/active`,
      { params: { business_objid: props.business_id } }
    );
    queueInfo.value = data || null;
  } catch (err) {
    console.error(err);
  }
};

const checkIfHasQueue = () => {
  if (Object.keys(queueInfo.value).length === 0) return false;
  return true;
};

const callQueueNumber = async () => {
  const role = useAuth().role.value;
  const queue = queueInfo.value;
  if (queue.counter_name === role) {
    const res = axios.post(
      process.env.QUEUE_API + `/api/queues/${queue.id}/notify`
    );
    return console.log("notify");
  }

  try {
    await queueStore.setQueueToProcessing(queue.id, role);
  } catch ({ response }) {
    const err = response?.data;
    if (!err) return;
    const ok = confirm(
      `${err.error}\n\n` +
        `Do you want to end ${err.active_queue.queue_number}\n` +
        `and process ${queue.queue_number}?`
    );
    if (!ok) return;
    await queueStore.setQueueToWaiting(err.active_queue.id, role);
    await queueStore.setQueueToProcessing(queue.id, role);
  }
};

const revertQueueNumber = async () => {
  await queueStore.setQueueToWaiting(queueInfo.value.id, useAuth().role.value);
};

const noShowQueueNumber = async () => {
  if (!confirm(`Set this queue ${queueInfo.value.queue_number} to NO-SHOW?`))
    return;
  try {
    await queueStore.setQueueToNoShow(queueInfo.value.id);
    router.push("/applications");
  } catch (error) {
    console.warn(error);
  }
};
</script>

<template>
  <q-card v-if="checkIfHasQueue()" class="my-card q-pb-md" bordered flat>
    <q-item>
      <q-item-section>
        <q-item-label class="text-weight-bold">
          <q-icon name="numbers" size="20px"></q-icon>
          <span class="q-ml-sm">Active Queue</span>
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-separator class="q-mb-md" />
    <q-item-section class="q-px-xl">
      <div class="row justify-start">
        <q-badge
          outline
          align="top"
          :color="useUtils().queueStatusColor(queueInfo.status)"
          :label="queueInfo.status?.toUpperCase()"
        />
      </div>
      <div class="row justify-between items-center">
        <div class="text-weight-bold" style="font-size: 4rem">
          {{ queueInfo.queue_number }}
        </div>
        <div class="column q-gutter-y-md">
          <q-btn
            size="20px"
            color="amber-10"
            icon="notifications_active"
            label="NOTIFY"
            @click="callQueueNumber()"
          />
          <q-btn
            v-if="queueInfo.status != 'no-show'"
            dense=""
            outline=""
            color="red"
            icon="flag"
            label="NO SHOW"
            @click="noShowQueueNumber()"
          />
          <q-btn
            v-if="
              queueInfo.status == 'processing' || queueInfo.status == 'no-show'
            "
            outline=""
            dense
            label="End"
            class="q-px-md"
            @click="revertQueueNumber()"
          />
          <!-- <q-btn dense label="END" class="q-px-md" @click="revertQueueNumber" /> -->
        </div>
      </div>
    </q-item-section>
  </q-card>
</template>
