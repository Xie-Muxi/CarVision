<template>
    <div class="main">
        <div>
            {{ trackedModelInfo?.info }}
        </div>

        <div class="button-group">
            <n-button id="recognize-button" @click="toggleModel" quaternary round size="tiny" type="info">
                {{ buttonNames[buttonState] }}
            </n-button>
            <n-button id="info-button" @click="showInfo = true" quaternary circle size="tiny" type="info">
                <i class="material-icons">info_outline_rounded</i>
            </n-button>

            <n-modal v-model:show="showInfo" class="custom-card" preset="card" :style="bodyStyle" title="卡片预设" size="small"
                :bordered="false" :segmented="segmented">
                <template #header-extra>
                    噢!
                </template>
                {{ trackedModelInfo?.id }}
                <template #footer>
                    尾部
                </template>
            </n-modal>
        </div>

        <div v-show="isShowCamera">
            <a-scene mindar-image="imageTargetSrc: src/assets/band-example/band.mind;" color-space="sRGB"
                renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false"
                device-orientation-permission-ui="enabled: false">
                <a-assets>
                    <a-asset-item v-for="(model, index) in models" :id="model.id" :src="model.src"
                        :key="index"></a-asset-item>
                </a-assets>

                <!-- <a-entity v-for="(model, index) in models" :mindar-image-target="{targetIndex: index}" :key="index"
                    :model-id="model.id" @targetfound="handleTargetFound" @targetlost="handleTargetLost" >
                    <a-gltf-model rotation="90 0 0 " position="0 0 0" :scale="model.scale" :src="'#' + model.id"
                        animation-mixer />
                </a-entity> -->

                <a-entity v-for="(model, index) in models" :mindar-image-target="{targetIndex: index}" :key="index"
                    :model-id="model.id" @targetfound="handleTargetFound" @targetlost="handleTargetLost">
                <a-gltf-model class="clickable" rotation="90 0 0 " position="0 0 0" :scale="model.scale" :src="'#' + model.id"
                    animation-mixer />
                </a-entity>


                <a-camera position="0 0 0" look-controls="enabled: false" cursor="fuse: false; rayOrigin: mouse;" raycaster="far: ${customFields.libVersion}; objects: .clickable"></a-camera>
            </a-scene>
        </div>

    </div>
</template>


<script lang="ts" >
import { defineComponent, ref, onMounted, nextTick } from 'vue'
import 'aframe';
import 'mind-ar/dist/mindar-image-aframe.prod.js';
import { AFrame } from 'aframe';

import { CashOutline as CashIcon } from '@vicons/ionicons5'


