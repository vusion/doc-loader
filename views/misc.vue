<template>
<l-side-main>
    <u-sidebar slot="side" :class="$style.sidebar">
        <template v-for="group in groups">
            <template v-if="!group.name">
                <u-sidebar-item v-for="component in group.children" :key="component.name"
                                :href="component.href" :to="component.to ? component.to : '/misc/' + component.name" :target="component.target">
                    {{ component.alias }} <small>{{ component.name }}</small>
                </u-sidebar-item>
            </template>
            <u-sidebar-group v-else :key="group.name" :title="group.name">
                <u-sidebar-item v-for="component in group.children" :key="component.name"
                                :href="component.href" :to="component.to ? component.to : '/misc/' + component.name" :target="component.target">
                    {{ component.alias }} <small>{{ component.name }}</small>
                </u-sidebar-item>
            </u-sidebar-group>
        </template>
    </u-sidebar>
    <router-view></router-view>
</l-side-main>
</template>

<script>
export default {
    data() {
        return { groups: this.$docs.miscGroups };
    },
};
</script>

<style module>
.sidebar[class] {
    padding: 36px 0;
}

.alias {
    font-size: 90%;
}
</style>
