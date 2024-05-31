<template>
    <div class="container">
        <div class="top-content">
            <div class="btn" @click="downLoad">导出</div>
            <div class="btn uploadfile">
                导入<input type="file" @change="handleFileChange" />
            </div>
            <div class="btn" @click="clearDrawer">清空</div>
            <div class="fileName" contenteditable="true" ref="fileName"></div>
        </div>
        <div class="main-content">
            <div class="left-content">
                <preNodes @drageStart="drageStart"></preNodes>
            </div>
            <div class="drawer-content"  @click="canvasClick">
                <div class="drawer_container" ref="drwerConatiner" :style="drawerContainerStyle" >
                    <div class="drawer" :style="drawerStyle" style="position: relative; box-sizing: border-box" @click="clickDrawer" >
                        <div
                            class="drawerCanvas"
                            ref="drawerCanvasRef"
                            @dragover.prevent
                            @drop.prevent.stop="drop"
                            @mousemove.stop.prevent="canvasMouseMove"
                            @mouseup.stop.prevent="canvasMouseUp"
                            @click.stop.prevent="canvasClick"
                        >
                            <div
                                class="node text"
                                :ref="setRefs(node.nodeId)"
                                :class="{nodeFocus:focusId === node.nodeId ||groupNodeIds.includes(node.nodeId)}"
                                :id="node.nodeId"
                                v-for="node in showNodes"
                                :key="node.nodeId"
                                :style="showNodeStyle(node)"
                                @mousedown.stop="(e) => moveStart(e, node)"
                                @click.stop="(e) => nodeClick(e, node)"
                                style="position: absolute;display: flex;justify-content: center;align-items: center;box-sizing: border-box;"
                            >
                                <contentNodes :node="node" :focusId="focusId" :groupNodeIds="groupNodeIds"></contentNodes>

                                <div v-if="focusId === node.nodeId" class="node-delete" :class="[{'lineHDelete':node.type === 'lineH'}]" @click.stop.prevent="deleteNode(node)"></div>
                                <div v-if="focusId === node.nodeId" class="node-resize" :class="[{'lineHResize':node.type === 'lineH'}]" @mousedown.stop.prevent=" (e) => resizeMousedown(e, node)" ></div>
                            </div>
                            <div class="hengxian" v-if="drageType === 'moveStart' && absorbCoordinates.y !== undefined" :style="hengxianStyle"></div>
                            <div class="shuxian" v-if="drageType === 'moveStart' && absorbCoordinates.x !== undefined"  :style="shuxianStyle"></div>
                        </div>
                    </div>
                    <div style="display: none">;;;{{ allProps }};;;</div>
                </div>
            </div>
            <div class="rigt-content">
                <groupNodeProp v-if="groupNodeIds.length > 0" v-model="groupNodeProps" @fllowSet="fllowSet" />
                <nodeProp v-if="focusId" v-model="currentNode"></nodeProp>
                <drawerProp v-else style="flex: 1; overflow: auto" v-model="drawerProps"></drawerProp>
            </div>
        </div>
    </div>
</template>
<script setup>
import preNodes from "./pre-nodes.vue";
import drawerProp from "./drawerProp.vue";
import nodeProp from "./nodeProp.vue";
import groupNodeProp from "./groupNodeProp.vue";
import contentNodes from "./contentNodes.vue";
import { ref, onBeforeUnmount, watch, computed, onMounted } from "vue";
import {throttle} from './util.js'
import Decimal from "decimal.js"

