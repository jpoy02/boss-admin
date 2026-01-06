<script setup>
import { ref, watch, toRefs, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "src/composables/useAuth";
import { useUtils } from "src/composables/useUtils";
import { useQueueStore } from "src/stores/queueStore";

const queueStore = useQueueStore();

import axios from "src/axios";
import { relativeTimeRounding } from "moment";

const role = useAuth().role;
const route = useRoute();
const utils = useUtils();

const emit = defineEmits(["close"]);
const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  assessment: Array,
  appyear: String,
  busId: String,
});

const previousReceivableList = ref([]);

const { dialog } = toRefs(props);
const editableAssessment = ref({});
const lobs = ref([]);
const perLobsItems = ref([]);

const dialogState = ref(false);
watch(dialog, (newValue) => {
  dialogState.value = newValue;

  if (dialogState.value) {
    editableAssessment.value = JSON.parse(JSON.stringify(props.assessment));
    // console.log("editable", editableAssessment.value);
    lobs.value = [
      ...new Map(
        editableAssessment.value
          .filter((i) => i.lob_name && i.lob_objid)
          .map((i) => [
            i.lob_objid,
            { lob_name: i.lob_name, lob_objid: i.lob_objid },
          ])
      ).values(),
    ];
    findItemsPerLob();
    getPrevYearRecievable(Number(props.appyear) - 1, props.busId);
  }
});

