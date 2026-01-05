<template>
  <q-card class="q-pa-xs" bordered flat style="width: 100%">
    <q-card-section class="q-pt-xs">
      <div class="text-h6 q-mt-sm q-mb-xs">Calendar</div>
    </q-card-section>
    <q-date
      v-model="model"
      mask="YYYY-MM-DD"
      minimal
      :events="events"
      event-color="red"
      today-btn
      color="primary"
      class="full-width"
    />

    <div class="q-mt-md text-center">
      <q-btn label="Today" color="primary" flat @click="goToday" />
    </div>
  </q-card>
</template>

<script setup>
import { ref } from "vue";

const model = ref(new Date().toISOString().slice(0, 10));

// example event dates (highlighted)
const events = ref(["2025-01-10", "2025-01-15", "2025-01-24"]);

const goToday = () => {
  model.value = new Date().toISOString().slice(0, 10);
};
</script>

<style scoped>
/* Optional styling */
</style>
