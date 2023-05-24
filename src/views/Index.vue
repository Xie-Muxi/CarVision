<template>
    <div class="main">
        <div>
            <n-button id="recognize-button" @click="toggleModel" quaternary round size="tiny" type="primary">
                {{ buttonNames[buttonState] }}
            </n-button>
            <n-button id="info-button" @click="showInfo = true" quaternary circle size="tiny" type="primary">
                <i class="material-icons">info_outline_rounded</i>
            </n-button>
            <n-button id="bgm-button" @click="toggleBgm" quaternary round size="tiny" type="primary">
                <n-icon size="20">
                    <MusicNoteOutlined v-show="bgmState"/>
                    <MusicOffOutlined v-show="!bgmState"/>
                </n-icon>
            </n-button>
            <n-modal v-model:show="showInfo">
                <n-card title="Detail" :bordered="false" size="small" role="dialog" aria-modal="true"
                    style="width: 70%; right:25% position: fixed;  bottom: 20%">
                    <template #header-extra>

                    </template>
                    <n-select v-model:value="value" :options="infoOptions" size="small" style="font-size: 14px;" />
                    <template #footer>
                        <div v-if="value !== null" style="font-size: 14px;">
                            <div v-html="models[value].info"></div>
                        </div>
                    </template>
                </n-card>
            </n-modal>

        </div>

        <div v-show="isShowCamera">
            <div v-show="isShowCamera">
                <a-scene mindar-image="imageTargetSrc: src/assets/carvision.mind" color-space="sRGB"
                    renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false"
                    device-orientation-permission-ui="enabled: false">
                    <a-assets>
                        <a-asset-item v-for="(model, index) in models" :id="model.id" :src="model.src"
                            :key="index"></a-asset-item>
                    </a-assets>

                    <a-entity :id="model.id" class="clickable" v-for="(model, index) in models"
                        :mindar-image-target="{ targetIndex: index }" :key="index" :model-id="model.id">

                        <a-gltf-model class="clickable" :rotation="model.rotation" :position="model.position"
                            :scale="model.scale" :src="'#' + model.id" animation-mixer
                            @click="handleModelClick(model.id)" />
                    </a-entity>

                    <!-- <a-camera position="0 0 0" look-controls="enabled: false"></a-camera> -->
                    <a-camera position="0 0 0" look-controls="enabled: false" cursor="fuse: false; rayOrigin: mouse;"
                        raycaster="far: ${customFields.libVersion}; objects: .clickable"></a-camera>
                </a-scene>
            </div>
        </div>

    </div>
</template>


<script lang="ts" >
import { defineComponent, ref, onMounted, nextTick } from 'vue'
import 'aframe';
import 'mind-ar/dist/mindar-image-aframe.prod.js';

import { CashOutline as CashIcon } from '@vicons/ionicons5'
import {MusicNoteOutlined, MusicOffOutlined} from '@vicons/material'

