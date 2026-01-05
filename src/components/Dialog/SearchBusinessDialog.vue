<script setup>
import axios from 'axios'
import { ref, toRefs, watch } from 'vue'

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  search: String,
})
const emit = defineEmits(['close-dialog', 'select-business'])

const { dialog } = toRefs(props)
const dialogState = ref(false)
const searchText = ref('')
const businessList = ref([])
watch(dialog, (newValue) => {
  dialogState.value = newValue
  searchText.value = props.search
  onSearch()
})

const onSearch = async () => {
  try {
    const res = await axios.get(
      `http://localhost:8001/business?search=${searchText.value}` + `&limit=20`,
    )
    businessList.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const onSelect = (data) => {
  emit('select-business', data)
  emit('close-dialog')
}

const closeDialog = () => {
  emit('close-dialog')
}

const columns = [
  {
    name: 'businessname',
    required: true,
    label: 'Business Name',
    align: 'left',
    field: (row) => row.businessname,
  },

  {
    name: 'action',
    required: true,
    label: 'Action',
    align: 'left',
    field: (row) => row.state,
  },
]
</script>
<template>
  <q-dialog v-model="dialogState" @keyup.esc="closeDialog" persistent>
    <q-card style="width: 500px">
      <q-card-section>
        <div class="row justify-between">
          <div class="text-h6">Search Business</div>
          <q-btn icon="close" dense flat round @click="closeDialog"></q-btn>
        </div>
      </q-card-section>
      <q-separator></q-separator>

      <q-card-section>
        <q-input
          dense
          outlined
          label="Search Business / Owner name"
          @keydown.enter="onSearch"
          v-model="searchText"
          @update:model-value="searchText = $event.toUpperCase()"
        >
          <template #append>
            <q-btn flat round dense icon="search" @click="onSearch" />
          </template>
        </q-input>
      </q-card-section>
      <q-card-section>
        <q-table
          flat
          :rows="businessList"
          :columns="columns"
          row-key="name"
          :rows-per-page-options="[5]"
        >
          <template v-slot:body="props">
            <q-tr :props="props" @click="onSelect(props.row)" class="cursor-pointer">
              <q-td key="businessname" :props="props">
                <div
                  class="text-weight-bold"
                  style="white-space: normal; word-break: break-word; max-width: 300px"
                >
                  {{ props.row.businessname }}
                </div>
                <div
                  class="text-weight-light text-capitalize text-caption text-gray q-mb-sm"
                  style="white-space: normal; word-break: break-word; max-width: 400px"
                >
                  {{ props.row.address_text.toLowerCase() }}
                </div>
                <div
                  class="text-weight-regular"
                  style="white-space: normal; word-break: break-word; max-width: 400px"
                >
                  {{ props.row.ownername }}
                </div>
              </q-td>
              <q-td key="action">
                <q-btn label="Select" dense class="q-px-md" flat color="blue"></q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.uppercase-input input {
  text-transform: uppercase;
}
</style>
