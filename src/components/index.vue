<template>
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
    </n-card>


    <n-grid x-gap="10" y-gap="10" cols="1 s:3 m:4 l:5 xl:6 2xl:6" responsive="screen">

      <n-grid-item class="cardclss" v-for="item in itemslist" :key="item.carID">
        <n-card size="small" bordered="false" content-style="box-class" content-class="box-class"
                @click="redirectTo(item.carID)">
          <n-text class="title">{{ item.carID }}</n-text>

          <n-badge :color=item.labelColor :value=item.label :offset="[30, -12]"></n-badge>

          <div class="message-with-dot">
            <a-progress size="mini" status='success' :percent=item.bai :size="mini" :color=item.color></a-progress>
            节点状态：{{ item.message }}
          </div>

        </n-card>
      </n-grid-item>


    </n-grid>

  </n-config-provider>
</template>
<style>
#app {
  padding: 10px;
}

.n-button {
  border-radius: 7px;
  float: right;
}

.n-gradient-text {
  margin-top: 10px;
}

.message-with-dot {
  margin-top: 10px;
  position: relative;
  color: gray;
  font-size: 12px;
}

.n-switch {
  top: 0;

  float: right;
}

.n-badge {
  float: right;
}

.n-badge .n-badge-sup {
  border-radius: 5px;
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

.cardclss .title {
  font-weight: 600;
}

.notice {
  max-width: 100%;
  color: var(--n-title-text-color);
  border-radius: 10px !important;
  margin-bottom: 20px;
}

.light-green {
  padding: 20px;
  border-radius: 10px;
  background: none;
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

</style>
<script lang="ts">
import axios from 'axios';
import {darkTheme} from 'naive-ui'
import type {GlobalTheme} from 'naive-ui'
import {Sparkles, SunnySharp} from '@vicons/ionicons5'

export default {
  computed: {
    Sparkles() {
      return Sparkles
    },
    SunnySharp() {
      return SunnySharp
    }
  },
  setup() {
    const theme = ref<GlobalTheme | null>(null)
    const active = ref(false)
    // 设置主题
    const setTheme = () => {
      const now = new Date()
      const hours = now.getHours()
      if (hours >= 23 || hours < 6) {
        theme.value = darkTheme
        active.value = true
      } else {
        theme.value = null
        active.value = false
      }
    }
    onMounted(() => {
      setTheme()
    })

    // 监听开关改变,手动切换主题
    watch(active, (newValue) => {
      theme.value = newValue ? darkTheme : null
    })

    return {
      theme,
      active,
      Sparkles,
      SunnySharp
    }
  },
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

  created() {
    this.fetchData();
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    fetchData: async function() {
      if (!this.hasMoreData || this.isLoading) return;
      this.isLoading = true;
      axios.post('/carpage', {
        page: this.page,
        size: 72
      })
          .then(response => {
            if (response.data.data.list === null) {
              this.hasMoreData = false;
              this.isLoading = false;
              return;
            }
            this.notice = response.data.notice;
            let baseUrl = window.location.origin;
            let promises = response.data.data.list.map(item => {
              let carname = encodeURIComponent(`${item.carID}`);
              let endpointUrl = `${baseUrl}/endpoint?carid=${carname}`;
              let statusUrl = `${baseUrl}/status?carid=${carname}`;

              // 并行发起 endpoint 和 status 请求
              let endpointPromise = fetch(endpointUrl)
                  .then(response => response.json())
                  .catch(error => {
                    console.error('Error fetching endpoint data:', error);
                    return {};
                  });

              let statusPromise = fetch(statusUrl)
                  .then(response => response.json())
                  .catch(error => {
                    console.error('Error fetching status data:', error);
                    return {};
                  });

              return Promise.all([endpointPromise, statusPromise]).then(([endpointData, statusData]) => {
                function replaceStopRunning(text) {
                  return text.replace("PLUS停运｜", "")
                      .replace("TEAM停运｜", "")
                      .replace("停运｜", "")
                      .replace("|", "-")
                      .replace("green", "#19c37d")
                      .replace("yellow", "#0f6844")
                      .replace("red", "black")
                      .replace("PLUS", "4.0")
                      .replace("blue", "#19c37d")
                      .replace("purple", "#ff7e33");
                }

                for (let key in endpointData) {
                  if (typeof endpointData[key] === 'string') {
                    endpointData[key] = replaceStopRunning(endpointData[key]);
                  }
                }
                let bai = statusData.count / 100;
                return {...item, ...endpointData, ...statusData, bai: bai.toFixed(2)};
              });
            });

            Promise.all(promises).then(newItems => {
              this.itemslist = [...this.itemslist, ...newItems];
              this.page += 1;
              this.isLoading = false;
            }).catch(error => {
              console.error('请求错误:', error);
              this.isLoading = false;
            });
          })
          .catch(error => {
            console.error('请求错误:', error);
            this.isLoading = false;
          })
    },
    handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      const nearBottomOfPage = scrollTop + clientHeight >= scrollHeight - 100;

      if (nearBottomOfPage && !this.isLoading && this.hasMoreData) {
        this.fetchData();
      }
    },
    redirectTo(carID) {
      window.location.href = `${window.location.origin}/auth/login?carid=${encodeURI(carID)}`;
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }
};
</script>