export default defineComponent({
    components: {
        CashIcon,
    },

    setup() {
        let buttonState = ref(0);
        const sceneEl = ref<AFrame.Scene | null>(null);

        onMounted(() => {
            nextTick(() => {
                if (sceneEl.value) {
                initializeAR();
                }
            });
        });


        const handleTargetFound = () => {
            console.log('目标找到');
            };

            const handleTargetLost = () => {
            console.log('目标丢失');
            };

            const handlePlaneClick = () => {
            console.log('平面点击');
            };

        // define your button names of different states
        let buttonNames = ['识别', '暂停'];
        let isShowCamera = ref(true);

        let trackedModelInfo = ref<{ id: string; src: string; scale: string; info: string } | null>(null);
        let trackedModelId = ref<string | null>(null); // 初始化为 null 并明确类型为 string | null
        let showInfo = ref<boolean>(false); // 使用 ref() 创建响应式变量

        let models: Array<{ id: string; src: string; scale: string; info: string }> = [
            { id: "british", src: "src/assets/british/scene.gltf", scale: "0.01 0.01 0.01", info: "british" },
            { id: "lamborghini", src: "src/assets/lamborghini/scene.gltf", scale: "0.5 0.5 0.5", info: "lamborghini" },
            { id: "benz_a45_amg_2018", src: "src/assets/benz_a45_amg_2018/scene.gltf", scale: "0.05 0.05 0.05", info: "benz_a45_amg_2018" },
            { id: "audi_a1", src: "src/assets/audi_a1/scene.gltf", scale: "0.035 0.035 0.035", info: "audi_a1" }
        ];


        const toggleModel = async () => {
            // await nextTick();
            // const sceneEl = document.querySelector('a-scene');
            // const arSystem = sceneEl.systems["mindar-image-system"];

            if (buttonState.value === 0) {
                console.log("start");
                // arSystem.start(); // start AR 
                buttonState.value = 1;
            } else {
                console.log("pause");
                // arSystem.stop(); // pause AR, keep video feed
                buttonState.value = 0;
            }
            isShowCamera.value = !isShowCamera.value;
        }

        // 定义一个函数来获取当前追踪的模型的信息
        const updateModelInfo = () => {
            if (trackedModelId.value) {
                trackedModelInfo.value = models.find(model => model.id === trackedModelId.value) || null;
            } else {
                console.log('No model is being tracked.');
            }
        }

        const infoClick = () => {

        }

        const handleTargetSeen = (event: any) => {
            let modelId = event.target.getAttribute('model-id');
            console.log('Target seen event:', event);  // 打印整个事件对象，可以看到更详细的信息
            console.log('Model ID:', modelId);  // 打印模型ID
            trackedModelId.value = modelId;
            let foundModel = models.find(model => model.id === trackedModelId.value)
            if (foundModel) {
                trackedModelInfo.value = foundModel;
            }
        }


        const initializeAR = () => {
            const arSystem = sceneEl.value.systems['mindar-image-system'];
            const exampleTarget = sceneEl.value.querySelector('#example-target');
            const examplePlane = sceneEl.value.querySelector('#example-plane');
            const startButton = document.querySelector('#example-start-button');
            const stopButton = document.querySelector('#example-stop-button');
            const pauseButton = document.querySelector('#example-pause-button');
            const pauseKeepVideoButton = document.querySelector('#example-pause-keep-video-button');
            const unpauseButton = document.querySelector('#example-unpause-button');

            startButton.addEventListener('click', () => {
                console.log('start');
                arSystem.start(); // start AR
            });
            stopButton.addEventListener('click', () => {
                arSystem.stop(); // stop AR
            });
            pauseButton.addEventListener('click', () => {
                arSystem.pause(); // pause AR, keep video feed
            });
            pauseKeepVideoButton.addEventListener('click', () => {
                arSystem.pause(true); // pause AR and video
            });
            unpauseButton.addEventListener('click', () => {
                arSystem.unpause(); // unpause AR and video
            });

            // arReady event triggered when ready
            sceneEl.value.addEventListener('arReady', (event) => {
                // console.log('MindAR is ready')
            });

            // arError event triggered when something went wrong. Mostly browser compatibility issue
            sceneEl.value.addEventListener('arError', (event) => {
                // console.log('MindAR failed to start')
            });

            // detect target found
            exampleTarget.addEventListener('targetFound', (event: any) => {
                console.log('target found');
            });

            // detect target lost
            exampleTarget.addEventListener('targetLost', (event: any) => {
                console.log('target lost');
            });

            // detect click event
            examplePlane.addEventListener('click', (event: any) => {
                console.log('plane click');
            });
            };


        return {
            handleTargetFound,
            handleTargetLost,
            handlePlaneClick,
            toggleModel,
            infoClick,
            handleTargetSeen,
            trackedModelId,
            buttonState,
            buttonNames,
            isShowCamera,
            models,
            trackedModelInfo,
            bodyStyle: {
                width: '50%'
            },
            segmented: {
                content: 'soft',
                footer: 'soft'
            } as const,
            showInfo: ref(false),
            sceneEl,
        }
    }
})
</script>

<style scoped >
#recognize-button {
    clear: both;
    position: fixed;
    left: 3%;
    bottom: 3%;
    z-index: 1000;
}

#info-button {
    clear: both;
    position: fixed;
    right: 3%;
    bottom: 3%;
    z-index: 1000;
}

a-scene {
    width: 100%;
    height: 100vh;
    /* Use viewport height */
}
</style>