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
    </n-card>

    <n-grid x-gap="10" y-gap="10" cols="1 s:3 m:4 l:5 xl:5 2xl:5" responsive="screen">
      <n-grid-item class="cardclss" v-for="item in itemslist" :key="item.carID">
        <n-card size="small" bordered="false" content-style="box-class" content-class="box-class"
                @click="redirectTo(item.carID)">
          <div class="type" :style="{ background: item.labelColor }">{{ item.label }}</div>
          <n-text class="title">{{ item.carID }}</n-text>
          <div class="message-with-dot">
            实时状态：{{ item.message }}
          </div>
          <div :style="{ width: '100%' }">
            <a-progress animation="true" :show-text="false" :steps="4" :color=item.color :percent="item.bai"
                        track-color="#43bff0" stroke-width="30"/>
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

body.loading {
  visibility: hidden;
}

.n-button {
  border-radius: 7px;
  float: right;
}

.n-gradient-text {
  margin-top: 10px;
}

.type {
  display: inline-block;
  margin-right: 5px;
  font-size: 12px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 5px;
  color: #fff;
}

.message-with-dot {
  display: inline-block;
  margin-top: 5px;
  margin-bottom: 5px;
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
  border-radius: 2px;
  padding: 10px 10px;
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

.arco-progress-steps-item {
  border-radius: 3px !important;
}

</style>
<script lang="ts">
import axios from 'axios';
import {darkTheme} from 'naive-ui'
import type {GlobalTheme} from 'naive-ui'
import {Airplane, LogoNodejs, Sparkles, SunnySharp} from '@vicons/ionicons5'


export default defineComponent({
  computed: {
    LogoNodejs() {
      return LogoNodejs
    },
    Airplane() {
      return Airplane
    },
    Sparkles() {
      return Sparkles
    },
    SunnySharp() {
      return SunnySharp
    }

  },
  setup() {
    const theme = ref<GlobalTheme | null>(null);
    const active = ref(false);

    // 从 localStorage 恢复主题设置
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
      localStorage.setItem('theme', theme.value ? 'darkTheme' : 'lightTheme');
    });

    // 页面加载时恢复主题
    onMounted(() => {
      restoreTheme();
      document.body.classList.remove('loading');
    });

    return {theme, active, Sparkles, SunnySharp};

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
    fetchData: async function () {
      if (!this.hasMoreData || this.isLoading) return;
      axios.post('https://3388ai.com/carpage', {
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
            // let baseUrl = window.location.origin;
            let baseUrl = "https://3388ai.com/";
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
                      .replace("green", "#2e8cb1")
                      .replace("yellow", "#2e8cb1")
                      .replace("red", "black")
                      .replace("PLUS", "Plus")
                      .replace("blue", "#43bff0")
                      .replace("purple", "#ab68ff");
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
            }).catch(error => {
              console.error('请求错误:', error);
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
});
</script>
