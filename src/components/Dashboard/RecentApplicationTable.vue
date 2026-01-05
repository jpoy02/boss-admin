<script setup>
import moment from "moment";
import { onMounted, ref } from "vue";
import axios from "src/axios";
import { useRouter } from "vue-router";
const router = useRouter();

const data = ref([]);
const columns = [
  {
    name: "apptype",
    required: true,
    label: "Application Type",
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
    name: "dtfiled",
    required: true,
    label: "Date Filed",
    align: "left",
    field: (row) => row.dtfiled,
  },
  {
    name: "state",
    required: true,
    label: "App Status",
    align: "left",
    field: (row) => row.state,
  },
];

const badgeColor = (state) => {
  if (state == "COMPLETED") return "green";
  else if (state == "PAYMENT") return "warning";
  else if (state == "RELEASE") return "orange";
  else if (state == "ASSESSMENT") return "red";
  else return "info";
};
const clickRow = (row) => {
  router.push(
    "/applications/" + row.application_objid + `?appyear=${row.appyear}`
  );
};
const initData = async () => {
  try {
    const res = await axios.get("/application", {
      params: {
        limit: 10,
        offset: 0,
      },
    });

    data.value = res.data.data;
  } catch (error) {
    console.log("🚀 ~ initData ~ error:", error);
  }
};

onMounted(async () => {
  await initData();
});
</script>

<template>
  <q-card class="my-card q-pa-xs" flat bordered>
    <q-card-section class="q-pt-xs">
      <div class="text-h6 q-mt-sm q-mb-xs">Recent Application</div>
    </q-card-section>
    <q-card-section>
      <q-table
        flat
        :rows="data"
        :columns="columns"
        row-key="name"
        :rows-per-page-options="[0]"
      >
        <template v-slot:body="props">
          <q-tr
            :props="props"
            @click="clickRow(props.row)"
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
            </q-td>
            <q-td key="dtfiled" :props="props">
              <div class="text-weight-bold">
                {{ moment(props.row.dtfiled).format("LL") }}
              </div>
            </q-td>
            <q-td key="state" :props="props">
              <div class="text-weight-regular q-pa-sm">
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
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>
