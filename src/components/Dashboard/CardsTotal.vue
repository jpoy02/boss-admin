<script setup>
import moment from "moment";

const props = defineProps({
  title: String,
  total: Number,
  icon_name: String,
  icon_color: String,
});
</script>

<template>
  <q-card class="my-card" flat bordered>
    <q-card-section horizontal class="row justify-between q-pa-md items-center">
      <q-card-section class="q-pt-xs">
        <div class="text-h5 q-mt-sm q-mb-xs">{{ props.title }}</div>
        <div class="text-h1 text-grey">{{ props.total }}</div>
      </q-card-section>

      <q-card-section class="col-5 flex flex-center">
        <q-icon :name="props.icon_name" :color="props.icon_color" size="6rem" />
      </q-card-section>
    </q-card-section>

    <q-separator />

    <q-card-actions
      class="row justify-end q-px-lg text-grey text-weight-regular"
    >
      <q-btn flat round icon="event" />
      <div class="">as of {{ moment().format("MMMM DD, YYYY") }}</div>
    </q-card-actions>
  </q-card>
</template>
