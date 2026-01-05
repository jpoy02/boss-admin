<script setup>
import CreateQueueDialog from "../Dialog/CreateQueueDialog.vue";
import moment from "moment/moment";
import { useQueueStore } from "stores/queueStore";
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { useUtils } from "src/composables/useUtils";

const queueStore = useQueueStore();
const utils = useUtils();

const applications = ref([]);
const createQueueDialogState = ref(false);
const selectedApplication = ref({});

watch(
  () => queueStore.refreshKey,
  () => {
    initData();
  }
);

const initData = async () => {
  const res = await axios.get(process.env.ETRACS_API + "/application", {
    params: {
      limit: 10,
      offset: 0,
    },
  });

  applications.value = res.data.data;

  applications.value = applications.value.map((row) => ({
    ...row,
    queue_number: null,
    status: null,
  }));

  await attachActiveQueues();
};

const attachActiveQueues = async () => {
  await Promise.all(
    applications.value.map(async (row) => {
      try {
        const { data } = await axios.get(
          process.env.QUEUE_API +
            `/api/queues/active?business_objid=${row.business_objid}`
        );
        if (data) {
          row.queue_number = data.queue_number;
          row.status = data.status;
        }
      } catch (err) {
        console.error(err);
      }
    })
  );
};

const openDialog = (data) => {
  createQueueDialogState.value = true;
  selectedApplication.value = data;
};
onMounted(async () => {
  await initData();
});

const columns = [
  {
    name: "apptype",
    required: true,
    label: "App Type",
    align: "left",
    field: (row) => row.apptype,
  },
  {
    name: "businessname",
    required: true,
    label: "Business Name",
    align: "left",
    field: (row) => row.businessname,
  },
  {
    name: "state",
    required: true,
    label: "App Status",
    align: "left",
    field: (row) => row.state,
  },
  {
    name: "active_queue",
    required: true,
    label: "Active Queue # (Today)",
    align: "left",
    field: (row) => row.state,
  },
];
</script>

<template>
  <CreateQueueDialog
    :dialog="createQueueDialogState"
    :data="selectedApplication"
    @close-dialog="createQueueDialogState = false"
  />
  <q-card flat bordered class="">
    <q-item>
      <q-item-section>
        <q-item-label class="text-weight-bold">
          <q-icon name="info" size="20px"></q-icon>
          <span class="q-ml-sm">Recent Business Applications</span>
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-separator class="q-mb-md" />

    <q-card-section>
      <q-table
        flat
        :rows="applications"
        :columns="columns"
        row-key="name"
        :rows-per-page-options="[10]"
      >
        <template v-slot:body="props">
          <q-tr
            :props="props"
            @click="openDialog(props.row)"
            class="cursor-pointer"
          >
            <q-td key="apptype" :props="props">
              <div class="text-weight-bold">
                {{ props.row.apptype }}
              </div>
            </q-td>
            <q-td key="businessname" :props="props">
              <div
                class="text-weight-bold"
                style="
                  white-space: normal;
                  word-break: break-word;
                  max-width: 400px;
                "
              >
                {{ props.row.businessname }}
              </div>
              <div
                class="text-weight-light text-capitalize text-caption"
                style="
                  white-space: normal;
                  word-break: break-word;
                  max-width: 400px;
                "
              >
                {{ props.row.ownername.toLowerCase() }}
              </div>
              <div class="q-mt-sm">
                Date filed:
                <span class="text-weight-bold">{{
                  moment(props.row.dtfiled).format("LL")
                }}</span>
              </div>
            </q-td>

            <q-td key="state" :props="props">
              <div class="text-weight-regular q-pa-sm">
                <q-badge
                  rounded
                  outline
                  :color="utils.badgeColor(props.row.state)"
                  class=""
                >
                  <q-icon name="trip_origin" class="q-mr-xs" />
                  {{ props.row.state }}
                </q-badge>
              </div>
            </q-td>

            <q-td key="active_queue" :props="props">
              <div class="text-weight-bold">
                {{ props.row.queue_number }}
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>
