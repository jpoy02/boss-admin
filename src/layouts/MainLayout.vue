<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { useAuth } from "src/composables/useAuth";
import { useRouter } from "vue-router";
import { useQueueStore } from "src/stores/queueStore";

const queueStore = useQueueStore();
const userName = ref(useAuth().user.value);
const router = useRouter();
defineOptions({
  name: "MainLayout",
});

const linksList = [
  {
    title: "Dashboard",
    caption: "BOSS Dashboard",
    icon: "pie_chart_outline",
    link: "/dashboard",
  },
  {
    title: "Queues",
    caption: "Manage Queues",
    icon: "numbers",
    link: "/queues",
  },
  {
    title: "Business Applications",
    caption: "View application list",
    icon: "list",
    link: "/applications",
  },
  {
    title: "Reports",
    caption: "Generate reports",
    icon: "insert_chart_outlined",
    link: "/records",
  },
  // {
  //   title: 'Github',
  //   caption: 'github.com/quasarframework',
  //   icon: 'code',
  //   link: 'https://github.com/quasarframework'
  // },
  // {
  //   title: 'Discord Chat Channel',
  //   caption: 'chat.quasar.dev',
  //   icon: 'chat',
  //   link: 'https://chat.quasar.dev'
  // },
  // {
  //   title: 'Forum',
  //   caption: 'forum.quasar.dev',
  //   icon: 'record_voice_over',
  //   link: 'https://forum.quasar.dev'
  // },
  // {
  //   title: 'Twitter',
  //   caption: '@quasarframework',
  //   icon: 'rss_feed',
  //   link: 'https://twitter.quasar.dev'
  // },
  // {
  //   title: 'Facebook',
  //   caption: '@QuasarFramework',
  //   icon: 'public',
  //   link: 'https://facebook.quasar.dev'
  // },
  // {
  //   title: 'Quasar Awesome',
  //   caption: 'Community Quasar projects',
  //   icon: 'favorite',
  //   link: 'https://awesome.quasar.dev'
  // }
];

const logoutLink = [
  {
    title: "Logout",
    caption: "Logout from session",
    icon: "logout",
    link: "",
  },
];

const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const handleLogout = async () => {
  if (!confirm("Are you sure you want to logout?")) return;
  const { logout } = useAuth();
  const res = await logout();
  if (res.success) {
    router.push("/login");
  }
};

onMounted(() => {
  queueStore.startListeningForQueueUpdates();
});

onUnmounted(() => {
  queueStore.stopListeningForQueueUpdates();
});
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> </q-toolbar-title>

        <q-badge class="text-h6">
          <q-icon name="account_circle" class="q-mr-sm" />
          {{ userName.toUpperCase() }}</q-badge
        >
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <div class="q-pa-md">
        <img
          src="/src/assets/boss_logo.svg"
          alt="Boss Logo"
          style="width: 200px"
        />
      </div>
      <q-list>
        <q-item-label header>
          <q-separator></q-separator>
        </q-item-label>

        <div class="col">
          <div class="">
            <EssentialLink
              v-for="link in linksList"
              :key="link.title"
              v-bind="link"
            />

            <q-separator class="q-my-md"></q-separator>
          </div>

          <EssentialLink
            v-for="link in logoutLink"
            :key="link.title"
            v-bind="link"
            @click="handleLogout"
          />
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
