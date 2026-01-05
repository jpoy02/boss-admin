<script setup>
import PageHeader from "src/components/PageHeader.vue";
import { ref } from "vue";
import moment from "moment";

import axios from "src/axios";

const reportType = ref(["Assessment Records", "type2"]);
const selectedReportType = ref("");
const selectedOffice = ref({
  bplo: {
    value: true,
    label: "BPLO",
    caption:
      "(Mayors Permit Fee, Garbage Fee, Tax Clearance, Fire Inspection Fee)",
  },
  meo: {
    value: true,
    label: "MEO",
    caption: "(Annual Inspection Fee)",
  },
  mpdo: {
    value: true,
    label: "MDPO",
    caption: "(Zoning Clearance)",
  },
  mho: {
    value: true,
    label: "MHO",
    caption:
      "(Sanitary Permit Fee, Health Certificate Fee, Working Permit Fee)",
  },
  others: {
    value: true,
    label: "Others",
    caption:
      "(Other Charges, Permit Fee (Storage of Flammable Mat.), Signboad & Billboad Fee)",
  },
  business_tax: {
    value: true,
    label: "Business Tax",
    caption: "(Business Tax)",
  },
});
const assessmentYear = ref(`${moment().format("yyyy")}`);

const handleGenerateReport = async () => {
  const payload = {
    selectedOffice: selectedOffice.value,
    assessmentYear: assessmentYear.value,
  };

  try {
    const res = await axios.post(
      `/report/${snake(selectedReportType.value)}`,
      payload,
      { responseType: "blob" }
    );
    console.log(res.data);

    // ---- Create a download link ----
    const blob = new Blob([res.data]);
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "report.xlsx"; // name of downloaded file
    link.click();

    // cleanup
    URL.revokeObjectURL(url);
  } catch (error) {
    console.log(error);
  }
};

const snake = (s) =>
  s
    .replace(/[\s\-]+/g, "_")
    .replace(/[A-Z]/g, (m) => "_" + m.toLowerCase())
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
</script>

<template>
  <q-page padding class="q-pt-xl">
    <PageHeader title="Records" subtitle="Generate Records" />

    <div class="col q-gutter-y-s">
      <div class="row q-gutter-x-sm">
        <div class="col full-height">
          <q-card class="my-card q-pb-md" bordered flat>
            <q-item>
              <q-item-section>
                <q-item-label class="text-weight-bold">
                  <q-icon name="assignment" size="20px"></q-icon>
                  <span class="q-ml-sm">Reports</span>
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator class="q-mb-md" />

            <q-item class="q-mb-md">
              <q-item-section>
                <q-select
                  dense=""
                  outlined
                  v-model="selectedReportType"
                  :options="reportType"
                  label="Select report"
                />
              </q-item-section>
            </q-item>
            <q-item class="q-mb-">
              <q-item-section>
                <q-input
                  v-model="assessmentYear"
                  outlined
                  placeholder="Assessment Year"
                  style="width: 200px"
                  dense
                  type="number"
                  :rules="[
                    (val) => !!val || 'Year is required',
                    (val) =>
                      String(val).length === 4 || 'Year must be 4 digits',
                  ]"
                >
                </q-input>
              </q-item-section>
            </q-item>
            <q-separator></q-separator>

            <div class="">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-capitalize"
                    >Assessment options</q-item-label
                  >
                </q-item-section>
              </q-item>

              <div class="">
                <q-item
                  v-for="item in selectedOffice"
                  :key="item.label"
                  tag="label"
                  v-ripple
                >
                  <q-item-section avatar>
                    <q-checkbox v-model="item.value" val="true" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ item.label }}</q-item-label>
                    <q-item-label caption class="">{{
                      item.caption
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator class="q-my-sm"></q-separator>
                <q-item>
                  <q-btn
                    icon="assignment_add"
                    color="primary"
                    label="Generate Report"
                    @click="handleGenerateReport"
                  ></q-btn>
                </q-item>
              </div>
            </div>
          </q-card>
        </div>

        <div class="col full-height">
          <!-- {{ selectedReportType }}
         {{ selectedOffice }}  -->
        </div>
      </div>
    </div>
  </q-page>
</template>
