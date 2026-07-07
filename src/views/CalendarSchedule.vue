<template>
  <div class="mobile-calendar-wrap">
    <div class="calendar-card">
      <!-- 头部年月切换 -->
      <div class="calendar-header">
        <button class="btn-arrow" @click="prevMonth">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div class="current-ym">{{ year }}年{{ month + 1 }}月</div>
        <button class="btn-arrow" @click="nextMonth">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <!-- 星期头部 -->
      <div class="week-row">
        <div v-for="w in weekDays" key="w" class="week-label">{{ w }}</div>
      </div>

      <!-- 日期网格 -->
      <div class="days-grid">
        <div
          v-for="(dayItem, idx) in calendarDays"
          :key="idx"
          class="day-cell"
          :class="{
            empty: !dayItem.date,
            today: isToday(dayItem.date),
            selected: isSelected(dayItem.date)
          }"
          @click="selectDay(dayItem.date)"
        >
          <!-- 日期数字 -->
          <div class="day-num" v-if="dayItem.date">{{ dayItem.day }}</div>
          <!-- 农历 -->
          <div class="lunar-text" v-if="dayItem.date">{{ getLunar(dayItem.date) }}</div>
          <!-- 节假日/调休 -->
          <div class="tag-holiday" v-if="dayItem.holiday">{{ dayItem.holiday }}</div>
          <div class="tag-workday" v-if="dayItem.workday">调休</div>
          <!-- 排班标签 -->
          <div v-if="dayItem.date" class="shift-badge" :class="getShift(dayItem.date)">
            {{ getShift(dayItem.date) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// 排班基准日 2026-05-06
const baseDate = new Date(2026, 4, 6)
// 四班循环
const shifts = ['白班', '晚班', '出班', '助班']
// 星期文案
const weekDays = ['日', '一', '二', '三', '四', '五', '六']
// 农历简易列表
const lunarDays = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
]

// 当前年月 默认今天年月
const now = new Date()
const year = ref(now.getFullYear())
const month = ref(now.getMonth())
// 选中日期 默认当天
const selectedDate = ref(new Date(now.toDateString()))
// 节假日缓存
const holidayCache = ref({})
const currentHolidayMap = computed(() => holidayCache.value[year.value] || {})

// 请求当年节假日
const fetchHolidays = async (y) => {
  if (holidayCache.value[y]) return
  try {
    const res = await fetch(`https://timor.tech/api/holiday/year/${y}/`)
    const data = await res.json()
    const map = {}
    Object.keys(data.holiday).forEach(d => {
      const item = data.holiday[d]
      map[d] = {
        name: item.name,
        isHoliday: item.holiday,
        isWorkday: item.workday
      }
    })
    holidayCache.value[y] = map
  } catch (e) {
    console.error('节假日接口请求失败', e)
  }
}

// 生成当月日历数组
const calendarDays = computed(() => {
  const firstDay = new Date(year.value, month.value, 1)
  const startWeek = firstDay.getDay()
  const totalDay = new Date(year.value, month.value + 1, 0).getDate()
  const list = []

  // 填充上月空白占位
  for (let i = 0; i < startWeek; i++) {
    list.push({ day: '', date: null, holiday: '', workday: false })
  }

  // 填充当月日期
  for (let i = 1; i <= totalDay; i++) {
    const dateObj = new Date(year.value, month.value, i)
    const monthStr = String(dateObj.getMonth() + 1).padStart(2, '0')
    const dayStr = String(i).padStart(2, '0')
    const holidayKey = `${monthStr}-${dayStr}`
    const holidayInfo = currentHolidayMap.value[holidayKey] || {}

    list.push({
      day: i,
      date: dateObj,
      holiday: holidayInfo.name || '',
      workday: !!holidayInfo.isWorkday
    })
  }
  return list
})

// 判断是否今日
const isToday = (date) => {
  if (!date) return false
  return date.toDateString() === new Date().toDateString()
}

// 选中日期
const selectDay = (date) => {
  if (date) selectedDate.value = new Date(date.toDateString())
}

// 判断是否选中
const isSelected = (date) => {
  if (!date || !selectedDate.value) return false
  return date.toDateString() === selectedDate.value.toDateString()
}

// 获取当日排班
const getShift = (date) => {
  const dayDiff = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24))
  const idx = ((dayDiff % 4) + 4) % 4
  return shifts[idx]
}

