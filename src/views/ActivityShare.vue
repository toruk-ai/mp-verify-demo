<template>
  <div class="page-wrap">
    <!-- 活动结束顶部提示 -->
    <div v-if="activity.activityStatus === 3" class="tip-bar">活动已结束</div>

    <!-- 右上角分享按钮 -->
<!--    <div class="share-btn" @click="openShareTip">-->
<!--      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">-->
<!--        <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8A4 4 0 0 0 22 4A4 4 0 0 0 18 0A4 4 0 0 0 14 4C14 4.24 14.04 4.47 14.09 4.7L7.04 8.81C6.5 8.31 5.79 8 5 8A4 4 0 0 0 1 12A4 4 0 0 0 5 16C5.79 16 6.5 15.69 7.04 15.19L14.16 19.35C14.11 19.56 14.08 19.78 14.08 20A4 4 0 0 0 18 24A4 4 0 0 0 22 20A4 4 0 0 0 18 16.08M18 2A2 2 0 0 1 20 4A2 2 0 0 1 18 6A2 2 0 0 1 16 4A2 2 0 0 1 18 2M5 10A2 2 0 0 1 3 12A2 2 0 0 1 5 14A2 2 0 0 1 7 12A2 2 0 0 1 5 10M18 22A2 2 0 0 1 16 20A2 2 0 0 1 18 18A2 2 0 0 1 20 20A2 2 0 0 1 18 22" fill="#fff"/>-->
<!--      </svg>-->
<!--    </div>-->

    <!-- 顶部背景图 -->
    <div class="head-bg">
      <img src="/static/image/equipmentinstall/wx_activity_head_bg.png" alt="头部背景" />
    </div>

    <!-- 头部标题区域 -->
    <div class="header-title">
      <img style="width: 180px;" src="/static/image/equipmentinstall/wx_activity_install_device.png" alt="装机红包图标" />
      <p style="font-size: 16px;margin-top: 10px;">完成认证，装机立得领红包</p>
      <div class="time-tag">
        活动时间：{{ activity.startTime.substring(0,10) + '-' + activity.endTime.substring(0,10) }}
        <span v-if="activity.activityStatus === 3">(已结束)</span>
      </div>

      <div class="packet-wrap">
        <img class="packet-img" src="/static/image/equipmentinstall/wx_activity_redpacket.png" alt="红包" />
        <img class="like-img" src="/static/image/equipmentinstall/wx_activity_like.png" alt="点赞" />
      </div>
    </div>

    <!-- 活动规则卡片 -->
    <div class="rule-card">
      <div class="rule-title">
        <span style="margin-top: -40px;"><img src="/static/image/equipmentinstall/wx_activity_eye.png" alt="眼睛图标" /></span>
        <span>活动规则</span>
      </div>
      <div class="rule-item">
        <div class="rule-item-head">
          <span class="num-tag">1</span>
          <span class="rule-title-text">参与对象</span>
        </div>
        <div class="rule-content">官方认证服务商</div>
      </div>
      <div class="rule-item">
        <div class="rule-item-head">
          <span class="num-tag">2</span>
          <span class="rule-title-text">安装设备</span>
        </div>
        <div class="rule-content">{{ activity.appRealName }}摄像头：{{ activity.productType }}</div>
      </div>
    </div>

    <!-- 立即参与按钮 -->
    <div id="joinNowBtn" class="join-btn-wrap">
      <img
          v-if="activity.activityStatus === 3"
          class="join-btn"
          src="/static/image/equipmentinstall/wx_activity_join_other.png"
          @click="handleJoinClick"
      />
      <img
          v-if="activity.activityStatus === 2"
          class="join-btn"
          src="/static/image/equipmentinstall/wx_activity_join_now.png"
          @click="handleJoinClick"
      />
    </div>

    <!-- 微信分享引导遮罩 -->
    <div class="cover-tips" v-show="showShareMask" @click="closeShareTip">
      <div class="tips-content">
        <div class="tips-text text-switch">点击右上角分享到好友/朋友圈</div>
        <div class="tips-btn">
          <div class="btn-radius btn-transparent text-switch" @click.stop="closeShareTip">关闭</div>
        </div>
      </div>
    </div>

    <!-- 隐藏DOM用于跳转兼容 -->
    <iframe id="iframe" style="display:none;"></iframe>
    <a id="aLink" style="display:none;"></a>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import $ from 'jquery'

// ====================== 1、页面响应式数据 ======================
// 活动数据，对应后端返回实体
const activity = ref({
  activityStatus: 2, // 2进行中 3已结束
  startTime: '2026-07-01 00:00:00',
  endTime: '2026-07-31 24:00:00',
  appRealName: 'Seetong',
  productType: 'E10/E30',
  appPackageName: 'dawhouse',
  appName: 'Seetong'
})

