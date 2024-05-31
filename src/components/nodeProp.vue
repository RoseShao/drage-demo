<!-- <template>
    <div class="node-prop">
        <div class="title">单个节点属性</div>
        <div class="field">
            节点文本
            <input class="input" v-model="modelValue.title" />
        </div>
        <div class="field">
            字体大小
            <input class="input" type="number" v-model="modelValue.fontSize" />
        </div>
        <div class="field">
            字体加粗
            <input
                class="input"
                type="checkbox"
                v-model="modelValue.fontWeightBold"
            />
        </div>
        <div class="field">
            节点图片
            <input type="file" accept="image/*" @change="handleImage" style="width: 180px;" />
        </div>
        <div class="field">
            节点宽度
            <input class="input" type="number" v-model="modelValue.width" />
        </div>
        <div class="field">
            节点高度
            <input class="input" type="number" v-model="modelValue.height" />
        </div>
        <div class="field">
            节点位置X
            <input class="input" type="number" v-model="modelValue.x" />
        </div>
        <div class="field">
            节点位置Y
            <input class="input" type="number" v-model="modelValue.y" />
        </div>
        <div class="field">
            节点内边距
            <input
                class="input"
                type="number"
                v-model="modelValue.nodePadding"
            />
        </div>
        <div class="field">
            节点层级
            <input class="input" type="number" v-model="modelValue.zIndex" />
        </div>
        <div class="field">
            是否有边框
            <input
                class="input"
                type="checkbox"
                v-model="modelValue.isBorder"
            />
        </div>
        <div class="field">
            边框宽度
            <input
                class="input"
                type="number"
                v-model="modelValue.borderWidth"
            />
        </div>
        <div class="field">
            边框颜色
            <input class="input" v-model="modelValue.borderColor" />
        </div>
    </div>
</template>
<script setup>
import { ref, defineProps, watch } from "vue";
const props = defineProps({
    modelValue: Object,
});
const handleImage = (event) => {
    const file = event.target.files[0];
    if(!file)return
    const reader = new FileReader();
    reader.onload = function () {
        const base64String = reader.result;
        console.log(base64String);
        props.modelValue.pic = base64String
    };
    reader.readAsDataURL(file);
};
</script>

<style scoped lang="less">
.node-prop {
    padding: 10px 0 50px 10px;
    height: 100%;
    overflow: auto;
    .title {
        color: green;
        font-size: 18px;
        font-weight: bold;
    }
    .field {
        font-size: 14px;
        text-align: left;
        .input {
            height: 24px;
        }
    }
}
</style> -->
<template>
    <textProp v-if="modelValue.type === 'text'" v-model="modelValue"></textProp>
    <lineVProp v-if="modelValue.type === 'lineV'" v-model="modelValue"></lineVProp>
    <lineHProp v-if="modelValue.type === 'lineH'" v-model="modelValue"></lineHProp>
    <imageProp v-if="modelValue.type === 'image'" v-model="modelValue"></imageProp>
    <rectProp v-if="modelValue.type === 'rect'" v-model="modelValue"></rectProp>
    <cricleProp v-if="modelValue.type === 'cricle'" v-model="modelValue"></cricleProp>
    <QRCodeProp v-if="modelValue.type === 'QRCode'" v-model="modelValue"></QRCodeProp>
    <BarCode v-if="modelValue.type === 'BarCode'" v-model="modelValue"></BarCode>
</template>
<script setup>
import { defineProps } from 'vue';
import textProp from './textProp.vue';
import lineVProp from './lineVProp.vue'
import lineHProp from './lineHProp.vue'
import imageProp from './imageProp.vue'
import rectProp from './rectProp.vue';
import cricleProp from './cricleProp.vue';
import QRCodeProp from './QRCodeProp.vue';
import BarCode from './BarCode.vue';
const props = defineProps({
    modelValue:Object
})

</script>
