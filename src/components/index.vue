<template>
  <n-global-style/>
  <n-grid x-gap="12" :cols="1">
    <n-gi>
      <div class="light-green" v-html="notice"></div>
    </n-gi>
  </n-grid>
  <n-divider></n-divider>
  <n-grid x-gap="12" y-gap="12" cols="2 400:4 600:6">
    <n-grid-item class="cardclss" v-for="item in itemslist" :key="item.carID">
      <n-card :title="item.carID" @click="redirectTo(item.carID)">
        <img class="plusicon" :src="'https://img.closeai.biz/endpoint?url=' + item.iconurl">
      </n-card>
    </n-grid-item>
  </n-grid>
  <n-divider></n-divider>
</template>

<script lang="ts">
import axios from 'axios';

export default {
  data() {
    return {
      itemslist: [],
      itemsplus: [],
      notice: "",
      total: 0,
      page: 1,
      isLoading: false,
      hasMoreData: true,
    };
  },
  mounted() {
    this.fetchData();
    window.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    fetchData() {
      if (!this.hasMoreData || this.isLoading) return; // 如果没有更多数据或正在加载，则不执行任何操作

      this.isLoading = true;
      axios.post('/carpage', {
        page: this.page,
        size: 48
      })
          .then(response => {
            // 处理返回的数据
            if (response.data.data.list === null) {
              this.hasMoreData = false;
              return;
            }
            this.notice = response.data.notice;
            let baseUrl = window.location.origin;
            const newItems = response.data.data.list.map(item => {
              let carname = encodeURIComponent(`${item.carID}`)
              let iconUrl = `${baseUrl}/endpoint?carid=${carname}`;
              return {...item, iconurl: encodeURIComponent(iconUrl)};
            });

            this.itemslist = [...this.itemslist, ...newItems];
            this.page += 1;
          })
          .catch(error => {
            console.error('请求错误:', error);
          })
          .finally(() => {
            this.isLoading = false;
          });
    },
    handleScroll() {
      const nearBottomOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (nearBottomOfPage && !this.isLoading) {
        this.fetchData();
      }
    },
    redirectTo(carID) {
      window.location.href = `${
          window.location.origin
      }/auth/login?carid=${encodeURI(carID)}`;
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }
};

</script>