// ------------------------------style---------------------------------------
// drawer style
const drawerProps = ref({
    drawerWidth: 500,
    drawerHeight: 300,
    drawerScale: 100,
    isBorder: true,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 0,
    drawerPadding: 0,
    drawerMargin: 0,
    drawerBgColor: "#fff",
    fileName:'',
});
const drawerContainerStyle = computed(() => {
    return {
        backgroundColor: drawerProps.value.drawerBgColor,
    };
});
const drawerStyle = computed(() => {
    return {
        width: drawerProps.value.drawerWidth + "px",
        height: drawerProps.value.drawerHeight + "px",
        transform: `scale(${drawerProps.value.drawerScale / 100})`,
        border: drawerProps.value.isBorder
            ? `${drawerProps.value.borderWidth}px solid ${drawerProps.value.borderColor}`
            : "none",
        borderRadius: `${drawerProps.value.borderRadius}px`,
        padding: `${drawerProps.value.drawerPadding}px`,
        margin: `${drawerProps.value.drawerMargin}px`,
    };
});
// node style
const nodeProps = {
    title: "文本",
    type:'text',
    fontSize: 16,
    fontWeightBold: false,
    width: 100,
    height: 35,
    x: 0,
    y: 0,
    zIndex: 0,
    isBorder: true,
    borderWidth: 1,
    borderColor: "#000",
    pic: "",
    nodePadding: 0,
    borderRadius:0,
    fontTextAlign:'center',
    fontLineHeight:'',
    bgColor:''
};
const textProp = {
    title: "文本",
    type:'text',
    isBorder: false,
}
const lineHProp = {
    title:'',
    type:'lineH',
    height: 0,
    zIndex:1,
    isBorder:false
}
const lineVProp = {
    title:'',
    type:'lineV',
    width: 0,
    height: 100,
    zIndex:1,
    isBorder:false
}
const imageProp = {
    title:'',
    type:'image',
    height: 100
}
const rectProp = {
    title:'',
    type:'rect',
    width: 100,
    height: 100,
    isBorder: true,
}
const cricleProp = {
    title:'',
    type:'cricle',
    width: 100,
    height: 100,
    zIndex:1,
    borderRadius:'100%'
}
const QRCodeProp = {
    title:'',
    type:'QRCode',
    width: 100,
    height: 100,
    nodePadding: 3,
}
const BarCodeProp = {
    title:'',
    type:'BarCode',
    width: 100,
    height: 50
}
const showNodeStyle = (node) => {
    return {
        top: `${node.y}px`,
        left: `${node.x}px`,
        fontSize: `${node.fontSize}px`,
        fontWeight: node.fontWeightBold ? "bold" : "",
        width: `${node.width}px`,
        height: `${node.height}px`,
        zIndex: `${node.zIndex}`,
        // border: node.isBorder
        //     ? `${node.borderWidth}px solid ${node.borderColor}`
        //     : "",
        // padding: `${node.nodePadding}px`,
        // borderRadius: `${node.borderRadius}`,
    };
};


// ---------------Adsorb line--------------------------
const hengxianStyle = computed(()=>{
    return {
        top:showNodes.value[focusId.value].y+'px',
        height:showNodes.value[focusId.value].height+'px'
    }
})
const shuxianStyle = computed(()=>{
    return {
        left:showNodes.value[focusId.value].x+'px',
        width:showNodes.value[focusId.value].width+'px'
    }
})

let adsorbObj = {}
const getAdsorbObj = (exceptNode={})=>{
    let coordinateH = {}//H horizontal
    let coordinateV = {}//V vertical
    for(let i in showNodes.value){
        if(i === exceptNode.nodeId)continue;
        const node = showNodes.value[i]
        if(coordinateH[node.x])coordinateH[node.x].push(i)
        else coordinateH[node.x] = [i]
        if(coordinateH[node.x+node.width])coordinateH[node.x+node.width].push(i)
        else coordinateH[node.x+node.width] = [i]

        if(coordinateV[node.y])coordinateV[node.y].push(i)
        else coordinateV[node.y] = [i]
       
        if(coordinateV[node.y+node.height])coordinateV[node.y+node.height].push(i)
        else coordinateV[node.y+node.height] = [i]
    
    }
    return {coordinateH,coordinateV}
}

