<script setup>
import { onMounted, onUnmounted, onBeforeUnmount, ref, watch } from "vue";
import { useQueueStore } from "src/stores/queueStore";
import DateColumn from "src/components/QueueingColumn/DateColumn.vue";
import WaitingQueueColumn from "src/components/QueueingColumn/WaitingQueueColumn.vue";
import TitleVideoColumn from "src/components/QueueingColumn/TitleVideoColumn.vue";
import ActiveQueueColumn from "src/components/QueueingColumn/ActiveQueueColumn.vue";
const queueStore = useQueueStore();

onMounted(() => {
  queueStore.startListeningForQueueUpdates();
});

onUnmounted(() => {
  queueStore.stopListeningForQueueUpdates();
});
</script>
<template>
  <div class="row bg window-height overflow-hidden q-gutter-x-sm padding">
    <div class="col">
      <div class="column full-height q-col-gutter-sm">
        <div class="col">
          <ActiveQueueColumn />
        </div>
        <div class="col-3">
          <WaitingQueueColumn />
        </div>
      </div>
    </div>

    <div class="col-4">
      <div class="column full-height q-col-gutter-sm">
        <div class="col">
          <TitleVideoColumn />
        </div>
        <div class="col-3">
          <DateColumn />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Shared box style */
.box {
  border-radius: 8px;
  margin: 5px;
}
.full {
  height: 100%;
  width: 100%;
}
.border {
  border: 1px black dotted;
}

.bg {
  background-color: skyblue;
}

.bg-beige {
  background-color: beige;
}
.padding {
  padding: 5px;
}
</style>
