<template>
<div :class="$style.root">
    <the-header></the-header>
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