// get compare nodes
const distance = 3
const absorbDefaultDis = ref(distance)
const getNodeDistance = (node)=>{
    if (drageType.value === "moveStart"&&!adsorbObj?.coordinateH)adsorbObj = getAdsorbObj(node)
    let absorbDis = {
        x1:undefined,
        x2:undefined,
        y1:undefined,
        y2:undefined,
        x1NodeId:undefined,
        x2NodeId:undefined,
        y1NodeId:undefined,
        y2NodeId:undefined,
        x:undefined,
        y:undefined,
        xNodeId:undefined,
        yNodeId:undefined,
    }
    const needCompareObj = {
        x1:node.x,
        x2:node.x+node.width,
        y1:node.y,
        y2:node.y+node.height,
        width:node.width,
        height:node.height
    }
    const tempCoordinateH = Object.keys(adsorbObj.coordinateH)
    if(tempCoordinateH&&tempCoordinateH.length>0){
        let fixX1 = tempCoordinateH.filter((item)=>Math.abs(item-needCompareObj.x1) <= absorbDefaultDis.value)
        if(fixX1&&fixX1.length>1)fixX1.sort((a,b)=>a-b)
        if(fixX1&&fixX1.length>0){
            absorbDis.x1 = fixX1[0] - needCompareObj.x1;
            absorbDis.x1NodeId = adsorbObj.coordinateH[fixX1[0]][0]
        }

        let fixX2 = tempCoordinateH.filter((item)=>Math.abs(item-needCompareObj.x2) <= absorbDefaultDis.value)
        if(fixX2&&fixX2.length>1)fixX2.sort((a,b)=>a-b)
        if(fixX2&&fixX2.length>0){
            absorbDis.x2 = fixX2[0] - needCompareObj.x2
            absorbDis.x2NodeId = adsorbObj.coordinateH[fixX2[0]][0]
        }
    }
    const tempCoordinateV = Object.keys(adsorbObj.coordinateV)
    if(tempCoordinateV&&tempCoordinateV.length>0){
        let fixY1 = tempCoordinateV.filter((item)=>Math.abs(item-needCompareObj.y1) <= absorbDefaultDis.value)
        if(fixY1&&fixY1.length>1)fixY1.sort((a,b)=>a-b)
        if(fixY1&&fixY1.length>0){
            absorbDis.y1 = fixY1[0] - needCompareObj.y1;
            absorbDis.y1NodeId = adsorbObj.coordinateV[fixY1[0]][0]
        }

        let fixY2 = tempCoordinateV.filter((item)=>Math.abs(item-needCompareObj.y2) <= absorbDefaultDis.value)
        if(fixY2&&fixY2.length>1)fixY2.sort((a,b)=>a-b)
        if(fixY2&&fixY2.length>0){
            absorbDis.y2 = fixY2[0] - needCompareObj.y2
            absorbDis.y2NodeId = adsorbObj.coordinateV[fixY2[0]][0]
        }
    }

    if((absorbDis.x1!==undefined && absorbDis.x2 !== undefined && Math.abs(absorbDis.x1) <= Math.abs(absorbDis.x2))
        ||(absorbDis.x1!==undefined && absorbDis.x2 === undefined)){
        absorbDis.x = absorbDis.x1
        absorbDis.xNodeId = absorbDis.x1NodeId
    }else if(absorbDis.x2 !== undefined){
        absorbDis.x = absorbDis.x2
        absorbDis.xNodeId = absorbDis.x2NodeId
    }

    if((absorbDis.y1!==undefined && absorbDis.y2 !== undefined && Math.abs(absorbDis.y1) <= Math.abs(absorbDis.y2))
        ||(absorbDis.y1!==undefined && absorbDis.y2 === undefined)){
        absorbDis.y = absorbDis.y1
        absorbDis.yNodeId = absorbDis.y1NodeId
    }else if(absorbDis.y2 !== undefined){
        absorbDis.y = absorbDis.y2
        absorbDis.yNodeId = absorbDis.y2NodeId
    }
    return absorbDis
}
const doAbsorb = ()=>{
        const absorbDis = getNodeDistance(currentNode.value)
        const nodeProp = showNodes.value[currentNode.value.nodeId]
        const newPos = {
            // x:undefined,
            // y:undefined,
        }
        if(absorbDis.x){
            const absorbNode = showNodes.value[absorbDis.xNodeId]
            const x1 = Math.abs(absorbNode.x - nodeProp.x) <= Math.abs(absorbDis.x);
            const x2 = Math.abs(absorbNode.x - (nodeProp.x + nodeProp.width)) <= Math.abs(absorbDis.x)
            const x3 = Math.abs(absorbNode.x + absorbNode.width - nodeProp.x) <= Math.abs(absorbDis.x)
            const x4 = Math.abs(absorbNode.x + absorbNode.width - (nodeProp.width + nodeProp.x)) <= Math.abs(absorbDis.x)
            if( x1 )newPos.x = absorbNode.x;
            if( x2 )newPos.x = absorbNode.x - nodeProp.width;
            if( x3 )newPos.x = absorbNode.x + absorbNode.width;
            if( x4 )newPos.x = absorbNode.x + absorbNode.width - nodeProp.width
        }
        if(absorbDis.y){
            const absorbNode = showNodes.value[absorbDis.yNodeId]
            const y1 = Math.abs(absorbNode.y - nodeProp.y) <= Math.abs(absorbDis.y);
            const y2 = Math.abs(absorbNode.y - (nodeProp.y + nodeProp.height)) <= Math.abs(absorbDis.y)
            const y3 = Math.abs(absorbNode.y + absorbNode.height - nodeProp.y) <= Math.abs(absorbDis.y)
            const y4 = Math.abs(absorbNode.y + absorbNode.height - (nodeProp.height + nodeProp.y)) <= Math.abs(absorbDis.y)
            if( y1 )newPos.y = absorbNode.y;
            if( y2 )newPos.y = absorbNode.y - nodeProp.height;
            if( y3 )newPos.y = absorbNode.y + absorbNode.height;
            if( y4 )newPos.y = absorbNode.y + absorbNode.height - nodeProp.height
        }
        return newPos
}

