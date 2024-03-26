<template>
  <n-global-style/>
  <n-grid class="notice" x-gap="12" :cols="1">
    <n-gi>
      <div class="light-green" v-html="notice"></div>
    </n-gi>
  </n-grid>
  <n-grid x-gap="10" y-gap="10" cols="1 s:3 m:4 l:5 xl:6 2xl:6" responsive="screen">
    <n-grid-item class="cardclss" v-for="item in itemslist" :key="item.carID">
      <n-card size="small" bordered="false" content-style="box-class" content-class="box-class"
              @click="redirectTo(item.carID)">
        <n-button text-color="white" :color="item.isPlus === 0 ? '#19c37d' : '#ab68ff'" type="tertiary" size="small">
          {{ item.label }}
        </n-button>
        <n-text class="title">{{ item.carID }}</n-text>
        <div class="message-with-dot" :style="{ '--dot-color': item.color }">
          状态：{{ item.message }}
        </div>
      </n-card>
    </n-grid-item>
  </n-grid>

</template>
<style>
#app {
  padding: 10px;
}

.n-button {
  border-radius: 7px;
}

.n-gradient-text {
  margin-top: 10px;
}

.message-with-dot {
  margin-top: 10px;
  position: relative;
  padding-left: 20px;
  color: gray;
  font-size: 12px;
}

.message-with-dot:before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--dot-color);
  border: 1px #c9c9c9 solid;
}


.box-class {
  border-radius: 10px !important;
}

.box-class .status {
  margin-top: 10px;
}

.box-class:hover {
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.n-button {
  width: 50px;
  height: 20px;
  line-height: 20px;
  font-size: 10px;
}

.n-button span {
  font-weight: 800;
}

.cardclss .title {
  font-weight: 600;
  margin-left: 5px;
}

.notice {
  color: #67c23a;
  background-color: #eff4f9 !important;
  border-radius: 10px !important;
  margin-bottom: 20px;
}

.light-green {
  padding: 20px;
  border-radius: 10px;
  background: none;
}

.cardclss {
  background-color: #eff4f9 !important;
  border-radius: 10px !important;
}

.cardclss .n-card {
  border: 0 !important;
  color: black;
  text-align: left;
  --n-close-border-radius: 10px !important;
  background: none;
}

</style>
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
      if (!this.hasMoreData || this.isLoading) return;
      this.isLoading = true;
      axios.post('/carpage', {
        page: this.page,
        size: 48
      })
          .then(response => {
            if (response.data.data.list === null) {
              this.hasMoreData = false;
              return;
            }
            this.notice = response.data.notice;
            let baseUrl = window.location.origin;
            let promises = response.data.data.list.map(item => {
              let carname = encodeURIComponent(`${item.carID}`);
              let requestUrl = `${baseUrl}/endpoint?carid=${carname}`;
              // 对每个 item 发起请求
              return fetch(requestUrl)
                  .then(response => response.json()) // 假设 endpoint 返回 JSON
                  .then(data => {
                    function replaceStopRunning(text) {
                      return text.replace("PLUS停运｜", "").replace("TEAM停运｜", "").replace("停运｜", "").replace("|", "-");
                    }

                    for (let key in data) {
                      if (typeof data[key] === 'string') {
                        data[key] = replaceStopRunning(data[key]);
                      }
                    }
                    return {...item, ...data};
                  })
                  .catch(error => {
                    console.error('Error fetching icon data:', error);
                    return item;
                  });
            });
            Promise.all(promises).then(newItems => {
              this.itemslist = [...this.itemslist, ...newItems];
              this.itemslist.sort((a, b) => {
                if (a.isPlus === 0 && b.isPlus !== 0) {
                  return -1;
                } else if (a.isPlus !== 0 && b.isPlus === 0) {
                  return 1;
                }
                return 0;
              });
              this.page += 1;
            })
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