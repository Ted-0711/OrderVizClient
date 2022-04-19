<template>
  <div class="main">
    <el-row>
      <el-row>
      <h1>零售未来——基于人工智能的零售商品结算系统</h1>
      <h2>订单数据实时监控平台</h2>
      </el-row>
      <el-tabs tab-position="left" v-model="panel" @tab-click="handleClick" style="margin-right: 20px;">
        <el-tab-pane label="数据总览" name="数据总览">
          <el-row>
            <el-col :span="12">
                <div id="chart1" ref="chart1" class="chart"></div>
            </el-col>
            <el-col :span="12">
              <div id="chart2" ref="chart2" class="chart"></div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div id="chart3" ref="chart3" class="chart"></div>
            </el-col>
            <el-col :span="12" type="flex">
              <el-table
                :data="tableData"
                stripe
                height="330"
                style="width: 90%; margin-top: 20px; margin-left: 5%">
                <el-table-column
                  prop="order_id"
                  label="订单编号"
                  min-width="12%"
                  align="center">
                </el-table-column>
                <el-table-column label="订单信息" align="center">
                  <el-table-column
                    prop="date"
                    label="日期"
                    min-width="12%"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="time"
                    label="时间"
                    min-width="12%"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="user_id"
                    label="会员编号"
                    min-width="12%"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="tot_amount"
                    label="总金额"
                    min-width="12%"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="detail"
                    label="购物明细"
                    min-width="40%"
                    align="center"
                    style="width: 20%;">
                  </el-table-column>
                </el-table-column>
              </el-table>
            </el-col>
            <!-- <el-col :span="12">
              <div id="chart4" ref="chart4" class="chart"></div>
            </el-col> -->
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="订单量" name="订单量">
          <el-row>
            <div id="chart5" ref="chart5" class="largeChart"></div>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="销售额" name="销售额">
          <el-row>
            <div id="chart6" ref="chart6" class="largeChart"></div>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="商品销量" name="商品销量">
          <el-row>
            <div id="chart7" ref="chart7" class="largeChart"></div>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="订单详情" name="订单详情">
          <el-table
            :data="tableData"
            height="700"
            stripe
            style="width: 96%; margin-left: 2%;">
            <el-table-column
              prop="order_id"
              label="订单编号"
              min-width="12%"
              align="center">
            </el-table-column>
            <el-table-column label="订单信息" align="center">
              <el-table-column
                prop="date"
                label="日期"
                min-width="12%"
                align="center">
              </el-table-column>
              <el-table-column
                prop="time"
                label="时间"
                min-width="12%"
                align="center">
              </el-table-column>
              <el-table-column
                prop="user_id"
                label="会员ID"
                min-width="12%"
                align="center">
              </el-table-column>
              <el-table-column
                prop="tot_amount"
                label="总金额"
                min-width="12%"
                align="center">
              </el-table-column>
              <el-table-column
                prop="detail"
                label="购物明细"
                min-width="40%"
                align="center">
              </el-table-column>
            </el-table-column>
          </el-table>
          <!-- <el-row>
            <div id="chart8" ref="chart8" class="largeChart"></div>
          </el-row> -->
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <el-footer style="height: 20px; margin: 20px;">
      &copy; 2022 Ted Xu  Powered by Vue & Element UI & Apache ECharts
    </el-footer>
  </div>
</template>

<script>
function getTextSync(url){
  var request = new XMLHttpRequest();
  request.open('GET',url,false);  //false表示同步请求
  request.send(null);
  if(request.status !== 200){
      throw new Error('..');
  }
  return request.responseText;
}

function padding(num, length) {
  for(var len = (num + "").length; len < length; len = num.length) {
    num = "0" + num;            
  }
  return num;
}