// 
// --------------node click----------------------
// focus
const focusId = ref();
const nodeFocus = (node) => {
    if (isCanGroup) {
        focusId.value = "";
        currentNode.value = {};
        return;
    }
    if(groupNodeIds.value?.length > 0 && groupNodeIds.value.indexOf(node.nodeId) > -1)return;
    groupNodeIds.value = [];
    groupNodeProps.value = {};
    focusId.value = node.nodeId;
    currentNode.value = showNodes.value[node.nodeId];
};

// click node
const nodeClick = (e, node) => {
    nodeMergeGroup(node);
    nodeFocus(node);
};

// ----------------------------drage event---------------------------

const drawerCanvasRef = ref(null);
const drawerCanvasPos = () => {
    const rect = drawerCanvasRef.value.getBoundingClientRect();
    return {
        x: rect.left,
        y: rect.top,
    };
};
let focusNodePos = {};
let currentNode = ref({});

// dragestart
let drageType = ref('');
const drageStart = ({ e, node, mousePos }) => {
    drageType.value = "drageStart";
    focusNodePos = mousePos;
    const nodeId = `text_${Math.random().toString(36).substr(2, 16)}`;
    const prop = JSON.parse(JSON.stringify(nodeProps));
    const difTypeProp = ()=>{
        let obj = {}
        switch(node.type){
            case 'text':
                obj = JSON.parse(JSON.stringify(textProp));
                break;
            case 'lineH':
                obj = JSON.parse(JSON.stringify(lineHProp));
                break;
            case 'linev':
                 obj = JSON.parse(JSON.stringify(lineVProp));
                break;
            case 'rect':
                 obj = JSON.parse(JSON.stringify(rectProp));
                break;
            case 'cricle':
                 obj = JSON.parse(JSON.stringify(cricleProp));
                break;
            case 'image':
                obj = JSON.parse(JSON.stringify(imageProp));
                break;
            case 'QRCode':
                obj = JSON.parse(JSON.stringify(QRCodeProp));
                break;
            case 'BarCode':
                obj = JSON.parse(JSON.stringify(BarCodeProp));
                break;
        }
        return obj;
    }
    currentNode.value = { ...prop,...difTypeProp(), nodeId };
};
// dragestart in drawer
const refs = ref({}); // setRefs
const setRefs = (id) => (el) => {
    refs.value[id] = el;
};
const moveStart = (e, node) => {
    drageType.value = "moveStart";
    focusId.value = node.nodeId;
    currentNode.value = showNodes.value[node.nodeId];
    const element = refs.value[node.nodeId];
    const rect = element.getBoundingClientRect();
    focusNodePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    };
};

