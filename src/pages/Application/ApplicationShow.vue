<script setup>
import PageHeader from "src/components/PageHeader.vue";
import ApplicationInfo from "src/components/Application/ApplicationInfo.vue";
import AssessmentInfo from "src/components/Application/AssessmentInfo.vue";
import ActiveQueueInfo from "src/components/Application/ActiveQueueInfo.vue";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import axios from "src/axios";
import moment from "moment";

const route = useRoute();
const assessment = ref([]);
const totalAssessment = ref("");
const business = ref({
  application_objid: "",
  business_objid: "",
  state: "",
  appno: "",
  apptype: "",
  dtfiled: "",
  ownername: "",
  owneraddress: "",
  tradename: "",
  businessaddress: "",
  txndate: "",
  appyear: "",
  txnmode: "",
  businessname: "",
  bin: "",
});
const previousPendingApplication = ref([]);

const initData = async () => {
  try {
    const res = await axios.get(
      `/application/${route.params.id}?appyear=${route.query.appyear}`
    );
    business.value = res.data;
  } catch (error) {
    console.log("🚀 ~ initData ~ error:", error);
  }
};

const initAssessement = async () => {
  try {
    const res = await axios.get(`/receivable/${route.params.id}`);
    assessment.value = res.data;
    totalAssessment.value = calculateTotalAmount(res.data);
  } catch (error) {
    console.log("🚀 ~ initAssessement ~ error:", error);
  }
};

const initPreviousPendingApplication = async () => {
  try {
    const res = await axios.get(
      `/application/previous_pending_app/${business.value.business_objid}`
    );
    previousPendingApplication.value = res.data;
  } catch (error) {
    console.log("🚀 ~ initPreviousApplication ~ error:", error);
  }
};

const calculateTotalAmount = (data) => {
  const total = data.reduce((total, item) => total + item.amount, 0);
  return total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

onMounted(async () => {
  await initData();
  await initAssessement();
  await initPreviousPendingApplication();
});
</script>

<template>
  <q-page padding class="q-pt-xl">
    <PageHeader title="Assessment" subtitle="View business assessment info" />
    <div class="col q-col-gutter-sm">
      <div class="row q-col-gutter-sm">
        <div class="col-12 col-lg-5 full-height q-gutter-y-sm">
          <ActiveQueueInfo :business_id="business.business_objid" />
          <ApplicationInfo
            :business="business"
            :previous-pending-application="previousPendingApplication"
          />
        </div>

        <div class="col-12 col-lg-7 full-height">
          <AssessmentInfo
            :appyear="String(business.appyear)"
            :assessment="assessment"
            :state="business.state"
            :bus-id="business.business_objid"
            :app-id="business.application_objid"
            :app-type="business.apptype"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>
