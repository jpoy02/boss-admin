<script setup>
import PageHeader from "src/components/PageHeader.vue";
import QueueRecentApplications from "src/components/Queues/QueueRecentApplications.vue";
import CreateQueue from "src/components/Queues/CreateQueue.vue";
import QueuesList from "src/components/Queues/QueuesList.vue";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useAuth } from "src/composables/useAuth";

const applications = ref([]);
const show = ref(false);

onMounted(async () => {
  const res = await axios.get(process.env.ETRACS_API + "/application?limit=20");
  applications.value = res.data;
  if (useAuth().role.value === "admin") show.value = true;
});
</script>

<template>
  <q-page padding class="q-pt-xl">
    <PageHeader title="Queues" subtitle="Mamange Queues" />

    <div class="row q-gutter-md">
      <div v-if="show" class="col q-gutter-y-md">
        <CreateQueue />
        <QueueRecentApplications />
      </div>
      <div class="col-6 q-gutter-y-md">
        <QueuesList />
      </div>
    </div>
  </q-page>
</template>