// change pos
const absorbCoordinates = ref({})
const changePos = (e) => {
    let nodePos = {
        x: e.clientX - drawerCanvasPos().x - focusNodePos.x,
        y: e.clientY - drawerCanvasPos().y - focusNodePos.y,
    };
    if(nodePos.x < 0) nodePos.x = 0
    else if(nodePos.x + currentNode.value.width > drawerProps.value.drawerWidth) nodePos.x = drawerProps.value.drawerWidth - currentNode.value.width
    if(nodePos.y < 0) nodePos.y = 0
    else if(nodePos.y + currentNode.value.height > drawerProps.value.drawerHeight) nodePos.y = drawerProps.value.drawerHeight - currentNode.value.height
    let newPos = doAbsorb();
    if(newPos.x !== undefined)absorbCoordinates.value.x = newPos.x
    if(newPos.y !== undefined)absorbCoordinates.value.y = newPos.y
    if(Object.keys(absorbCoordinates.value).length > 0){
        if(Math.abs(absorbCoordinates.value.x - nodePos.x) <= distance ){
            nodePos.x = absorbCoordinates.value.x
        }else delete absorbCoordinates.value.x
        if(Math.abs(absorbCoordinates.value.y - nodePos.y) <= distance){
            nodePos.y = absorbCoordinates.value.y
        }else delete absorbCoordinates.value.y
    }
    const moveDis = {
        x: showNodes.value[currentNode.value.nodeId].x - nodePos.x,
        y: showNodes.value[currentNode.value.nodeId].y - nodePos.y,
    };
    showNodes.value[currentNode.value.nodeId].x = nodePos.x;
    showNodes.value[currentNode.value.nodeId].y = nodePos.y;
    newPos = {}
    return moveDis;
};
// dragover
const dragover = (e) => {
    if (!currentNode.value.nodeId || drageType.value === "drageStart") return;
    const moveDis = changePos(e);
    changeGroupPos(moveDis, currentNode.value);
};

// drop
const showNodes = ref({});
const drop = (e) => {
    let x = e.clientX - drawerCanvasPos().x - focusNodePos.x
    let y = e.clientY - drawerCanvasPos().y - focusNodePos.y
    currentNode.value.x = x < 0 ? 0 : x
    currentNode.value.y = y < 0 ? 0 : y
    showNodes.value[currentNode.value.nodeId] = {
        ...showNodes.value[currentNode.value.nodeId],
        ...JSON.parse(JSON.stringify(currentNode.value)),
    };
    nodeFocus(currentNode.value);
    drageType.value = "";
};

// --------------------------node resize ---------------------------

let resizeCurrentMousePos = {
    x: 0,
    y: 0,
};
const resizeMousedown = (e, node) => {
    drageType.value = "resizeStart";
    currentNode.value = showNodes.value[node.nodeId];
    resizeCurrentMousePos = {
        x: e.clientX,
        y: e.clientY,
    };
};
const canvasMouseMove = (e) => {
    if (drageType.value === "moveStart"){
        dragover(e)
    }
    if (drageType.value != "resizeStart") return;
    let resizeSize = {
        x: e.clientX - resizeCurrentMousePos.x,
        y: e.clientY - resizeCurrentMousePos.y,
    };
    resizeCurrentMousePos = {
        x: e.clientX,
        y: e.clientY,
    };
    const nodeSize = {
        width:showNodes.value[currentNode.value.nodeId].width + resizeSize.x,
        height:showNodes.value[currentNode.value.nodeId].height + resizeSize.y,
    };
    if(currentNode.value.type === 'lineH') nodeSize.height = 0
    if(currentNode.value.type === 'lineV') nodeSize.width = 0
    showNodes.value[currentNode.value.nodeId].width = nodeSize.width < 0 ? 0 : nodeSize.width;
    showNodes.value[currentNode.value.nodeId].height = nodeSize.height < 0 ? 0 : nodeSize.height;
};
const canvasMouseUp = (e) => {
    drageType.value = "";
    adsorbObj = {}//不可动
};
const canvasClick = (e) => {
    groupNodeIds.value = [];
    groupNodeProps.value = {};
    focusId.value = "";
    currentNode.value = {};
};

