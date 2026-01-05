const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "/dashboard",
        component: () => import("pages/DashboardPage.vue"),
      },
      {
        path: "/applications",
        component: () => import("pages/Application/ApplicationIndex.vue"),
      },
      {
        path: "/applications/:id",
        component: () => import("pages/Application/ApplicationShow.vue"),
      },
      {
        path: "/records",
        component: () => import("pages/Record/RecordIndex.vue"),
      },
      {
        path: "/queues",
        component: () => import("pages/Queues/QueuesIndex.vue"),
      },
    ],
  },
  { path: "/login", component: () => import("pages/LoginPage.vue") },
  { path: "/queueing", component: () => import("pages/QueueingPage.vue") },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
