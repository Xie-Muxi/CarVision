
<template>
  <div>
    <n-button class="floating-button" @click="toggleModel">识别</n-button>


    <!-- <div id="scene">
          <a-scene
              mindar-image="imageTargetSrc: https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.1/examples/image-tracking/assets/band-example/band.mind;"
              color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false"
              device-orientation-permission-ui="enabled: false">
              <a-assets>
                  <a-asset-item id="bearModel"
                      src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.1/examples/image-tracking/assets/band-example/bear/scene.gltf"></a-asset-item>
                  <a-asset-item id="raccoonModel"
                      src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.1/examples/image-tracking/assets/band-example/raccoon/scene.gltf"></a-asset-item>
              </a-assets>

              <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

              <a-entity mindar-image-target="targetIndex: 0">
                  <a-gltf-model rotation="0 0 0 " position="0 -0.25 0" scale="0.05 0.05 0.05" src="#raccoonModel"
                      animation-mixer />
              </a-entity>
              <a-entity mindar-image-target="targetIndex: 1">
                  <a-gltf-model rotation="0 0 0 " position="0 -0.25 0" scale="0.05 0.05 0.05" src="#bearModel"
                      animation-mixer />
              </a-entity>
          </a-scene>
      </div> -->

    <!-- <a-scene
          mindar-image="imageTargetSrc: https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.1/examples/image-tracking/assets/card-example/card.mind;"
          color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false"
          device-orientation-permission-ui="enabled: false">
          <a-assets>
              <img id="card"
                  src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.1/examples/image-tracking/assets/card-example/card.png" />
              <a-asset-item id="avatarModel"
                  src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.1/examples/image-tracking/assets/card-example/softmind/scene.gltf"></a-asset-item>
          </a-assets>

          <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
          <a-entity mindar-image-target="targetIndex: 0">
              <a-plane src="#card" position="0 0 0" height="0.552" width="1" rotation="0 0 0"></a-plane>
              <a-gltf-model rotation="0 0 0 " position="0 0 0.1" scale="0.005 0.005 0.005" src="#avatarModel"
                  animation="property: position; to: 0 0.1 0.1; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate" />
          </a-entity>
      </a-scene> -->


    <iframe src="src/static/test.html" id="qt" scrolling="no" frameborder="0"
      style="position:absolute;top:64px;left: 0px;right:0px;bottom:100px;"></iframe>


  </div>
</template>

<script  lang="ts">

import { defineComponent, ref, onMounted } from 'vue'
export default defineComponent({
  setup() {

    onMounted(() => {
      changeqtIframe()
    })

    const toggleModel = (e: MouseEvent) => {
      console.log('toggleModel')
    }

    function changeqtIframe() {
      const qt = document.getElementById('qt')
      const deviceWidth = document.body.clientWidth
      const deviceHeight = document.body.clientHeight
      qt.style.width = Number(deviceWidth) + 'px' // 数字是页面布局宽度差值
      qt.style.height = Number(deviceHeight) + 'px' // 数字是页面布局高度差
    }

    return {
      toggleModel
    }


  }
})



</script>

<style scoped>
.floating-button {
  clear: both;
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 1000;
}
</style>
