<template>
    <div class="nodes">
        <div
            class="node"
            :ref="setRefs(node.id)"
            v-for="node in nodeList"
            :key="node.id"
            draggable="true"
            @dragstart="(e) => drageStart(e, node)"
        >
            {{ node.showName }}
        </div>
    </div>
</template>
<script setup>
import { ref, defineEmits } from "vue";

const emit = defineEmits("drageStart");
const nodeList = ref([
    { id: "text",type: "text", showName: "文本" },
    { id: "lineH",type: "lineH", showName: "横线" },
    { id: "linev", type: "linev", showName: "竖线" },
    { id: "image",type: "image", showName: "图片" },
    { id: "rect",type: "rect", showName: "矩形" },
    { id: "cricle",type: "cricle", showName: "圆形" },
    { id: "QRCode",type: "QRCode", showName: "二维码" },
    { id: "BarCode",type: "BarCode", showName: "条形码" },
]);
const refs = ref({});
const setRefs = (id) => (el) => {
    refs.value[id] = el;
};

const drageStart = (e, node) => {
    const element = refs.value[node.id];
    const rect = element.getBoundingClientRect();
    const mousePos = {
        x: parseInt(e.clientX - rect.left),
        y: parseInt(e.clientY - rect.top),
    };
    emit("drageStart", { e, node, mousePos });
};
</script>

<style scoped lang="less">
.nodes {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-bottom: 1px solid #ccc;
    .node {
        width: 100px;
        height: 30px;
        border: 1px solid #bbb;
        line-height: 30px;
        background-color: white;
    }
}
</style>