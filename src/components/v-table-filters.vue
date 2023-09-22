<script setup lang="ts">
import { computed, reactive } from 'vue';
import {BaseInputMask, BaseDatepicker, BaseAutocomplete} from './';

const props = defineProps({
    fields: Array<any>,
    modelValue: Object,
});
const getComponent = function(field: any){
    switch(field.component){
        case 'select': return BaseAutocomplete;
        case 'input': {
            if(field.options?.date){
                return BaseDatepicker
            }
            return BaseInputMask;
        };
    }
    return 'div';
}
const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void,
  (e: 'submit'): void,
}>()

const computedStates = computed<any>({
  set: (obj: any) => {
    emit('update:modelValue', obj)
  },
  get: () => props.modelValue
})

const bindField = function(field: any){
    if(field.component === 'select'){
        return {
            ...field,
            list: field.options
        }
    }
    return field;
}
</script>
<template>
    <div class="card card-template">
        <h3>Filters</h3>
        <div class="flex flex-col md:flex-row gap-4 md:items-end">
            <component v-model="computedStates[field.name]"
                v-for="field in fields"
                :key="field.name"
                :is="getComponent(field)"
                :name="field.name"
                :type="field.options?.date === true? 'date': field.type ?? 'text'"
                :label="field.label"
                v-bind="bindField(field)"
            />
            <button class="btn-sm btn-primary w-fit" id="filter" @click="$emit('submit')">Apply</button>
        </div>
    </div>
</template>