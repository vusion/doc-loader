<template>
<div>
    <div :class="$style.side">
        <u-sidebar size="small">
            <u-sidebar-group v-for="group in groups" :key="group.name" :title="group.name">
                <u-sidebar-item v-for="component in group.children" :key="component.name" exact :to="'/components/'+component.name">
                    {{ component.alias }} <small>{{ component.CamelName }}</small>
                </u-sidebar-item>
            </u-sidebar-group>
        </u-sidebar>
    </div>
    <div :class="$style.main">
        <router-view></router-view>
    </div>
</div>
</template>

<script>
import groups from '../lib/auto-loader!./routes?components';
export default {
    data() {
        console.log(groups);
        return { groups };
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