const handleSubmit = async () => {
  console.log(editableAssessment.value);
  const hasEmptyValues = editableAssessment.value.some(
    (item) =>
      item.amount === "" || item.amount === null || item.amount === undefined
  );
  if (hasEmptyValues) {
    alert("Please fill in all required assessment amounts.");
    return;
  }
  try {
    const res = await axios.post(
      `/receivable/${route.params.id}`,
      editableAssessment.value
    );
    if (res.data.status == "success") {
      alert("Assessment Updated");
      const queueInfo = await queueStore.getActiveQueues(props.busId);
      console.log("queueInfo: ", queueInfo);

      if (queueInfo.counter_name == role.value) {
        await queueStore.setQueueToWaiting(queueInfo.id, role.value);
        alert("Ending current active queue. Done! ");
      }
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
  }
};

const getPrevYearRecievable = async (appyear, businessId) => {
  const res = await axios.get(`/receivable/${businessId}/${appyear}`);

  const roleKeywords = {
    mpdo: ["ZONING"],
    mho: ["SANITARY", "HEALTH", "WORKING"],
    meo: ["ANNUAL"],
    bplo: ["MAYOR", "GARBAGE", "TAX CLEARANCE", "FIRE"],
  };

  const keywords = roleKeywords[role.value] || [];

  // Filter the array
  const foundItems = res.data
    .filter((item) =>
      keywords.some((keyword) =>
        item.account_title.toUpperCase().includes(keyword.toUpperCase())
      )
    )
    .sort((a, b) => {
      const aIndex = keywords.findIndex((kw) =>
        a.account_title.toUpperCase().includes(kw.toUpperCase())
      );
      const bIndex = keywords.findIndex((kw) =>
        b.account_title.toUpperCase().includes(kw.toUpperCase())
      );
      return aIndex - bIndex;
    });

  previousReceivableList.value = foundItems;
};

const increaseAssessment = (account_title, amount) => {
  const newAmount = amount * 0.03 + amount;
  const item = editableAssessment.value.find((a) =>
    a.account_title.startsWith(account_title)
  );
  // If found, update its amount
  if (item) {
    item.amount = newAmount.toFixed(2); // or item.amount = amount if you want to set instead of add
  } else {
    console.warn("Account title not found:", account_title);
  }
};

const currFormat = (data) => {
  return data.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const findItemsPerLob = () => {
  const array = editableAssessment.value;
  const keywords = ["BUSINESS TAX", "PENALTY", "SURCHARGE"];
  const perLobReceivable = [];

  lobs.value.forEach((element) => {
    const obj = {
      lob_name: element.lob_name,
      lob_objid: element.lob_objid,
      items: [],
    };
    keywords.forEach((item) => {
      const result = array.find(
        (a) =>
          a.account_title.includes(item) &&
          a.lob_name.includes(element.lob_name)
      );
      if (result) obj.items.push(result);
    });
    perLobReceivable.push(obj);
  });
  perLobsItems.value = perLobReceivable;
  console.log("perLobsItems.value: ", perLobsItems.value);
};
</script>

<template>
  <q-dialog v-model="dialogState" persistent>
    <q-card style="min-width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Assessment</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="emit('close')" />
      </q-card-section>
      <q-separator class="q-my-sm" />

      <q-card-section>
        <div class="" v-if="role == 'bplo' || role == 'admin'">
          <q-card-section
            v-for="lob in perLobsItems"
            :key="lob.lob_objid"
            horizontal
            class="block"
          >
            <q-card-section class="q-pt-xs">
              <div class="text-overline">Business Tax: {{ lob.lob_name }}</div>
              <div class="text-caption text-grey q-gutter-y-sm">
                <q-input
                  @focus="$event.target.select()"
                  v-for="item in lob.items"
                  :key="item.objid"
                  input-class="text-right text-weight-bold"
                  outlined
                  dense
                  :prefix="utils.toSentenceCase(item.account_title)"
                  type="number"
                  v-model.number="
                    editableAssessment.find((a) => a.objid == item.objid).amount
                  "
                />
              </div>
            </q-card-section>
          </q-card-section>
        </div>

        <q-card-section
          horizontal
          class="block"
          v-if="role == 'bplo' || role == 'admin'"
        >
          <q-card-section class="q-pt-xs">
            <div class="text-overline">BPLO Fees</div>
            <div class="text-caption text-grey q-gutter-y-sm">
              <q-input
                @focus="$event.target.select()"
                v-if="role == 'bplo' || role == 'admin'"
                input-class="text-right text-weight-bold"
                outlined
                dense
                prefix="Mayor's Permit Fee:"
                type="number"
                v-model.number="
                  editableAssessment.find((a) =>
                    a.account_title.startsWith(`MAYOR'S PERMIT`)
                  ).amount
                "
              />
              <q-input
                @focus="$event.target.select()"
                v-if="role == 'bplo' || role == 'admin'"
                outlined
                dense
                input-class="text-right text-weight-bold"
                prefix="Garbage Fee:"
                type="number"
                v-model.number="
                  editableAssessment.find((a) =>
                    a.account_title.startsWith(`GARBAGE FEE`)
                  ).amount
                "
              />
              <q-input
                @focus="$event.target.select()"
                v-if="role == 'bplo' || role == 'admin'"
                outlined
                dense
                input-class="text-right text-weight-bold"
                prefix="Tax Clearance:"
                type="number"
                v-model.number="
                  editableAssessment.find((a) =>
                    a.account_title.startsWith(`TAX CLEARANCE`)
                  ).amount
                "
              />
              <q-input
                @focus="$event.target.select()"
                v-if="role == 'bplo' || role == 'admin'"
                outlined
                dense
                input-class="text-right text-weight-bold"
                prefix="Fire Inspection Fee:"
                type="number"
                v-model.number="
                  editableAssessment.find((a) =>
                    a.account_title.startsWith(`FIRE INSPECTION FEE`)
                  ).amount
                "
              />
            </div>
          </q-card-section>
        </q-card-section>

        <q-card-section horizontal class="block">
          <q-card-section class="q-pt-xs">
            <div class="text-overline">Regulatory Fees</div>
            <div class="text-caption text-grey q-gutter-y-sm">
              <q-input
                @focus="$event.target.select()"
                v-if="role == 'mho' || role == 'admin'"
                outlined
                dense
                input-class="text-right text-weight-bold"
                prefix="Sanitary Permit / Inspection Fee (MHO):"
                type="number"
                v-model.number="
                  editableAssessment.find((a) =>
                    a.account_title.startsWith(`SANITARY`)
                  ).amount
                "
              />
              <q-input
                @focus="$event.target.select()"
                v-if="role == 'mho' || role == 'admin'"
                outlined
                dense
                input-class="text-right text-weight-bold"
                prefix="Health Certification (MHO):"
                type="number"
                v-model.number="
                  editableAssessment.find((a) =>
                    a.account_title.startsWith(`HEALTH `)
                  ).amount
                "
              />
              <q-input
                @focus="$event.target.select()"
                v-if="role == 'mho' || role == 'admin'"
                outlined
                dense
                input-class="text-right text-weight-bold"
                prefix="Worrking Permit Fee:"
                type="number"
                v-model.number="
                  editableAssessment.find((a) =>
                    a.account_title.startsWith(`WORKING`)
                  ).amount
                "
              />
              <q-input
                @focus="$event.target.select()"
                v-if="role == 'mpdo' || role == 'admin'"
                outlined
                dense
                input-class="text-right text-weight-bold"
                prefix="Zoning (MPDC):"
                type="number"
                v-model.number="
                  editableAssessment.find((a) =>
                    a.account_title.startsWith(`ZONING`)
                  ).amount
                "
              />
              <q-input
                @focus="$event.target.select()"
                v-if="role == 'meo' || role == 'admin'"
                outlined
                dense
                input-class="text-right text-weight-bold"
                prefix="Annual Inspection Fee (ENG'G):"
                type="number"
                v-model.number="
                  editableAssessment.find((a) =>
                    a.account_title.startsWith(`ANNUAL`)
                  ).amount
                "
              />
            </div>
          </q-card-section>
        </q-card-section>

        <q-card-section
          horizontal
          class="block"
          v-if="role == 'bplo' || role == 'admin'"
        >
          <q-card-section class="q-pt-xs">
            <div class="text-overline">Other Fees</div>
            <div class="text-caption text-grey q-gutter-y-sm">
              <q-input
                @focus="$event.target.select()"
                v-if="role == 'bplo' || role == 'admin'"
                input-class="text-right text-weight-bold"
                outlined
                dense
                prefix="Other Charges:"
                type="number"
                v-model.number="
                  editableAssessment.find((a) =>
                    a.account_title.startsWith(`OTHER`)
                  ).amount
                "
              />
              <q-input
                @focus="$event.target.select()"
                v-if="role == 'bplo' || role == 'admin'"
                outlined
                dense
                input-class="text-right text-weight-bold"
                prefix="Permit Fee (Storage of Flammable Mat)"
                type="number"
                v-model.number="
                  editableAssessment.find((a) =>
                    a.account_title.startsWith(
                      `PERMIT FEE (STORAGE OF FLAMMABLE MAT)`
                    )
                  ).amount
                "
              />
              <q-input
                @focus="$event.target.select()"
                v-if="role == 'bplo' || role == 'admin'"
                outlined
                dense
                input-class="text-right text-weight-bold"
                prefix="Signboard and Billboard Fees:"
                type="number"
                v-model.number="
                  editableAssessment.find((a) =>
                    a.account_title.startsWith(`SIGNBOARD`)
                  ).amount
                "
              />
            </div>
          </q-card-section>
        </q-card-section>

        <!-- Previous Year -->
        <q-card-section
          horizontal
          class="block"
          v-if="previousReceivableList.length != 0"
        >
          <q-card-section class="q-pt-xs q-col-gutter-sm">
            <div class="text-overline q-pb-sm">
              Previous Year Assessment: {{ props.appyear - 1 }}
            </div>
            <!-- <div class="text-caption text-grey q-gutter-y-md"></div> -->

            <div
              class="row q-col-gutter-md"
              v-for="item in previousReceivableList"
              v-bind:key="item.objid"
            >
              <div class="col-9 row justify-between items-center">
                <div class="text-caption">
                  {{ utils.toSentenceCase(item.account_title) }}
                </div>
                <div class="">{{ currFormat(item.amount) }}</div>
              </div>

              <div class="col-3">
                <div class="items-center justify-end row">
                  <q-btn
                    dense
                    icon="trending_up"
                    color="secondary"
                    label="3%"
                    class="q-px-md"
                    @click="increaseAssessment(item.account_title, item.amount)"
                  >
                    <q-tooltip
                      class="bg-black text-caption"
                      anchor="top middle"
                      self="bottom middle"
                      :offset="[10, 10]"
                    >
                      Increase based from previous ++
                    </q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card-section>
        <q-separator class="q-my-md" />

        <q-card-section horizontal class="flex justify-end">
          <q-card-section class="">
            <q-btn
              icon="add_business"
              color="primary"
              label="Submit Assessment"
              @click="handleSubmit()"
            ></q-btn>
          </q-card-section>
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
