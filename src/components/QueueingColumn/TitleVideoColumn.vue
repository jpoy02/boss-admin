<script setup></script>

<template>
  <q-card class="fit column">
    <div class="col">
      <q-card-section>
        <img
          src="/src/assets/logo-xl.png"
          alt="Boss Logo"
          style="width: 100%"
        />
      </q-card-section>
      <q-separator></q-separator>

      <q-card-section class="row justify-center column items-center q-mt-lg">
        <div
          class="text-weight-bold text-h2 text-primary"
          style="font-family: Verdana, Geneva, Tahoma, sans-serif"
        >
          BOSS 2026
        </div>
        <div class="text-weight-regular text-h4 text-grey">
          Business One Stop Shop
        </div>
      </q-card-section>
    </div>

    <q-card-section class="col">
      <q-video
        :ratio="16 / 9"
        src="https://www.youtube.com/embed/ig_8lJXQ_6k?autoplay=1&mute=1&playlist=ig_8lJXQ_6k__"
      />
    </q-card-section>
  </q-card>
</template>
