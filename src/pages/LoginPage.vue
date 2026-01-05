<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "src/axios";
import { useAuth } from "src/composables/useAuth";

const router = useRouter();
const { login } = useAuth();
const loginForm = ref({
  username: "",
  password: "",
});

const handleLogin = async () => {
  const res = await login(loginForm.value.username, loginForm.value.password);
  console.log(res.data);

  if (res.success) {
    router.push("/dashboard");
  } else {
    alert(res.message);
  }
};
</script>

<template>
  <div class="fullscreen flex flex-center bg-grey-2">
    <q-card class="my-card q-pa-md q-py-xl">
      <q-card-section>
        <q-form @submit="handleLogin" class="q-gutter-y-lg">
          <q-input v-model="loginForm.username" filled label="Username" />
          <q-input
            v-model="loginForm.password"
            filled
            label="Password"
            type="password"
          />
          <q-separator></q-separator>
          <div class="flex justify-end">
            <q-btn
              class="q-px-xl"
              label="Login"
              type="submit"
              color="primary"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 450px
</style>
