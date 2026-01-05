<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "Page Title",
  },
  subtitle: {
    type: String,
    default: "caption subtitle",
  },
});
</script>

<template>
  <div class="q-mb-lg">
    <div class="">
      <div class="text-h5">{{ props.title }}</div>
      <div class="text-caption">{{ props.subtitle }}</div>
    </div>
    <div class=""></div>
  </div>
</template>
