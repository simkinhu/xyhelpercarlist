<template>
  <n-global-style />
  <n-grid x-gap="12" :cols="1">
    <n-gi>
      <div class="light-green" v-html="notice">
      </div>
    </n-gi>
  </n-grid>
  <n-divider>001</n-divider>
  <n-grid x-gap="12" y-gap="12" cols="2 400:4 600:6">
    <n-grid-item class="cardclss" v-for="item in itemsfree" :key="item.carID">
      <n-card :title="item.carID" @click="redirectTo(item.carID)">
        <img class="plusicon"
             :src="'https://img.closeai.biz/endpoint?url=https%3A%2F%2Ffree-gpt.club%2Fendpoint%3Fcarid%3D' + item.carID">
      </n-card>
    </n-grid-item>
  </n-grid>

  <n-divider>002</n-divider>
  <n-grid x-gap="12" y-gap="12" cols="2 400:4 600:6">
    <n-grid-item class="cardclss" v-for="item in itemsplus" :key="item.carID">
      <n-card :title="item.carID" @click="redirectTo(item.carID)">
        <img class="plusicon" :src="'https://img.closeai.biz/endpoint?url=' + item.iconurl">
      </n-card>
    </n-grid-item>
  </n-grid>

</template>

<script lang="ts">
import axios from 'axios';
export default {
  data() {
    return {
      itemsfree: [],
      itemsplus: [],
      notice:"",
      chatimages: [{
        'title': 'ChatGPT-001',
        'url': 'https://chat.freegpts.org/login'
      }, {
        'title': 'ChatGPT-002',
        'url': 'https://chat.freegpts.org/login'
      },]
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      axios.post('/carpage', {})
          .then(response => {
            console.log(response);
            this.notice = response.data.notice;
            let baseUrl = window.location.href;
            const allItems = response.data.data.list.map(item => {
              let iconUrl = `${baseUrl}endpoint?carid=${item.carID}`;
              iconUrl = encodeURIComponent(iconUrl);
              return { ...item, iconurl: iconUrl };
            });
            console.log(allItems);
            this.itemsfree = allItems.filter(item => item.isPlus === 0);
            this.itemsplus = allItems.filter(item => item.isPlus === 1);
          })
          .catch(error => {
            console.error('请求错误:', error);
          });
    },
    redirectTo(carID) {
      const url = `https://free-gpt.club/auth/login?carid=${carID}`;
      window.location.href = url;
    },
    redirectToimages(url) {
      window.location.href = url;
    }
  }
};

</script>