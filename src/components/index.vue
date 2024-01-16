<template>
  <n-global-style/>
  <n-grid x-gap="12" :cols="1">
    <n-gi>
      <div class="light-green" v-html="notice">
      </div>
    </n-gi>
  </n-grid>
  <n-divider></n-divider>
  <n-grid x-gap="12" y-gap="12" cols="2 400:4 600:6">
    <n-grid-item class="cardclss" v-for="item in itemsfree" :key="item.carID">
      <n-card :title="item.carID" @click="redirectTo(item.carID)">
        <img class="plusicon" :src="'https://img.closeai.biz/endpoint?url=' + item.iconurl">
      </n-card>
    </n-grid-item>
  </n-grid>
  <n-divider></n-divider>
  <n-space>
    <n-text class="total">共：{{ total }} 条数据</n-text>
    <n-button size="small" type="info">
      Info
    </n-button>

  </n-space>

</template>

<script lang="ts">
import axios from 'axios';

export default {
  data() {
    return {
      itemsfree: [],
      itemsplus: [],
      notice: "",
      total:0,
      page: 1
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      axios.post('https://free-gpt.club/carpage', {
        page: this.page,
        size: 6
      })
          .then(response => {
            console.log(response);
            this.notice = response.data.notice;
            this.total = response.data.data.pagination.total;
            let baseUrl = window.location.href;
            const allItems = response.data.data.list.map(item => {
              let iconUrl = `${baseUrl}endpoint?carid=${item.carID}`;
              iconUrl = encodeURIComponent(iconUrl);
              return {...item, iconurl: iconUrl};
            });
            console.log(allItems);
            this.itemsfree = allItems;
          })
          .catch(error => {
            console.error('请求错误:', error);
          });
    },
    redirectTo(carID) {
      let baseUrl = window.location.href;
      const url = `${baseUrl}auth/login?carid=${carID}`;
      window.location.href = url;
    }
  }
};

</script>