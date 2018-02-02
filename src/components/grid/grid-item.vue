<template>
    <a href="javascript:;" class="mt-grid" @click="onClick" :style="style">
        <div class="mt-grid__icon" v-if="hasIconSlot || icon">
            <slot name="icon">
                <span v-html="icon"></span>
            </slot>
        </div>
        <p v-if="hasLabelSlot || label" class="mt-grid__label">
            <slot name="label">
                <span v-html="label"></span>
            </slot>
        </p>
        <slot></slot>
    </a>
</template>

<script>
import { go } from '@/util';
export default {
    name: 'grid-item',
    props: ['icon', 'label', 'link'],
    data () {
        return {
            hasIconSlot: false,
            hasLabelSlot: false
        };
    },
    computed: {
        style () {
            const column = this.$parent.column;
            if (!column || column === 3) {
                return;
            }
            const styles = {};
            styles.width = `${100 / column}%`;
            return styles;
        }
    },
    methods: {
        onClick () {
            this.$emit('on-item-click');
            go(this.link, this.$router);
        }
    },
    created () {
        this.$parent.countColumn();
    },
    mounted () {
        this.$slots.icon && (this.hasIconSlot = true);
        this.$slots.label && (this.hasLabelSlot = true);
    },
    destroyed () {
        this.$parent.countColumn();
    }
};
</script>

<style>

</style>