export default defineComponent({
    components: {
        CashIcon,
        MusicNoteOutlined,
        MusicOffOutlined
    },

    setup() {
        
        // define your button names of different states
        const buttonState = ref(0);
        const buttonNames = ['Running', 'Pause'];
        let isShowCamera = ref(true);

        // control the aframe
        let trackedModelInfo = ref<{ id: string; src: string; scale: string; info: string } | null>(null);
        let trackedModelId = ref<string | null>(null);
        let showInfo = ref<boolean>(false);

        // control the bgm
        let bgmState = ref(0);
        const bgm = new Audio('src/assets/bgm.mp3');
        bgm.loop = true;

        // define your models
        const models = ref([
            {
                id: 'british',
                label: 'British',
                src: 'src/assets/british/scene.gltf',
                scale: '0.01 0.01 0.01',
                position: "0 0 0",
                rotation: "90 0 0",
                info: `
        <h1>British</h1>
        <p>The British luxury car is a masterpiece of engineering and design, crafted with precision and attention to detail. Its sleek and elegant exterior is matched only by its smooth and comfortable ride, making it the perfect choice for those who demand the very best.</p>
        <p>With a powerful V8 Twin-Turbo engine under the hood, the British delivers an impressive 550 horsepower, allowing it to reach a top speed of 200 mph. And with acceleration that can take you from 0 to 60 mph in just 4 seconds, this car is sure to get your heart racing.</p>
        <p>But the British is more than just a high-performance machine. It's also packed with features that make it a joy to drive, including:</p>
        <ul>
            <li>Adaptive suspension for a smooth ride on any terrain</li>
            <li>Advanced driver assistance systems to keep you safe on the road</li>
            <li>State-of-the-art infotainment system with a large touchscreen display</li>
            <li>Luxurious leather seats that provide maximum comfort and support</li>
        </ul>
        <p>Whether you're cruising down the highway or navigating city streets, the British is the ultimate driving machine, combining power, performance, and luxury in one stunning package.</p> 
        `
            },
            {
                id: 'lamborghini',
                label: 'Lamborghini',
                src: 'src/assets/lamborghini/scene.gltf',
                position: "0 0 0",
                rotation: "90 0 0",
                scale: '0.5 0.5 0.5',
                info: `
                        <h1>Lamborghini</h1>
                        <p>Lamborghini is a high-performance sports car known for its sleek design and powerful performance. It is a symbol of luxury and speed.</p>
                        <p>The Lamborghini is a car that is designed to be driven fast. With a top speed of 220 mph and acceleration that can take you from 0 to 60 mph in just 2.9 seconds, this car is not for the faint of heart. But it's not just about speed. The Lamborghini is also a work of art, with its sleek lines and aerodynamic design.</p>
                        <p>Inside the Lamborghini, you'll find a luxurious interior that is designed for comfort and style. The seats are made from the finest materials and are designed to provide maximum support and comfort. The dashboard is sleek and modern, with all the latest technology at your fingertips.</p>
                        <p>If you're looking for a car that combines speed, luxury, and style, then the Lamborghini is the car for you.</p>
                        <p>The Lamborghini is a car that is designed to be driven fast. With a top speed of 220 mph and acceleration that can take you from 0 to 60 mph in just 2.9 seconds, this car is not for the faint of heart. But it's not just about speed. The Lamborghini is also a work of art, with its sleek lines and aerodynamic design. The car is designed to be as aerodynamic as possible, with every curve and angle carefully crafted to reduce drag and increase speed. The result is a car that is not only fast, but also incredibly agile and responsive. </p>
                        <p>But the Lamborghini is more than just a high-performance machine. It's also packed with features that make it a joy to drive, including:</p>
                        <ul>
                            <li>Adaptive suspension for a smooth ride on any terrain</li>
                            <li>Advanced driver assistance systems to keep you safe on the road</li>
                            <li>State-of-the-art infotainment system with a large touchscreen display</li>
                            <li>Luxurious leather seats that provide maximum comfort and support</li>
                        </ul>
                        <p>Whether you're cruising down the highway or navigating city streets, the Lamborghini is the ultimate driving machine, combining power, performance, and luxury in one stunning package.</p>
                        `
            },
            {
                id: 'benz_a45_amg_2018',
                label: 'Benz A45 Amg 2018',
                src: 'src/assets/benz_a45_amg_2018/scene.gltf',
                position: "0 0 0",
                rotation: "90 0 0",
                scale: '0.08 0.08 0.08',
                info: `
                        <h1>Benz A45 Amg 2018</h1>
                        <p>The Benz A45 Amg 2018 is a compact luxury car that is designed for performance and comfort. It combines sportiness with everyday practicality.</p>
                        <p>Under the hood, you'll find a 2.0L Turbocharged Inline-4 engine that delivers an impressive 375 horsepower. This allows the car to reach a top speed of 155 mph and accelerate from 0 to 60 mph in just 4.1 seconds.</p>
                        <p>But it's not just about speed. The Benz A45 Amg 2018 is also designed for comfort and convenience. The interior is spacious and luxurious, with seats that are designed to provide maximum comfort and support. The dashboard is modern and sleek, with all the latest technology at your fingertips.</p>
                        <p>If you're looking for a car that combines performance, luxury, and practicality, then the Benz A45 Amg 2018 is the car for you.</p>
                        <p>The Benz A45 Amg 2018 is a car that is designed to be both practical and sporty. It's the perfect car for those who want the best of both worlds. The car is equipped with a 2.0L Turbocharged Inline-4 engine that delivers an impressive 375 horsepower, allowing it to reach a top speed of 155 mph and accelerate from 0 to 60 mph in just 4.1 seconds. But it's not just about speed. The Benz A45 Amg 2018 is also designed for comfort and convenience. The interior is spacious and luxurious, with seats that are designed to provide maximum comfort and support. The dashboard is modern and sleek, with all the latest technology at your fingertips. </p>
                        <p>The car is also designed to be practical, with plenty of storage space and a comfortable ride. It's the perfect car for those who want a car that can handle both their daily commute and their weekend adventures. </p>
                        `
            },
            {
                id: 'audi_a1',
                label: 'Audi A1',
                src: 'src/assets/audi_a1/scene.gltf',
                position: "0 0 0",
                rotation: "90 0 0",
                scale: '0.035 0.035 0.035',
                info: `
                        <h1>Audi A1</h1>
                        <p>The Audi A1 is a premium compact car that is designed for style and performance. It offers a comfortable and enjoyable driving experience.</p>
                        <p>Under the hood, you'll find a 1.5L Turbocharged Inline-4 engine that delivers 150 horsepower. This allows the car to reach a top speed of 130 mph and accelerate from 0 to 60 mph in just 8.8 seconds.</p>
                        <p>But it's not just about performance. The Audi A1 is also designed for comfort and convenience. The interior is spacious and luxurious, with seats that are designed to provide maximum comfort and support. The dashboard is modern and sleek, with all the latest technology at your fingertips.</p>
                        <p>If you're looking for a car that combines style, performance, and comfort, then the Audi A1 is the car for you.</p>
                        <p>The Audi A1 is a car that is designed to be both stylish and practical. It's the perfect car for those who want a car that looks great and performs well. The car is equipped with a 1.5L Turbocharged Inline-4 engine that delivers 150 horsepower, allowing it to reach a top speed of 130 mph and accelerate from 0 to 60 mph in just 8.8 seconds. But it's not just about performance. The Audi A1 is also designed for comfort and convenience. The interior is spacious and luxurious, with seats that are designed to provide maximum comfort and support. The dashboard is modern and sleek, with all the latest technology at your fingertips. </p>
                        <p>The car is also designed to be practical, with plenty of storage space and a comfortable ride. It's the perfect car for those who want a car that can handle both their daily commute and their weekend adventures. </p>
                        `
            }
        ]);


        const toggleModel = async () => {

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

        const toggleBgm = async () => {
            if (bgmState.value === 0) {
                console.log("bgm start");
                bgm.play();
                bgmState.value = 1;
            } else {
                console.log("bgm pause");
                bgm.pause();
                bgmState.value = 0;
            }
        }


        const infoClick = () => {

        }

        const handleModelClick = (id: string) => {
            console.log(id + ' click');
        };



        const handleTargetLost = (event: any) => {
            console.log('Target lost event:', event);
            trackedModelId.value = null;
            trackedModelInfo.value = null;
        }



        onMounted(async () => {
            await nextTick();
            // toggleModel();
        })

        return {
            toggleModel,
            infoClick,
            handleTargetLost,
            handleModelClick,
            toggleBgm,
            trackedModelId,
            buttonState,
            buttonNames,
            isShowCamera,
            models,
            trackedModelInfo,
            value: ref(null),
            bodyStyle: {
                width: '70%'
            },
            segmented: {
                content: 'soft',
                footer: 'soft'
            } as const,
            bgmState,
            showInfo: ref(false),
            infoOptions: [
                {
                    label: 'British',
                    value: 0
                },
                {
                    label: 'Lamborghini',
                    value: 1
                },
                {
                    label: 'Benz A45 Amg 2018',
                    value: 2
                },
                {
                    label: 'Audi A1',
                    value: 3
                },
            ],
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

#bgm-button {
    clear: both;
    position: fixed;
    right: 3%;
    top: 3%;
    z-index: 1000;
}

a-scene {
    width: 100%;
    height: 100vh;
}
</style>