// delete node
const deleteNode = (node) => {
    delete showNodes.value[node.nodeId];
};
const clickDrawer = () => {
    // focusId.value = ''
    // currentNode.value = {}
};
// -----------node group------------------
let groupNodeIds = ref([]);
const groupNodeProps = ref({
    fontSize: "",
    width: "",
    height: "",
    zIndex: "",
    isBorder: "",
    borderWidth: "",
    borderColor: "",
    nodePadding: "",
    // moveX:0,
    // moveY:0
});
const nodeMergeGroup = (node) => {
    if (!isCanGroup) return;

    // if(focusId.value&&Object.keys(currentNode.value).length>0){
    //     groupNodeIds.value.push(focusId.value)
    // }

    focusId.value = "";
    currentNode.value = {};

    const index = groupNodeIds.value.indexOf(node.nodeId);
    if (index > -1) groupNodeIds.value.splice(index, 1);
    else groupNodeIds.value.push(node.nodeId);
};
watch(
    groupNodeProps,
    () => {
        for (let i in showNodes.value) {
            if (groupNodeIds.value.indexOf(i) > -1) {
                showNodes.value[i] = {
                    ...showNodes.value[i],
                    ...groupNodeProps.value,
                };
            }
        }
    },
    { deep: true }
);

const changeGroupPos = (moveDis, exceptNode = {}) => {
    if (groupNodeIds.value?.length === 0) return;
    for (let i in showNodes.value) {
        if (groupNodeIds.value.indexOf(i) === -1) continue;
        if (i === exceptNode.nodeId) continue;
        showNodes.value[i].x = showNodes.value[i].x - moveDis.x;
        showNodes.value[i].y = showNodes.value[i].y - moveDis.y;
    }
};

const fllowSet = (type) => {
    const nodeArr = [];
    for (let i in showNodes.value) {
        if (groupNodeIds.value.indexOf(i) > -1) {
            nodeArr.push(showNodes.value[i]);
        }
    }
    if (type === "column") nodeArr.sort((a, b) => a.y - b.y);
    if (type === "row") nodeArr.sort((a, b) => a.x - b.x);
    let tempNode = null;
    nodeArr.forEach((item) => {
        if (!tempNode) {
            tempNode = item;
            return;
        }
        if (type === "column")
            showNodes.value[item.nodeId].y = tempNode.y + tempNode.height;
        if (type === "row")
            showNodes.value[item.nodeId].x = tempNode.x + tempNode.width;
        tempNode = item;
    });
};

// -----------keyboard------------------
let isCanGroup = false;
const keyDown = (e) => {
    if(e.ctrlKey && e.key === 'z'){
        rollBack()
        return;
    }
    switch (e.key) {
        case "Shift":
            isCanGroup = true;
            break;
    }
    const changePosStep = (nodeId) => {
        let x = showNodes.value[nodeId].x;
        let y = showNodes.value[nodeId].y;
        switch (e.key) {
            case "ArrowUp":
                y = y - 1;
                break;
            case "ArrowDown":
                y = y + 1;
                break;
            case "ArrowLeft":
                x = x - 1;
                break;
            case "ArrowRight":
                x = x + 1;
                break;
        }
        showNodes.value[nodeId].x = x;
        showNodes.value[nodeId].y = y;
    };
    if (groupNodeIds.value?.length > 0){
        groupNodeIds.value.forEach((nodeId) => changePosStep(nodeId));
        return;
    }
    if (focusId.value) changePosStep(focusId.value);
    
};
const keyUp = (e) => {
    switch (e.key) {
        case "Shift":
            isCanGroup = false;
            break;
    }
};
// add listener
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);
// remove listener
onBeforeUnmount(() => {
    window.removeEventListener("keydown", keyDown);
    window.removeEventListener("keyup", keyUp);
});
// ---------------------histroy---------------------------------
const historyList = ref([])
const isRolling = false;
watch(drawerProps,()=>{
    recordHistory()
})
const recordHistory = () => {
    const tempObj = JSON.parse(allProps.value)
    historyList.push(tempObj);
}
const rollBack = () => {
    if(!(historyList instanceof Array && history.length > 0))return;
    const lastData = historyList.pop()
    isRolling = true;
    drawerProps.value = lastData.drawerProps
    nodeProps.value = lastData.nodeProps
}

// --------------------allProps--------------------------------
const allProps = computed(() => {
    const obj = {
        drawerProps: drawerProps.value,
        nodeProps: showNodes.value,
    };
    return JSON.stringify(obj);
});

// ------------------import---------------------------
const handleFileChange = (event) => {
    const file = event.target.files[0];
    const name = file.name.split('.html')[0]
    fileName.value.innerText = name;
    const reader = new FileReader();
    reader.onload = function (event) {
        const str = event.target.result;
        const jsonStr = str.split(";;;")[1];
        const json = JSON.parse(jsonStr);
        drawerProps.value = json.drawerProps;
        showNodes.value = json.nodeProps;
    };
    reader.readAsText(file);
};

