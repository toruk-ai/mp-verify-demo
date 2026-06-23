<template>
  <div class="container">
    <h2>微信域名校验文件内容</h2>
    <div class="text-box">{{ verifyText }}</div>
  </div>
</template>

<script setup>
// 这里填写你的校验文件完整字符
const verifyText = "Yen2wgAHpHgQR6rC";
</script>

<style scoped>
.container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}
.text-box {
  margin-top: 20px;
  padding: 16px 30px;
  background: #fff;
  border: 1px solid #eee;
  font-size: 16px;
  letter-spacing: 1px;
}
</style>