export default {
  name: 'MainPage',
  data() {
    return {
      panel: '数据总览',
      order_list: null,
      sorted_order_list: null,
      item_list: null,
      times: null,
      days: null,
      months: null,
      years: null,
      order_quant: null,
      order_sale: null,
      item_quant: null,
      tableData: [],
    };
  },
  methods: {
    handleClick(tab, event) {
      this.$nextTick(() => {
        echarts.getInstanceByDom(this.$refs.chart1).resize()
        echarts.getInstanceByDom(this.$refs.chart2).resize()
        echarts.getInstanceByDom(this.$refs.chart3).resize()
        // echarts.getInstanceByDom(this.$refs.chart4).resize()
        echarts.getInstanceByDom(this.$refs.chart5).resize()
        echarts.getInstanceByDom(this.$refs.chart6).resize()
        echarts.getInstanceByDom(this.$refs.chart7).resize()
        // echarts.getInstanceByDom(this.$refs.chart8).resize()
      })
    },
    generateData() {
      // const faker = this.$faker()
      // console.log(`\"${faker.datatype.number({ min: 1, max: 2388 })}\": ${faker.datatype.number({ min: 1, max: 10 })}, \"${faker.datatype.number({ min: 1, max: 2388 })}\": ${faker.datatype.number({ min: 1, max: 10 })}`)
      // this.order_list = Array.from(Array(20000), function(v, k) {
      //   return [ k + 1, 
      //     faker.datatype.number({ min: 1, max: 100 }), 
      //     faker.datatype.number({ min: 10, max: 1000, precision: 0.01 }), 
      //     faker.date.past(),
      //     JSON.parse(`{\"${faker.datatype.number({ min: 1, max: 2388 })}\": ${faker.datatype.number({ min: 1, max: 10 })}, \"${faker.datatype.number({ min: 1, max: 2388 })}\": ${faker.datatype.number({ min: 1, max: 10 })}}`), ]
      // })
      this.order_list = require('../../static/order_list.json')
      this.order_list.forEach(function(item, index, arr) {
        item[3] = new Date(item[3])
      })
    },
    getData() {
      const path = 'http://124.223.199.12:6868/';
      // axios.get(path)
      //   .then((res) => {
      //     res.data['order_list'].forEach(function(item, index, arr) {
      //       if (item[4] != null) {
      //         item[4] = JSON.parse(item[4])
      //       }
      //     })
      //     this.order_list = this.order_list.concat(res.data['order_list'])
      //     this.item_list = res.data['item_list']
      //   })
      //   .catch((error) => { console.error(error); });

      // 同步请求
      const res = JSON.parse(getTextSync(path))
      res['order_list'].forEach(function(item, index, arr) {
        if (item[4] != null) {
          item[4] = JSON.parse(item[4])
        }
        if (item[3] != null) {
          item[3] = new Date(item[3][0], item[3][1]-1, item[3][2], item[3][3], item[3][4], item[3][5])
        }
      })
      this.order_list = this.order_list.concat(res['order_list'])
      this.item_list = res['item_list']
    },
    calcData() {
      let sort_orders = this.order_list.sort((a, b) => a[3] - b[3]),
        min_date = new Date(sort_orders[0][3]),
        max_date = new Date(sort_orders[sort_orders.length - 1][3])
      
      function clear_time(date) {
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        date.setMilliseconds(0)
      }

      clear_time(min_date)
      clear_time(max_date)
      let date_scale_times = Array.from(Array((max_date - min_date) / (24 * 60 * 60 * 1000) + 1), 
        (v, k) => min_date.getTime() + k * 24 * 60 * 60 * 1000)
      console.log(date_scale_times)
      console.log(this.item_list)

      // Date Scale
      this.order_quant = Array.from(date_scale_times, (v, k) => [v, 0])
      this.order_sale = Array.from(date_scale_times, (v, k) => [v, 0])
      this.item_quant = Array.from(this.item_list, (v, k) => [v[1], 0])
      for (let i = 0, len = sort_orders.length; i < len; i++) {
        this.order_quant[Math.floor((sort_orders[i][3] - min_date) / (24 * 60 * 60 * 1000))][1] += 1
        this.order_sale[Math.floor((sort_orders[i][3] - min_date) / (24 * 60 * 60 * 1000))][1] += sort_orders[i][2]
        let items = Object.keys(sort_orders[i][4])
        for (let j = 0, lenj = items.length; j < lenj; j++) {
          // debugger
          this.item_quant[items[j] - 1][1] = this.item_quant[items[j] - 1][1] + sort_orders[i][4][items[j]]
        }
      }
      this.item_quant = this.item_quant.sort((a, b) => b[1] - a[1])
      function getUserID(x) {
        if (x == -1) return '非会员'
        else return x
      }
      const item_list = this.item_list
      this.tableData = Array.from(this.order_list.sort((a, b) => b[3] - a[3]).slice(0, 100), (v, k) => {
        return {
          order_id: v[0],
          user_id: getUserID(v[1]),
          tot_amount: '￥' + v[2].toFixed(2),
          date: `${v[3].getFullYear()}-${padding(v[3].getMonth(), 2)}-${padding(v[3].getDate(), 2)}`,
          time: `${padding(v[3].getHours(), 2)}:${padding(v[3].getMinutes(), 2)}:${padding(v[3].getSeconds(), 2)}`,
          detail: ((x) => {
            let content = ""
            // debugger
            let items = Object.keys(x)
            for (let l = 0, len = items.length; l < len; l++) {
              content = content + `${item_list[items[l]-1][1]}×${x[items[l]]}\n`
            }
            return content
          })(v[4])
        }
      })
    },
    initChart() {
      this.initChart1()
      this.initChart2()
      this.initChart3()
      // this.initChart4()
      this.initChart5()
      this.initChart6()
      this.initChart7()
      // this.initChart8()
    },
    initChart1(){
      this.chartInstance = this.$echarts.init(this.$refs.chart1);
      const option = {
        title: {
          text: '订单量',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          formatter(params) {
            let date = new Date(params[0]['value'][0])
            let circle = `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;left:5px;background-color:`;
            let data = `${circle}#409EFF"></span>${params[0]["seriesName"]}&emsp;<b>${params[0]['value'][1]}</b>`;
            return `${date.getFullYear()}-${padding(date.getMonth()+1, 2)}-${padding(date.getDate(), 2)}<br/>${data}`
          }
        },
        xAxis: {
          type: 'time',
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [
          {
            type: 'inside',
            start: 80,
            end: 100
          },
          {
            start: 80,
            end: 100
          }
        ],
        series: [
          {
            name: '当日订单量',
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: {
              color: "#409EFF"
            },
            areaStyle: {
              color: "#409EFF"
            },
            data: this.order_quant
          }
        ]
      };
      this.chartInstance.setOption(option);
    },
    initChart2(){
      this.chartInstance = this.$echarts.init(this.$refs.chart2);
      const option = {
        title: {
          text: '销售额',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          formatter(params) {
            let date = new Date(params[0]['value'][0])
            let circle = `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;left:5px;background-color:`;
            let data = `${circle}#67C23A"></span>${params[0]["seriesName"]}&emsp;<b>￥${params[0]['value'][1].toFixed(2)}</b>`;
            return `${date.getFullYear()}-${padding(date.getMonth()+1, 2)}-${padding(date.getDate(), 2)}<br/>${data}`
          }
        },
        xAxis: {
          type: 'time',
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [
          {
            type: 'inside',
            start: 80,
            end: 100
          },
          {
            start: 80,
            end: 100
          }
        ],
        series: [
          {
            name: '当日销售额',
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: {
              color: '#67C23A'
            },
            areaStyle: {
              color: '#67C23A'
            },
            data: this.order_sale,
          }
        ]
      };
      this.chartInstance.setOption(option);
    },
    initChart3(){
      this.chartInstance = this.$echarts.init(this.$refs.chart3);
      const option = {
        title: {
          text: '商品销量',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          formatter(params) {
            let circle = `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;left:5px;background-color:`;
            let data = `${circle}#E6A23C"></span>${params[0]["seriesName"]}&emsp;<b>${params[0]['value'][1]}</b>`;
            return `${params[0]['value'][0]}<br/>${data}`
          },
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          bottom: 90
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 15
          },
          {
            start: 0,
            end: 15
          }
        ],
        xAxis: {
          data: Array.from(this.item_quant, (v, k) => v[0]),
          silent: false,
          splitLine: {
            show: false
          },
          splitArea: {
            show: false
          }
        },
        yAxis: {
          splitArea: {
            show: false
          }
        },
        series: [
          {
            name: '商品销量',
            type: 'bar',
            animation: true,
            data: this.item_quant,
            // Set `large` for large data amount
            large: true,
            itemStyle: {
              color: '#E6A23C',
            }
          }
        ]
      };
      this.chartInstance.setOption(option);
    },
    initChart5(){
      this.chartInstance = this.$echarts.init(this.$refs.chart5);
      const color = "#409EFF"
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter(params) {
            let date = new Date(params[0]['value'][0])
            let circle = `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;left:5px;background-color:`;
            let data = `${circle}${color}"></span>${params[0]["seriesName"]}&emsp;<b>${params[0]['value'][1]}</b>`;
            return `${date.getFullYear()}-${padding(date.getMonth()+1, 2)}-${padding(date.getDate(), 2)}<br/>${data}`
          }
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: true },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'time',
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [
          {
            type: 'inside',
            start: 80,
            end: 100
          },
          {
            start: 80,
            end: 100
          }
        ],
        series: [
          {
            name: '当日订单量',
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: {
              color: color
            },
            itemStyle: {
              color: color,
            },
            areaStyle: {
              color: color
            },
            data: this.order_quant,
            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' }
              ],
              itemStyle: {
                color: color
              },
            },
            markLine: {
              data: [{ type: 'average', name: 'Avg' }],
              lineStyle: {
                color: color
              },
            }
          }
        ]
      };
      this.chartInstance.setOption(option);
    },
    initChart6(){
      this.chartInstance = this.$echarts.init(this.$refs.chart6);
      const color = '#67C23A'
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter(params) {
            let date = new Date(params[0]['value'][0])
            let circle = `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;left:5px;background-color:`;
            let data = `${circle}${color}"></span>${params[0]["seriesName"]}&emsp;<b>￥${params[0]['value'][1].toFixed(2)}</b>`;
            return `${date.getFullYear()}-${padding(date.getMonth()+1, 2)}-${padding(date.getDate(), 2)}<br/>${data}`
          }
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: true },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'time',
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [
          {
            type: 'inside',
            start: 80,
            end: 100
          },
          {
            start: 80,
            end: 100
          }
        ],
        series: [
          {
            name: '当日销售额',
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: {
              color: color
            },
            itemStyle: {
              color: color,
            },
            areaStyle: {
              color: color
            },
            data: this.order_sale,
            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' }
              ],
              itemStyle: {
                color: color
              },
            },
            markLine: {
              data: [{ type: 'average', name: 'Avg' }],
              lineStyle: {
                color: color
              },
            }
          }
        ]
      };
      this.chartInstance.setOption(option);
    },
    initChart7(){
      this.chartInstance = this.$echarts.init(this.$refs.chart7);
      const color = '#E6A23C'
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter(params) {
            let circle = `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;left:5px;background-color:`;
            let data = `${circle}${color}"></span>${params[0]["seriesName"]}&emsp;<b>${params[0]['value'][1]}</b>`;
            return `${params[0]['value'][0]}<br/>${data}`
          },
          axisPointer: {
            type: 'shadow'
          }
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: true },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        grid: {
          bottom: 90
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 15
          },
          {
            start: 0,
            end: 15
          }
        ],
        xAxis: {
          data: Array.from(this.item_quant, (v, k) => v[0]),
          silent: false,
          splitLine: {
            show: false
          },
          splitArea: {
            show: false
          }
        },
        yAxis: {
          splitArea: {
            show: false
          }
        },
        series: [
          {
            name: '商品销量',
            type: 'bar',
            animation: true,
            data: this.item_quant,
            // Set `large` for large data amount
            large: true,
            itemStyle: {
              color: color,
            },
            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' }
              ],
              itemStyle: {
                color: color
              },
            },
            markLine: {
              data: [{ type: 'average', name: 'Avg' }],
              lineStyle: {
                color: color
              },
            }
          }
        ]
      };
      this.chartInstance.setOption(option);
    },
  },
  created() {
    this.generateData()
    this.getData()
    this.calcData()
  },
  mounted() {
    this.initChart()
  },
};
</script>

<style scoped>
.el-col {
  text-align: center;
}
.chart {
  width: 100%;
  /* width: 943.5px; */
  height: 350px;
  margin-top: 10px;
}
.largeChart {
  width: 100%;
  /* width: 1887px; */
  height: 700px;
  margin: auto;
}
</style>