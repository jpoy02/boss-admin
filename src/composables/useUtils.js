import { ref } from "vue";

const test = ref("test");

export function useUtils() {
  const queueStatusColor = (status = "") => {
    switch (status.toLowerCase()) {
      case "waiting":
        return "grey-6"; // Neutral - awaiting action
      case "processing":
        return "blue"; // Active/in-progress
      case "done":
        return "green"; // Success/completed
      case "cancelled":
        return "red"; // User-initiated termination
      case "expired":
        return "orange"; // Time-based warning
      case "no-show":
        return "deep-orange"; // More severe than expired, customer fault
      default:
        return "grey";
    }
  };

  const currencyFormat = (data) => {
    return data.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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

  return {
    test,
    queueStatusColor,
    toCapitalized,
    toSentenceCase,
    badgeColor,
    currencyFormat,
  };
}
