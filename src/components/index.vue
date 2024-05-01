<template class="loading">
  <n-config-provider :theme="theme">
    <n-global-style/>
    <n-card class="notice" size="small">
      <n-switch v-model:value="active" size="small">
        <template #checked-icon>
          <n-icon :component="Sparkles"/>
        </template>
        <template #unchecked-icon>
          <n-icon :component="SunnySharp"/>
        </template>
      </n-switch>
      <div v-html="notice"></div>
      <!--<div v-html="useravatar"></div>-->
    </n-card>

    <n-grid x-gap="10" y-gap="10" cols="1 s:2 m:2 l:2 xl:2 2xl:2" responsive="screen">

      <n-grid-item class="leftbox">
        <div class="avaimg" v-html="useravatar"></div>
        <div class="userinfo">
          <div class="username">UserToken：723179227</div>
          <div class="username">UserToken：723179227</div>
          <div class="username">UserToken：723179227</div>
        </div>
      </n-grid-item>

      <n-grid-item class="leftbox">
        <div class="avaimg" v-html="useravatar"></div>
        <div class="info">UserToken：723179227</div>
      </n-grid-item>

    </n-grid>


    <n-grid x-gap="10" y-gap="10" cols="1 s:3 m:4 l:5 xl:5 2xl:6" responsive="screen">

      <n-grid-item class="cardclss" v-for="item in itemslist" :key="item.carID">
        <n-card size="small" content-style="boxclass" :content-class="'boxclass ' + (item.isPlus ? 'pluscolor' : 'nopluscolor')" @click="redirectTo(item.carID)">
          <div class="type" :style="{ background: item.endpoint.labelColor }">{{ item.endpoint.label != "" ? item.endpoint.label : "NO" }}</div>
          <div class="cartitle">
            <n-text class="title">{{ item.carID }}</n-text>
          </div>
          <div class="message-with-dot">实时状态：{{ item.endpoint.message }}</div>
          <div :style="{ width: '100%' }">
            <a-progress :show-text="false" :steps="4" :color=item.endpoint.color :percent="item.statusinfo.percent" :track-color="(item.endpoint.labelColor)" stroke-width='30'/>
          </div>
        </n-card>

      </n-grid-item>
    </n-grid>

  </n-config-provider>
</template>


<style>
.n-button {
  border-radius: 7px;
  float: right;
}

.n-grid{
  margin-bottom: 15px;
}
.leftbox{
  padding: 20px;
  border-radius: 8px;
  background-color: #F1F4F7FF;
}
.avaimg{
  margin-right: 20px;
  display: inline-block;
  width: 60px;
}
.userinfo{
  display: inline-block;
}
.n-gradient-text {
  margin-top: 10px;
}

.type {
  display: inline-block;
  margin-right: 5px;
  font-size: 12px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 5px;
  color: #fff;
}

.cartitle {
  display: inline-block;
}

.message-with-dot {
  margin-top: 10px;
  margin-bottom: 5px;
  position: relative;
  color: #8f8f8f;
  font-size: 13px;
}

.n-switch {
  top: 0;
  float: right;
}

.n-badge .n-badge-sup {
  border-radius: 2px;
  padding: 10px 10px;
}

.boxclass {
  border-radius: 10px !important;
  border: 3px solid transparent;
  transition: border 0.3s ease, box-shadow 0.3s ease;
}

.boxclass:hover {
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.pluscolor:hover {
  border: 3px solid #a07be6;
}

.nopluscolor:hover {
  border: 3px solid #24d4ae;
}

.cardclss .title {
  font-weight: 600;
}

.notice {
  max-width: 100%;
  color: var(--n-title-text-color);
  border-radius: 10px !important;
  margin-bottom: 20px;
}

.cardclss {
  border-radius: 10px !important;
}

.cardclss .n-card {
  max-width: 100%;
  border: 0 !important;
  text-align: left;
  --n-close-border-radius: 10px !important;
}

.arco-progress-steps-item {
  border-radius: 30px !important;
}
</style>


<script lang="ts">
import multiavatar from '@multiavatar/multiavatar/esm';
import axios from 'axios';
import {ref, defineComponent, onMounted, watch} from 'vue';
import {darkTheme} from 'naive-ui';
import type {GlobalTheme} from 'naive-ui';

export default defineComponent({
  data() {
    return {
      itemslist: [],
      useravatar: "",
      userinfo: [],
      notice: "",
      total: 0,
      page: 1,
      isLoading: false,
      hasMoreData: true
    };
  },
  setup() {
    const theme = ref<GlobalTheme | null>(null);
    const active = ref(false);

    function restoreTheme() {
      const storedTheme = localStorage.getItem('theme');
      active.value = storedTheme === 'darkTheme';
      theme.value = active.value ? darkTheme : null;
    }

    if (localStorage.getItem('theme') === 'darkTheme') {
      document.documentElement.style.backgroundColor = '#333';
      document.body.classList.add('dark-theme');
    }
    watch(active, (newValue) => {
      theme.value = newValue ? darkTheme : null;
      localStorage.setItem('theme', newValue ? 'darkTheme' : 'lightTheme');
    });

    onMounted(() => {
      restoreTheme();
      document.body.classList.remove('loading');
    });

    return {theme, active};
  },

  created() {
    this.fetchData();
    this.registerUser();
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },

  methods: {
    registerUser() {
      const url = 'http://47.76.135.99:8310/api/userinfo';
      axios.post(url, {
        "usertoken": 723179227
      }).then(response => {
        // this.userinfo = response.data[0].data
        console.log(response.data.data[0].userToken)
        this.useravatar = multiavatar(response.data.data[0].userToken)
        console.log(multiavatar(response.data.data[0].userToken));


      })
          .catch(error => {
            // 处理错误情况
            this.responseMessage = 'Registration failed!';
            console.error('Error:', error);
          });
    },
    fetchData() {
      if (!this.hasMoreData || this.isLoading) return;
      this.isLoading = true;
      axios.post('/carpage', {
        page: this.page,
        size: 72
      }).then(response => {
        if (!response.data || !response.data.data || !response.data.data.list) {
          this.hasMoreData = false;
          return;
        }
        const {list} = response.data.data;
        if (list.length === 0) {
          this.hasMoreData = false;
        } else {
          this.notice = response.data.data.notice;
          this.itemslist = [...this.itemslist, ...list];
          this.page++;
        }
      }).catch(error => {
        console.error('请求错误:', error);
      }).finally(() => {
        this.isLoading = false;
      });
    },
    handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      const nearBottomOfPage = scrollTop + clientHeight >= scrollHeight - 100;
      if (nearBottomOfPage && this.hasMoreData && !this.isLoading) {
        this.fetchData();
      }
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }
})
;
</script>
