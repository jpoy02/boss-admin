<script setup>
import { ref, toRefs, watch } from "vue";
import axios from "axios";
import { useQueueStore } from "stores/queueStore";

const queueStore = useQueueStore();

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close-dialog"]);

const { dialog } = toRefs(props);

const dialogState = ref(false);
const appData = ref({
  priority: false,
  category: "",
});
watch(dialog, (newValue) => {
  dialogState.value = newValue;
  appData.value = {
    priority: false,
    category: props.data.apptype,
    ...props.data,
  };
});

const handleSubmit = async () => {
  try {
    await axios.post(process.env.QUEUE_API + "/api/queues", appData.value);
    queueStore.triggerRefresh();
    closeDialog();
  } catch (error) {
    console.log(error);
    alert(error.response.data.error);
  }
};

const closeDialog = () => {
  emit("close-dialog");
};
</script>

<template>
  <q-dialog v-model="dialogState" @keyup.esc="closeDialog" persistent>
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">Create Queue</div>
      </q-card-section>
      <q-separator class="q-mb-lg"></q-separator>
      <q-card-section class="q-pt-none q-col-gutter-md">
        <q-input
          outlined
          dense
          v-model="appData.businessname"
          label="Business Name"
          stack-label
        />
        <q-input
          outlined
          dense
          v-model="appData.ownername"
          label="Owner Name"
          stack-label
        />

        <q-select
          outlined
          dense
          v-model="appData.category"
          :options="['NEW', 'RENEW', 'OTHER']"
          label="Application Type"
          stack-label
        />
        <div>
          <q-checkbox
            v-model="appData.priority"
            label="Priority (PWD, Senior Citizen, etc)"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          label="Create Queue"
          color="primary"
          @click="handleSubmit"
          style="width: 200px"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