// 分享遮罩显示状态
const showShareMask = ref(false)

// 全局变量挂载（供微信分享JS读取）
window.appPackageName = activity.value.appPackageName
window.appNickName = activity.value.appName

// ====================== 2、按钮点击事件 ======================
// 立即参与点击
const handleJoinClick = () => {
  const btn = $('.join-btn')
  btn.css('opacity', '0.7').attr('disabled', true)
  layer.msg('正在跳转活动页...', { icon: 6, time: 1500 }, () => {
    btn.css('opacity', '1').removeAttr('disabled')
    // 此处替换你的跳转地址
    // location.href = "/app/download"
  })
}

// 打开分享引导弹窗
const openShareTip = () => {
  // 先初始化微信JS-SDK分享配置
  initWxShare()
  showShareMask.value = true
}

// 关闭分享遮罩
const closeShareTip = () => {
  showShareMask.value = false
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
      const shareTitle = '装机领红包活动'
      const shareDesc = '认证服务商装机即可领取现金红包，多装多赚'
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
    console.error('微信签名获取失败', err)
  }
}

// ====================== 4、页面挂载完成初始化 ======================
onMounted(() => {
  // 加载layui
  layui.use(['layer'], function () {
    window.layer = layui.layer
  })
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  background: #F9E7EC;
  min-height: 100vh;
  font-family: "Microsoft Yahei", sans-serif;
  color: #333;
}
.page-wrap {
  position: relative;
  width: 100%;
  overflow-x: hidden;
}
/* 右上角分享按钮 */
.share-btn {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 99999;
  width: 40px;
  height: 40px;
  background: rgba(0,0,0,0.35);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tip-bar{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  padding: 6px;
  color: #fff;
  font-size: 15px;
  text-align: center;
  background: rgb(6 6 6 / 42%);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,.2);
  box-shadow: 0 8px 32px rgba(0,0,0,.15);
}
.head-bg img {
  width: 100%;
  display: block;
}
/* 顶部标题 */
.header-title {
  text-align: center;
  color: #fff;
  position: absolute;
  top: 5%;
  width: 100%;
}
.header-title h1 {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.header-title p {
  font-size: 20px;
  margin-bottom: 20px;
  opacity: 0.95;
}
.time-tag {
  display: inline-block;
  background: #ff4458;
  color: #fff;
  padding: 8px 25px;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 500;
}
/* 红包卡片 */
.packet-wrap{
  position:relative;
  display:inline-block;
  width:100%;
  margin-top: 15px;
}
.packet-img{
  width:100%;
  display:block;
}
.like-img{
  position:absolute;
  right:45px;
  bottom:-10px;
  width:100px;
  z-index:2;
}
/* 活动规则 */
.rule-card {
  background: #fff;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  margin: 20px 18px 18px;
  text-align: center;
}
.rule-title {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  justify-content: center;
}
.rule-title img {
  width: 50px;
}
.rule-item {
  margin-bottom: 10px;
}
.rule-item:last-child {
  margin-bottom: 0;
}
.rule-item-head {
  display: flex;
  align-items: center;
  justify-content: center;
}
.rule-item .num-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: linear-gradient( 90deg, #FF688E 0%, #FA2C48 100%);
  color: #fff;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  margin-right: 10px;
}
.rule-item .rule-title-text {
  font-size: 18px;
  font-weight: bold;
  display: inline-block;
}
.rule-item .rule-content {
  margin-top: 8px;
  padding-left: 36px;
  font-size: 16px;
  color: #333333;
  line-height: 1.6;
  text-align: left;
}
/* 立即参与按钮 */
.join-btn-wrap{
  width:100%;
  padding:0 90px;
  box-sizing:border-box;
  text-align:center;
  height: 80px;
}
.join-btn{
  display:block;
  height: auto;
  width:100%;
  max-width:500px;
  margin:0 auto;
  cursor:pointer;
  animation:pulseBtn 1.5s infinite;
}
@keyframes pulseBtn{
  0%{
    transform:scale(1);
  }
  50%{
    transform:scale(1.05);
  }
  100%{
    transform:scale(1);
  }
}
.join-btn:active{
  transform:scale(0.95);
}
.cover-tips {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  overflow: hidden;
  z-index: 99999;
}
.cover-tips .tips-content {
  text-align: center;
  margin: 100px auto;
}
.cover-tips .tips-content .tips-text {
  font-size: 17px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20px;
}
.btn-radius {
  display: inline-block;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  user-select: none;
}
.btn-transparent {
  width: 150px;
  height: 30px;
  line-height: 30px;
  font-size: 17px;
  background: transparent;
  border: 1px solid #ffffff;
}
</style>