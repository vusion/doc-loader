<script>
import SelectItem from './u-select-item.vue';

export default {
    name: 'u-theme-select-item',
    mixins: [SelectItem],
};
</script>

<style module>
@import './u-select-item.vue/module.css';

.root {
    line-height: 36px;
}
</style>
