<script setup>
import PageHeader from "src/components/PageHeader.vue";
import { onMounted, ref } from "vue";
import axios from "src/axios";
import { useUtils } from "src/composables/useUtils";
import { useRouter } from "vue-router";
import AppStatusFilter from "src/components/Application/AppStatusFilter.vue";

const applist = ref([]);
const router = useRouter();
const searchText = ref("");
const searchYear = ref("2026");
const loading = ref(false);
const statusFilter = ref(["INFO", "ASSESSMENT", "PAYMENT", "RELEASE"]);

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0,
});

const initData = async (props) => {
  const { page, rowsPerPage } = props.pagination;
  loading.value = true;
  const offset = (page - 1) * rowsPerPage;
  try {
    const res = await axios.get("/application", {
      params: {
        limit: rowsPerPage,
        offset,
        search: searchText.value,
        appyear: searchYear.value,
        filter: statusFilter.value.join(","),
      },
    });
    console.log("res: ", res);

    pagination.value.page = page;
    pagination.value.rowsPerPage = rowsPerPage;
    pagination.value.rowsNumber = res.data.total;

    applist.value = res.data.data;
    applist.value = applist.value.map((row) => ({
      ...row,
      queue_number: null,
      status: null,
      priority: false,
      created_at: null,
    }));

    await attachActiveQueues();
    const sortPriority = [...applist.value].sort((a, b) => {
      // priority first
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      // then by queue_number (ascending)
      if (a.created_at !== b.created_at) {
        return a.created_at - b.created_at;
      }
      // then by transaction date
      return new Date(a.dtfiled) - new Date(b.dtfiled);
    });
    applist.value = sortPriority;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const onFilterUpdate = async (value) => {
  statusFilter.value = value;
  const paginationInfo = {
    pagination: {
      page: 1,
      rowsPerPage: 20,
      rowsNumber: 0,
    },
  };
  await initData(paginationInfo);
};

const attachActiveQueues = async () => {
  await Promise.all(
    applist.value.map(async (row) => {
      try {
        const { data } = await axios.get(
          process.env.QUEUE_API +
            `/api/queues/active?business_objid=${row.business_objid}`
        );
        if (data) {
          row.queue_number = data.queue_number;
          row.status = data.status;
          row.priority = data.priority;
          row.created_at = data.created_at;
        }
      } catch (err) {
        console.error(err);
      }
    })
  );
};

const handleSearch = async () => {
  statusFilter.value = [];
  const paginationInfo = {
    pagination: {
      page: 1,
      rowsPerPage: 20,
      rowsNumber: 0,
    },
  };
  await initData(paginationInfo);
};

const badgeColor = (state) => {
  if (state === "COMPLETED") return "positive";
  else if (state === "PAYMENT") return "warning";
  else if (state === "RELEASE") return "primary";
  else if (state === "ASSESSMENT") return "negative";
  else return "info";
};

const clickRow = (row) => {
  router.push(`/applications/${row.application_objid}?appyear=${row.appyear}`);
};

const reload = () => {
  window.location.reload();
};

onMounted(() => {
  initData({ pagination: pagination.value });
});

const columns = [
  {
    name: "apptype",
    required: true,
    label: "Application Type",
    align: "left",
    field: (row) => row.apptype,
  },
  {
    name: "state",
    required: true,
    label: "App Status",
    align: "left",
    field: (row) => row.state,
  },
  {
    name: "businessname",
    required: true,
    label: "Business Name",
    align: "left",
    field: (row) => row.businessname,
  },
  {
    name: "businessaddress",
    required: true,
    label: "Business Address",
    align: "left",
    field: (row) => row.businessaddress,
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
  <q-page class="q-pt-xl" padding>
    <PageHeader
      title="Business Applications"
      subtitle="View business application list"
    />

    <div class="q-mb-md">
      <div class="row items-center q-gutter-x-md">
        <q-input
          v-model="searchText"
          outlined
          placeholder="Search"
          style="width: 300px"
          dense
          @keyup.enter="handleSearch"
        >
          <template #append>
            <q-icon
              name="search"
              class="cursor-pointer"
              @click="handleSearch"
            />
          </template>
        </q-input>
        <q-input
          v-model="searchYear"
          outlined
          placeholder="Year"
          style="width: 100px"
          dense
          @keyup.enter="handleSearch"
        >
        </q-input>
        <q-separator inset vertical />
        <div class="">
          <AppStatusFilter @filter-update="onFilterUpdate" />
        </div>
        <div class="row flex-center q-gutter-x-sm">
          <q-btn round icon="sync" @click="reload()" />
        </div>
      </div>
    </div>

    <div class="">
      <q-table
        flat
        :rows="applist"
        :columns="columns"
        row-key="application_objid"
        v-model:pagination="pagination"
        :rows-per-page-options="[20]"
        :loading="loading"
        @request="initData"
      >
        <template #body="props">
          <q-tr
            :props="props"
            class="cursor-pointer"
            @click="clickRow(props.row)"
          >
            <q-td key="apptype" :props="props">
              <div class="text-weight-bold">
                {{ props.row.apptype }}
              </div>
            </q-td>
            <q-td key="state" :props="props">
              <div class="q-pa-sm text-weight-regular">
                <q-badge
                  rounded
                  outline
                  :color="badgeColor(props.row.state)"
                  class=""
                >
                  <q-icon name="trip_origin" class="q-mr-xs" />
                  {{ props.row.state }}
                </q-badge>
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
                class="text-caption text-capitalize text-weight-light"
                style="
                  white-space: normal;
                  word-break: break-word;
                  max-width: 400px;
                "
              >
                {{ props.row.ownername.toLowerCase() }}
              </div>
            </q-td>
            <q-td key="businessaddress" :props="props">
              <div
                class="text-capitalize text-weight-light"
                v-html="
                  props.row.businessaddress.replace(/\n/g, '<br>').toLowerCase()
                "
              ></div>
            </q-td>

            <q-td key="active_queue" :props="props">
              <div class="row items-center q-gutter-md">
                <div class="text-weight-bold text-h6">
                  {{ props.row.queue_number }}
                </div>

                <div class="column q-gutter-xs">
                  <q-badge
                    v-if="props.row.priority"
                    outline
                    align="top"
                    style="font-size: 10px"
                    color="deep-orange-10"
                    label="PRIORITY"
                  />
                  <!-- <q-badge class="">{{ props.row.status }}</q-badge> -->
                  <q-badge
                    v-if="props.row.status"
                    outline
                    align="top"
                    style="font-size: 10px"
                    :color="useUtils().queueStatusColor(props.row.status)"
                    :label="props.row.status?.toUpperCase()"
                  />
                </div>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
