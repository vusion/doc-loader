<template>
<div>
    <div :class="$style.side">
        <u-sidebar size="small">
            <u-sidebar-item exact v-for="component in components" :key="component.path" v-if="component.path" :to="'/components/'+component.path">
                <small>{{ component.meta.name }}</small>
            </u-sidebar-item>
        </u-sidebar>
    </div>
    <div :class="$style.main">
        <router-view></router-view>
    </div>
</div>
</template>

<script>
import routes from '../routes-loader!../entry/routes';
export default {
    data() {
        const components = routes[0].children[1].children;
        return { components };
    },
};
</script>

<style module>
.side {
    padding: 20px 0;
    position: fixed;
    width: 200px;
    top: 64px;
    bottom: 0;
    /* height: calc(100vh - 134px); */
    background: #f0f6fa;
    overflow: auto;
}

.main {
    margin-left: 200px;
    padding: 40px;
}
</style>
