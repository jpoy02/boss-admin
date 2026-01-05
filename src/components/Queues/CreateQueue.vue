<script setup>
import { ref, watch } from "vue";
import { useQueueStore } from "stores/queueStore";
import SearchBusinessDialog from "../Dialog/SearchBusinessDialog.vue";
import axios from "axios";

const queueStore = useQueueStore();

watch(
  () => queueStore.refreshKey,
  () => {
    iniData();
  }
);
const searchBusinessDialogState = ref(false);
const createNewQueueForm = ref({
  business_objid: "",
  businessname: "",
  businessaddress: "",
  ownername: "",
  category: null,
  priority: false,
});

const onSearch = () => {
  console.log(createNewQueueForm.value);
  searchBusinessDialogState.value = true;
};

const selectBusiness = (data) => {
  createNewQueueForm.value.business_objid = data.objid;
  createNewQueueForm.value.businessname = data.businessname;
  createNewQueueForm.value.businessaddress = data.address_text;
  createNewQueueForm.value.ownername = data.ownername;
};

const iniData = () => {
  createNewQueueForm.value = {
    business_objid: "",
    businessname: "",
    businessaddress: "",
    ownername: "",
    category: "",
    priority: false,
  };
};

const handleSubmit = async () => {
  if (createNewQueueForm.value.category == "") alert("Category is required");
  try {
    await axios.post(
      "http://localhost:3000/api/queues",
      createNewQueueForm.value
    );
    queueStore.triggerRefresh();
  } catch (error) {
    console.log(error);
    alert(error.response.data.error);
  }
};
</script>

<template>
  <SearchBusinessDialog
    :dialog="searchBusinessDialogState"
    @close-dialog="searchBusinessDialogState = false"
    :search="createNewQueueForm.businessname"
    @select-business="selectBusiness"
  />
  <q-card flat bordered class="">
    <q-item>
      <q-item-section>
        <q-item-label class="text-weight-bold">
          <q-icon name="info" size="20px"></q-icon>
          <span class="q-ml-sm">Create new Queue</span>
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-separator />
    <q-card-section>
      <!-- <q-input dense outlined label="Business Name" stack-label /> -->
      <q-form @submit="handleSubmit" class="q-col-gutter-md">
        <q-input
          v-model="createNewQueueForm.businessname"
          dense
          outlined
          label="Business Name"
          stack-label
          @keydown.enter="onSearch"
          required
        >
          <template #append>
            <q-btn
              flat
              round
              dense
              icon="search"
              :disable="!createNewQueueForm.businessname"
              @click="onSearch"
            />
          </template>
        </q-input>

        <q-input
          dense
          outlined
          label="Owner Name"
          stack-label
          v-model="createNewQueueForm.ownername"
          required
        />

        <div class="row justify-between q-gutter-md">
          <q-select
            v-model="createNewQueueForm.category"
            outlined
            :options="['NEW', 'RENEW', 'OTHER']"
            label="Application Type"
            stack-label
            dense
            class="col"
          />
          <q-checkbox
            v-model="createNewQueueForm.priority"
            class="col"
            label="Priority (PWD, Senior, etc)"
          />
        </div>
        <q-card-actions align="right">
          <q-btn
            label="Create Queue"
            type="submit"
            color="primary"
            style="width: 200px"
          />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>
