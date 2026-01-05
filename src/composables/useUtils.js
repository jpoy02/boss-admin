import { ref } from "vue";

const test = ref("test");

export function useUtils() {
  const queueStatusColor = (status = "") => {
    switch (status.toLowerCase()) {
      case "waiting":
        return "grey-6";
      case "processing":
        return "blue";
      case "done":
        return "green";
      case "cancelled":
        return "red";
      case "expired":
        return "orange";
      default:
        return "grey";
    }
  };

  const badgeColor = (state) => {
    if (state == "COMPLETED") return "green";
    else if (state == "PAYMENT") return "warning";
    else if (state == "RELEASE") return "orange";
    else if (state == "ASSESSMENT") return "red";
    else return "info";
  };

  const toCapitalized = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const toSentenceCase = (str) => {
    if (!str) return "";
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return { test, queueStatusColor, toCapitalized, toSentenceCase, badgeColor };
}
