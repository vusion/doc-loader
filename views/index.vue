<template>
<div :class="$style.root">
    <header :class="$style.head">
        <div :class="$style.wrap">
            <u-navbar slot="head">
                <u-logo slot="left"></u-logo>
                <u-navbar-item to="/components">组件</u-navbar-item>
                <!-- <u-theme-select slot="right" v-model="theme" @select="onSelectTheme">
                    <u-theme-select-item value="default"><div :class="$style.color"></div>Default</u-theme-select-item>
                    <u-theme-select-item value="dark"><div :class="$style.color" color="dark"></div>Dark</u-theme-select-item>
                    <u-theme-select-item value="seagreen"><div :class="$style.color" color="seagreen"></div>SeaGreen</u-theme-select-item>
                </u-theme-select> -->
            </u-navbar>
        </div>
    </header>
    <main :class="$style.body">
        <div :class="$style.wrap">
            <router-view></router-view>
        </div>
    </main>
    <!-- <footer :class="$style.foot">
        <div :class="$style.wrap">
            <slot name="foot"></slot>
        </div>
    </footer> -->
</div>
</template>

<script>
export default {
    data() {
        return {
            theme: window.theme,
        };
    },
    methods: {
        onSelectTheme($event) {
            if ($event.value !== window.theme) {
                localStorage.setItem('theme', $event.value);
                location.reload();
            }
        },
    },
};
</script>

<style module>
.head {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    height: 64px;
    background: #fff;
    box-shadow: 0 3px 4px rgba(0,0,0,0.1);
    z-index: 20;
}

.body {
    /* min-height: calc(100vh - 134px); */
    margin-top: 64px;
}

.foot {
    height: 70px;
    background: #34383b;
}

.wrap {
    width: 1180px;
    margin: 0 auto;
}

.foot {
    line-height: 70px;
    background: #34383b;
    text-align: center;
    font-size: 14px;
    color: gray;
}

.color {
    display: inline-block;
    width: 1em;
    height: 1em;
    background: #67aaf5;
    border: 1px solid white;
    vertical-align: -2px;
    margin-right: 6px;
}

.color[color="dark"] {
    background: #4a89e8;
}

.color[color="seagreen"] {
    background: #2cb78e;
}
</style>
