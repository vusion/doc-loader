<template>
<s-materials-view type="misc" :groups="groups"></s-materials-view>
</template>

<script>
export default {
    data() {
        return { groups: this.$docs.miscGroups };
    },
};
</script>