// ------------------ download-----------------------------
const drwerConatiner = ref(null);
const fileName = ref(null)
onMounted(()=>{
    fileName.value.innerText = 'drage label';

})
const downLoad = () => {
    const html = drwerConatiner.value.innerHTML;
    const name = fileName.value.innerText + '.html'
    downLoadHTML(html,name);
};
const downLoadHTML = (htmlStr,fileName) => {
    let html =
        "<!DOCTYPE html><html><head><title>Exported Page</title></head><body>" +
        htmlStr +
        "</body></html>";
    console.log(html);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "exported_page.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
// -------clear drawer-----------

const clearDrawer = () => {
    let confirm = window.confirm("确定要清空整个画布吗?清空后不可找回！")
    if(!confirm)return;
    drawerProps.value = {
        drawerWidth: 500,
        drawerHeight: 300,
        drawerScale: 100,
        isBorder: true,
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 0,
        drawerPadding: 0,
        drawerMargin: 0,
        drawerBgColor: "#fff",
    };
    showNodes.value = {};
}
</script>
<style scoped lang="less">
@color: green;
.container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .top-content {
        width: 100%;
        height: 50px;
        border-bottom: 1px solid #ccc;
        text-align: left;
        position: absolute;
        // padding-left: 200px;
        .btn {
            border: 1px solid;
            display: inline-block;
            padding: 5px 10px;
            margin: 5px;
            border-radius: 4px;
            cursor: pointer;
        }
        .fileName{
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            min-width: 100px;
            display: inline-block;
            border-bottom: 1px dashed @color;
            padding: 5px 10px;
            margin: 5px;
            text-align: center;
            &:focus{ outline: none; }
        }
        .uploadfile {
            position: relative;
            input {
                position: absolute;
                left: 0;
                opacity: 0;
                width: 100%;
            }
        }
    }
    .main-content {
        width: 100%;
        height: 100%;
        padding-top: 50px;
        display: flex;
        flex-direction: row;
        .left-content {
            height: 100%;
            width: 200px;
            border-right: 1px solid #ccc;
            display: flex;
            flex-direction: column;
        }
        .drawer-content {
            height: 100%;
            flex: 2;
            border-right: 1px solid #ccc;
            display: flex;
            justify-content: center;
            padding-top: 10px;
            background: url('../../public/wangge.png');
            background-color: #f2f2f2;
            overflow: auto;
            .drawer_container{
                height: fit-content; 
                box-sizing: border-box;
                .drawer {
                    min-width: 300px;
                    min-height: 200px;
                    width: 500px;
                    height: 300px;
                    position: relative;
                    box-sizing: border-box;
                    .drawerCanvas {
                        width: 100%;
                        height: 100%;
                        position: relative;
                        .hengxian{
                            width: 100%;
                            border-top: 1px dashed red;
                            border-bottom: 1px dashed red;
                            position: absolute;
                            z-index: -1;
                        }
                        .shuxian{
                            height: 100%;
                            border-left: 1px dashed red;
                            border-right: 1px dashed red;
                            position: absolute;
                            z-index: -1;
                        }
                    }
                }
            }
        }
        .rigt-content {
            height: 100%;
            width: 200px;
        }
    }
}

.node,
.text {
    width: 100px;
    height: 35px;
    cursor: move;
    .node-delete {
        position: absolute;
        top: 0;
        right: 0;
        width: 16px;
        height: 16px;
        cursor: pointer;
        &::before {
            position: absolute;
            content: " ";
            background-color: #000;
            left: 8px;
            width: 1px;
            height: 15px;
            transform: rotate(45deg);
        }
        &::after {
            position: absolute;
            content: " ";
            background-color: #000;
            left: 8px;
            width: 1px;
            height: 15px;
            transform: rotate(-45deg);
        }
    }
    .node-resize {
        width: 0px;
        height: 0px;
        border: 5px solid #000;
        border-left-color: transparent;
        border-top-color: transparent;
        position: absolute;
        bottom: 0;
        right: 0;
        cursor: se-resize;
    }
}
.nodeFocus {
    background-color: rgba(0, 255, 0, 0.3) !important;
}
</style>
