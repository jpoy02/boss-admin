<script setup>
import moment from "moment";
import { onMounted } from "vue";
const props = defineProps({
  business: Object,
  previousPendingApplication: Array,
});
</script>

<template>
  <div class="row full-height">
    <div class="col-12 col-xs-6 q-mb-sm">
      <q-card class="my-card q-pb-md" bordered flat>
        <q-item>
          <q-item-section>
            <q-item-label class="text-weight-bold">
              <q-icon name="room_preferences" size="20px"></q-icon>
              <span class="q-ml-sm">Business Info</span>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator class="q-mb-md" />

        <q-item class="q-mb-md">
          <q-item-section>
            <q-item-label
              class="text-capitalize"
              style="font-size: 24px; font-weight: bold"
              >{{ props.business.businessname.toLowerCase() }}</q-item-label
            >
            <q-item-label caption>{{ props.business.tradename }}</q-item-label>
          </q-item-section>
        </q-item>

        <div class="row">
          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-capitalize">{{
                  props.business.ownername.toLowerCase()
                }}</q-item-label>
                <q-item-label caption>Owner Name</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label class="text-capitalize">{{
                  props.business.owneraddress.toLowerCase()
                }}</q-item-label>
                <q-item-label caption>Owner Address</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-capitalize">{{
                  props.business.businessaddress.toLowerCase()
                }}</q-item-label>
                <q-item-label caption>Business Address</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-card>
    </div>

    <div class="col-12 col-xs-6">
      <q-card class="my-card q-pb-md full-height" bordered flat>
        <q-item>
          <q-item-section>
            <q-item-label class="text-weight-bold">
              <q-icon name="info" outlined size="20px"></q-icon>
              <span class="q-ml-sm">Application Info</span>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator class="q-mb-md" />

        <div class="row">
          <div class="col">
            <q-item class="q-mb-md">
              <q-item-section>
                <q-item-label
                  class="text-capitalize"
                  style="font-size: 24px; font-weight: bold"
                >
                  {{ props.business.apptype }}
                </q-item-label>
                <q-item-label caption>
                  {{ props.business.appno }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col">
            <q-item class="q-mb-md">
              <q-item-section>
                <q-item-label
                  class="text-capitalize"
                  style="font-size: 24px; font-weight: bold"
                >
                  <q-badge
                    outline
                    color="green"
                    style="
                      font-size: 16px;
                      font-weight: bold;
                      padding: 3px 15px;
                    "
                  >
                    {{ props.business.state }}
                  </q-badge>
                </q-item-label>
                <q-item-label caption>Application State</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-capitalize">{{
                  props.business.appyear
                }}</q-item-label>
                <q-item-label caption>Application Year</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label class="text-capitalize">{{
                  props.business.bin
                }}</q-item-label>
                <q-item-label caption>BIN</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-capitalize">{{
                  moment(props.business.dtfiled).format("LL")
                }}</q-item-label>
                <q-item-label caption>Date Filed</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label class="text-capitalize">{{
                  moment(props.business.txndate).format("LL")
                }}</q-item-label>
                <q-item-label caption>Txn Date</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>

        <q-separator></q-separator>
        <div
          v-for="item in props.previousPendingApplication"
          :key="item"
          class="hidden"
        >
          <div class="row q-py-md">
            <div class="col">
              <q-item>
                <q-item-section>
                  <q-item-label>
                    <div class="text-weight-bold" style="font-size: 16px">
                      {{ item.apptype }}
                    </div>
                  </q-item-label>
                  <q-item-label caption>{{ item.appno }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>
                    <div class="text-weight-bold">
                      {{ item.appyear }}
                    </div>
                  </q-item-label>
                  <q-item-label caption>Application Year</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col">
              <q-item>
                <q-item-section>
                  <q-item-label>
                    <div class="text-weight-bold">
                      {{ item.state }}
                    </div>
                  </q-item-label>
                  <q-item-label caption>Application State</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>

          <q-separator></q-separator>
        </div>
      </q-card>
    </div>
  </div>
</template>
