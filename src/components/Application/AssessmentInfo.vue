<script setup>
import AssessmentDialog from "../Dialog/AssessmentDialog.vue";
import { useAuth } from "src/composables/useAuth";
import { ref, computed } from "vue";
import axios from "src/axios";
import { useUtils } from "src/composables/useUtils";
import { useSort } from "src/composables/useSort";

const auth = useAuth();
const utils = useUtils();
const sort = useSort();

const props = defineProps({
  assessment: Array,
  state: String,
  appyear: String,
  busId: String,
  appId: String,
  appType: String,
});
const assessmentDialogState = ref(false);
const selectedAssessment = ref([]);

const trySort = () => {
  console.log("props.assessment: ", props.assessment);
  console.log("Is array?", Array.isArray(props.assessment));
  console.log("First item:", props.assessment[0]);
  console.log("First item title:", props.assessment[0]?.account_title);

  const separatedArrays = sort.splitByRole(props.assessment);
  console.log("separatedArrays: ", separatedArrays);
};

const baseOrder = [
  "BUSINESS TAX",
  "PENALTY",
  "SURCHARGE",
  "MAYOR'S PERMIT",
  "GARBAGE FEE",
  "TAX CLEARANCE",
  "FIRE INSPECTION FEE",
  "SANITARY PERMIT",
  "HEALTH CERTIFICATION",
  "WORKING PERMIT FEE",
  "ZONING CLEARANCE",
  "ANNUAL INSPECTION FEE",
  "OTHER FEES",
  "PERMIT FEE (STORAGE OF FLAMMABLE MAT)",
  "SIGNBOARD AND BILLBOARD FEES",
];

function getOrderIndex(title) {
  // find the base item that appears inside the title
  for (let i = 0; i < baseOrder.length; i++) {
    if (title.includes(baseOrder[i])) {
      return i;
    }
  }
  return 999;
}

const sortedAssessment = computed(() => {
  const assessmentData = props.assessment;
  return assessmentData.sort((a, b) => {
    return getOrderIndex(a.account_title) - getOrderIndex(b.account_title);
  });
});

const openAssessmentDialog = (assessment) => {
  if (props.assessment.length == 0) {
    alert("Need prior Assessment from BPLO");
    return;
  }
  assessmentDialogState.value = true;
  selectedAssessment.value = assessment;
};

const calculateTotalAmount = (data) => {
  const total = data.reduce((total, item) => total + item.amount, 0);
  return utils.currencyFormat(total);
};

const disabledState = computed(() => ({
  disabled: props.state != "ASSESSMENT",
  show: props.state === "ASSESSMENT",
}));

const canShow = (state) => {
  const role = auth.role.value;
  return state == "INFO" && ["bplo", "admin"].includes(role);
};

const assignToMe = async () => {
  if (!confirm("Assign this application to you?")) return;
  try {
    const res = await axios.post("/app-assignment/assign-to-me", {
      appid: props.appId,
      busid: props.busId,
      type: props.appType,
    });
    if (res.data?.status == "success") {
      alert("Application assigned successful");
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <AssessmentDialog
    :appyear="props.appyear"
    :dialog="assessmentDialogState"
    :assessment="selectedAssessment"
    :bus-id="props.busId"
    @close="assessmentDialogState = false"
  />

  <q-card flat bordered class="">
    <q-item>
      <q-item-section>
        <q-item-label class="text-weight-bold">
          <q-icon name="info" outlined size="20px"></q-icon>
          <span class="q-ml-sm">Assessment Info</span>
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-separator class="q-mb-md" />
    <div class="row q-px-lg q-mb-sm justify-between items-center">
      <div class="">
        <q-btn
          v-if="disabledState.show"
          icon="add_business"
          color="primary"
          label="Start Assessment"
          :disable="disabledState.disabled"
          @click="openAssessmentDialog(props.assessment)"
        ></q-btn>

        <q-item
          class="q-mb-md"
          v-if="!['INFO', 'ASSESSMENT'].includes(props.state)"
        >
          <q-item-section>
            <q-item-label
              class="text-capitalize"
              style="font-size: 24px; font-weight: bold"
            >
              <q-badge
                outline
                color="green"
                style="font-size: 16px; font-weight: bold; padding: 3px 15px"
              >
                {{ props.state }}
              </q-badge>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-btn
          v-if="canShow(props.state)"
          icon="assignment_add"
          color="secondary"
          label="Assign To Me"
          @click="assignToMe()"
        ></q-btn>

        <div class="" v-else></div>
      </div>

      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon name="sell" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <span style="font-size: 2rem; font-weight: 600">
              {{ calculateTotalAmount(props.assessment) }}
            </span>
          </q-item-label>
          <q-item-label caption>Total</q-item-label>
        </q-item-section>
      </q-item>
    </div>

    <q-item-section class="q-px-md q-mt-lg">
      <q-table
        flat
        :rows="sortedAssessment.filter((row) => row.amount !== 0)"
        row-key="name"
        hide-bottom
        hide-header
      >
        <template v-slot:body="props">
          <q-tr
            :props="props"
            class="cursor-pointer"
            style="background-color: #f7f7f7"
          >
            <q-td key="account_title" :props="props">
              <div class="text-weight-bold">
                {{ props.row.account_title }}
              </div>
            </q-td>
            <q-td key="amount" :props="props">
              <div
                class="text-weight-bold"
                style="
                  font-size: 1.3rem;
                  font-variant-numeric: tabular-nums;
                  font-family: 'Inter', sans-serif;
                "
              >
                {{ utils.currencyFormat(props.row.amount) }}
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-item-section>
  </q-card>
</template>

<style scoped>
.tnum {
  font-variant-numeric: tabular-nums;
}
</style>
