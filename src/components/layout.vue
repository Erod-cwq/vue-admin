<template>
  <a-layout id="components-layout-demo-top" class="layout">
    <a-layout-header>
      <div class="logo" />
      <a-menu
          theme="dark"
          mode="horizontal"
          :default-selected-keys="['2']"
          :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="文章">
          <router-link :to="{name: 'Post'}">文章</router-link>
        </a-menu-item>
        <a-menu-item key="文件">
          <router-link :to="{name: 'Attachment'}">文件</router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content :style="{ height: '100%', margin: '24px 24px 0', paddingTop:'0'}">
      <div :style="{ background: '#fff',height: '100%', padding: '24px', minHeight: '480px' }">
        <router-view />
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Created by Nakiru
    </a-layout-footer>
  </a-layout>
</template>
<script>
export default {
  name:'Layout'
}
</script>
<style>

.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
#components-layout-demo-top .logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
  float: left;
}
</style>