// 简易农历推算
const getLunar = (date) => {
  const lunarBase = new Date(2026, 0, 1)
  const diff = Math.floor((date - lunarBase) / (1000 * 60 * 60 * 24))
  const lunarIdx = (diff % 30 + 30) % 30
  return lunarDays[lunarIdx]
}

// 上一月
const prevMonth = () => {
  if (month.value === 0) {
    year.value--
    month.value = 11
  } else {
    month.value--
  }
  fetchHolidays(year.value)
}

// 下一月
const nextMonth = () => {
  if (month.value === 11) {
    year.value++
    month.value = 0
  } else {
    month.value++
  }
  fetchHolidays(year.value)
}

// ====================== 3、微信JS-SDK分享核心方法 ======================
const initWxShare = async () => {
  const currentUrl = window.location.href.split('#')[0]
  try {
    // 1、请求后端接口获取微信签名（后端提供wx config签名接口）
    const res = await $.getJSON('/api/wx/getSign', { url: currentUrl })
    if (res.code !== 0) return

    const wxConfig = res.data
    // 2、注入微信配置
    wx.config({
      debug: false, // 上线改为false，调试true
      appId: wxConfig.appId,
      timestamp: wxConfig.timestamp,
      nonceStr: wxConfig.nonceStr,
      signature: wxConfig.signature,
      jsApiList: [
        'updateAppMessageShareData',
        'updateTimelineShareData',
        'onMenuShareTimeline',
        'onMenuShareAppMessage'
      ]
    })

    // 3、配置分享内容
    wx.ready(() => {
      const shareTitle = '排班日历'
      const shareDesc = '查看排班日历，获取排班信息，节假日安排'
      const shareImg = window.location.origin + '/static/image/equipmentinstall/share_cover.png'
      const shareLink = window.location.href

      // 分享给好友
      wx.updateAppMessageShareData({
        title: shareTitle,
        desc: shareDesc,
        link: shareLink,
        imgUrl: shareImg,
        success: () => {}
      })
      // 分享朋友圈
      wx.updateTimelineShareData({
        title: shareTitle,
        link: shareLink,
        imgUrl: shareImg,
        success: () => {}
      })
    })
  } catch (err) {
    alert('微信签名获取失败'+err)
    console.error('微信签名获取失败', err)
  }
}

// 初始化加载当年节假日
onMounted(() => {
  fetchHolidays(year.value)
  initWxShare()
})
watch(year, (y) => fetchHolidays(y))
</script>

<style scoped>
/* 全局移动端适配 适配APP内嵌H5 */
.mobile-calendar-wrap {
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  background: #f7f8fa;
  min-height: 100vh;
}
.calendar-card {
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 12px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
}

/* 头部年月 */
.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.btn-arrow {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #f0f5ff;
  color: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.current-ym {
  font-size: 17px;
  font-weight: 600;
  color: #222;
}

/* 星期栏 */
.week-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
}
.week-label {
  text-align: center;
  font-size: 13px;
  color: #666;
  padding: 6px 0;
  font-weight: 500;
}

/* 日期网格 */
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}
.day-cell {
  min-height: 92px;
  padding: 6px 4px;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
  position: relative;
  box-sizing: border-box;
}
/* 空白格子 */
.day-cell.empty {
  background: #fafafa;
  border: none;
}
/* 当天高亮 */
.day-cell.today {
  background: #e6f7ff;
  border-color: #91caff;
}
/* 选中边框 */
.day-cell.selected {
  outline: 2px solid #ff4d4f;
  outline-offset: 1px;
}

.day-num {
  font-size: 15px;
  font-weight: 600;
  color: #222;
  line-height: 1.2;
}
.lunar-text {
  font-size: 10px;
  color: #999;
  line-height: 1.2;
  margin: 2px 0;
}
.tag-holiday {
  font-size: 10px;
  color: #f5222d;
  line-height: 1.2;
}
.tag-workday {
  font-size: 10px;
  color: #1890ff;
  line-height: 1.2;
}

/* 排班角标 */
.shift-badge {
  position: absolute;
  right: 4px;
  bottom: 4px;
  font-size: 10px;
  color: #fff;
  padding: 2px 5px;
  border-radius: 12px;
}
.shift-badge.白班 {
  background: #52c41a;
}
.shift-badge.晚班 {
  background: #722ed1;
}
.shift-badge.出班 {
  background: #fa8c16;
}
.shift-badge.助班 {
  background: #13c2c2;
}
</style>