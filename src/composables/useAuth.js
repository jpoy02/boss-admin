import { ref } from "vue";
import { LocalStorage } from "quasar";
import axios from "src/axios";

const user = ref(LocalStorage.getItem("user") || null);
const role = ref(LocalStorage.getItem("role") || null);

export function useAuth() {
  async function login(username, password) {
    try {
      const res = await axios.post("/auth/login", { username, password });

      // Save to local + reactive refs
      user.value = res.data.username;
      role.value = res.data.role;
      LocalStorage.set("user", user.value);
      LocalStorage.set("role", role.value);

      return { success: true, data: res.data };
    } catch (err) {
      console.error("Login failed:", err);
      return { success: false, message: "Invalid username or password" };
    }
  }

  async function logout() {
    try {
      const res = await axios.post("/auth/logout");
      if (res.data.success) {
        user.value = null;
        role.value = null;
        LocalStorage.remove("user");
        LocalStorage.remove("role");
      }
      return res.data; // returns {success: true}
    } catch (error) {
      alert(error);
    }
  }

  async function fetchProfile() {
    try {
      const res = await axios.get("/auth/profile");
      user.value = res.data.username;
      role.value = res.data.role;
      LocalStorage.set("user", user.value);
      LocalStorage.set("role", role.value);
      return res.data;
    } catch (err) {
      console.warn("Profile not found, probably logged out.");
      logout();
    }
  }

  return { user, role, login, logout, fetchProfile };
}
