<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />
    <q-btn :to="'applications'"> App</q-btn>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "IndexPage",
});
</script>
