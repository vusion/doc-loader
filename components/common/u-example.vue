<template>
<div :class="$style.root">
    <div :class="$style.example"><slot></slot></div>
    <div :class="$style.code" v-show="expanded">
        <slot name="code"></slot>
    </div>
    <div :class="$style.expander" :expanded="expanded" @click="expanded = !expanded">{{ expanded ? '收起代码' : '显示代码' }}</div>
</div>
</template>

<script>
export default {
    name: 'u-example',
    data() {
        return {
            expanded: false,
        };
    },
};
</script>

<style module>
.root {
    border: 1px #eee solid;
}

.example {
    padding: 20px;
}

.code {
    border-top: 1px #eee solid;
}

.code pre {
    margin: -1px;
}

.code:empty {
    display: none;
}

.expander {
    border-top: 1px #eee solid;
    text-align: center;
    vertical-align: middle;
    padding: 5px;
    cursor: pointer;
}

.expander:hover {
    background: #f5f5f5;
}

.expander:before {
    content: '';
    display: inline-block;
    position: relative;
    border: 5px solid transparent;
    border-left-width: 4px;
    border-right-width: 4px;
    border-top-color: #bbb;
    bottom: -3px;
    right: 4px;
}

.expander[expanded]:before {
    border-top-color: transparent;
    border-bottom-color: #bbb;
    top: -3px;
    bottom: 0;
}
</style>
