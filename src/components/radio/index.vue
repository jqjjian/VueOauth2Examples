<template>
    <div class="mint-radiolist" @change="$emit('change', currentValue)">
        <label class="mint-radiolist-title" v-text="title"></label>
        <x-cell v-for="option in options" :key="option.label">
            <label class="mint-radiolist-label" slot="title">
                <span :class="{'is-right': align === 'right'}" class="mint-radio">
                    <input class="mint-radio-input" type="radio" v-model="currentValue" :disabled="option.disabled" :value="option.value || option">
                    <span class="mint-radio-core"></span>
                </span>
                <i v-if="option.icon" :class="['fa', option.icon]"></i>
                <span class="mint-radio-label" v-text="option.label || option"></span>
            </label>
        </x-cell>
    </div>
</template>

<script>
import XCell from './cell'

/**
 * mt-radio
 * @module components/radio
 * @desc 单选框列表，依赖 cell 组件
 *
 * @param {string[], object[]} options - 选项数组，可以传入 [{label: 'label', value: 'value', disabled: true}] 或者 ['ab', 'cd', 'ef']
 * @param {string} value - 选中值
 * @param {string} title - 标题
 * @param {string} [align=left] - checkbox 对齐位置，`left`, `right`
 *
 * @example
 * <mt-radio v-model="value" :options="['a', 'b', 'c']"></mt-radio>
 */
export default {
    name: 'mt-radio',
    props: {
        title: String,
        align: String,
        options: {
            type: Array,
            required: true
        },
        value: String
    },
    data() {
        return {
            currentValue: this.value
        }
    },
    watch: {
        value(val) {
            this.currentValue = val
        },
        currentValue(val) {
            this.$emit('input', val)
        }
    },
    components: {
        XCell
    }
}
</script>

<style lang="css">
.fa {
    font-size: 22px;
    margin-left: 5px;
}
.fa-wxpay{
    color: green;
}
.fa-zhifubao {
    color:dodgerblue;
}
</style>
