<template>
  <div class="q-pa-md">
    <q-btn-dropdown color="grey" outline label="Filter">
      <div class="row no-wrap q-pa-md">
        <div class="column">
          <div class="q-mb-md">Status Filter</div>
          <div>
            <q-option-group
              v-model="statusFilter"
              :options="statusOptions"
              type="checkbox"
            />
          </div>
          <q-separator class="q-my-md" />
          <q-btn
            color="primary"
            label="Search"
            push
            size="sm"
            v-close-popup
            @click="udpateFilter()"
          />
        </div>

        <!-- <div class="column items-center">
          <q-avatar size="72px">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>

          <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>

        </div> -->
      </div>
    </q-btn-dropdown>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const statusFilter = ref(["INFO", "ASSESSMENT", "PAYMENT", "RELEASE"]);
const emit = defineEmits(["filterUpdate"]);

// watch(statusFilter, () => {
//   console.log(statusFilter.value);
// });

const udpateFilter = () => {
  emit("filterUpdate", statusFilter.value);
};

const statusOptions = [
  {
    label: "INFO",
    value: "INFO",
  },
  {
    label: "ASSESSMENT",
    value: "ASSESSMENT",
  },
  {
    label: "PAYMENT",
    value: "PAYMENT",
  },
  {
    label: "RELEASE",
    value: "RELEASE",
  },
  {
    label: "COMPLETED",
    value: "COMPLETED",
  },
];
</script>
