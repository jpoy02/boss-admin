// stores/queueStore.js
import { defineStore } from "pinia";
import axios from "axios";
const notificationSound = new Audio("/sounds/bell-notification.mp4");

export const useQueueStore = defineStore("queue", {
  state: () => ({
    refreshKey: 0,
    eventSource: null,
    lastCalledQueueId: null,
    notifyKey: 0,
  }),
  actions: {
    triggerNotify() {
      this.notifyKey++;
    },
    playNotification() {
      notificationSound.play();
      notificationSound.currentTime = 0;
    },
    triggerRefresh() {
      this.refreshKey++;
    },
    startListeningForQueueUpdates() {
      if (this.eventSource) {
        return; // Already listening
      }

      this.eventSource = new EventSource(
        process.env.QUEUE_API + "/api/queues/events"
      );

      this.eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("data: ", data);
        // console.log("Received queue update:", data);

        if (data.type === "queue-called") {
          this.lastCalledQueueId = data.data.id;
          console.log("this.lastCalledQueueId: ", this.lastCalledQueueId);
          // this.playNotification();
          this.notifyKey++;
        }

        if (data.type === "queue-notification") {
          this.lastCalledQueueId = data.data.id;
          this.notifyKey++;
          console.log("this.lastCalledQueueId: ", this.lastCalledQueueId);
        }

        if (data.type !== "ping") {
          this.triggerRefresh();
        }
        if (data.type !== "new-queue") {
          this.triggerRefresh();
        }
      };

      this.eventSource.onerror = (error) => {
        console.error("SSE error:", error);
        this.stopListeningForQueueUpdates();
      };
    },

    stopListeningForQueueUpdates() {
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
    },

    async setQueueToWaiting(id, role) {
      try {
        await axios.post(process.env.QUEUE_API + `/api/queues/${id}/revert`, {
          counter_name: role,
        });
        this.refreshKey++;
      } catch (err) {
        console.error(err);
        alert(err.response.data.error);
      }
    },

    async setQueueToProcessing(id, role) {
      try {
        await axios.post(process.env.QUEUE_API + `/api/queues/${id}/call`, {
          counter_name: role,
        });
        this.refreshKey++;
      } catch (err) {
        throw err;
      }
    },

    async setQueueToNoShow(id) {
      try {
        await axios.post(process.env.QUEUE_API + `/api/queues/${id}/no-show`);
        this.refreshKey++;
      } catch (err) {
        throw err;
      }
    },

    async getActiveQueues(busid) {
      const res = await axios.get(
        process.env.QUEUE_API + `/api/queues/active`,
        { params: { business_objid: busid } }
      );
      return res.data;
    },
  },
});
