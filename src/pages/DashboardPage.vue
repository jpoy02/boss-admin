<script setup>
import PageHeader from "src/components/PageHeader.vue";
import CardsTotal from "src/components/Dashboard/CardsTotal.vue";
import CalendarWidget from "src/components/Dashboard/CalendarWidget.vue";
import axios from "src/axios";
import { onMounted, ref } from "vue";
import RecentApplicationTable from "src/components/Dashboard/RecentApplicationTable.vue";

const totalData = ref({
  new: 0,
  renew: 0,
  processing: 0,
});

const initData = async () => {
  try {
    const res = await axios.get("/dashboard?" + `appyear=2026`);
    totalData.value = {
      new: res.data[0].new_total,
      renew: res.data[0].renew_total,
      processing: res.data[0].not_completed_total,
    };
    console.log(totalData.value);
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await initData();
});
</script>

<template>
  <q-page padding class="q-pt-xl">
    <PageHeader title="Dashboard" subtitle="BOSS Dashboard" />

    <div class="col q-col-gutter-md">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-lg-4">
          <CardsTotal
            title="New"
            :total="totalData.new"
            icon_name="add_business"
            icon_color="pink"
          />
        </div>
        <div class="col-12 col-sm-6 col-lg-4">
          <CardsTotal
            title="Renew"
            :total="totalData.renew"
            icon_name="published_with_changes"
            icon_color="blue-4"
          />
        </div>
        <div class="col-12 col-sm-12 col-lg-4">
          <CardsTotal
            title="Processing"
            :total="totalData.processing"
            icon_name="manage_search"
            icon_color="green-4"
          />
        </div>
      </div>
      <div class="row q-col-gutter-x-md">
        <div class="col-8">
          <RecentApplicationTable />
        </div>
        <div class="col-4">
          <CalendarWidget />
        </div>
      </div>
    </div>
  </q-page>
</template>
