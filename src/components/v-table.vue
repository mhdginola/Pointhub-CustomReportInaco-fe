<script setup lang="ts">
import { computed, reactive } from 'vue';
import { BaseCheckbox } from '.';


export type Column = {
    name: string,
    label: string,
    func?: Function,
    hide?: boolean,
    type?: string,
    rowSpanFunc?: Function,
    subRow?: boolean
    subFunc?: Function
}

export type Datum = Object & {
    id: any,
    [key: string]: any,
};

type CurrentState = {
    selectedRows: Array<any>,
    currentPage: number,
    totalPages: number,
    totalData: number,
};

const emit = defineEmits(['change:page']);
const props = defineProps({
    columns: Array<Column>,
    selectable: {
        type: Boolean,
        default: false,
    },
    data: Array<Datum>,
    total: {
        type: Number,
        default: null,
    },
    perPage: {
        type: Number,
        default: 10,
    },
    rowNumber: {
        type: Boolean,
        default: false
    },
    isAjax: {
        type: Boolean,
        default: true
    },
    defaultRowSpanFunc: {
        type: Function,
        default: () => 1
    },
    subRowKey: {
        type: String,
        default: null
    }
})

const dataLength = computed(()=>{
    return props.total ?? props.data?.length;
});
const paginations = computed(() => {
  let items = [];
  let length = Math.ceil(dataLength.value / props.perPage);
  let currentPage = state.currentPage;
  
  const maxVisiblePages = 5; // Adjust this value to control how many pages are visible
  
  if (length <= maxVisiblePages) {
    // If there are fewer pages than the maximum visible pages, show all pages
    for (let i = 1; i <= length; i++) {
      items.push(i);
    }
  } else {
    // If there are more pages than the maximum visible pages, show a truncated pagination
    if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
      // Show the first (maxVisiblePages - 2) pages and add an ellipsis
      for (let i = 1; i <= maxVisiblePages - 2; i++) {
        items.push(i);
      }
      if(currentPage === 3 &&length > 5){
        items.splice(0, 1)
        items.push(4);
      }
      items.push("...");
      items.push(length);
    } else if (currentPage >= length - Math.floor(maxVisiblePages / 2)) {
      // Show the last (maxVisiblePages - 2) pages and add an ellipsis
      items.push(1);
      items.push("...");
      for (let i = length - maxVisiblePages + 3; i <= length; i++) {
        items.push(i);
      }
    } else {
      // Show pages around the current page with ellipses on both sides
      items.push(1);
      items.push("...");
      for (let i = currentPage - Math.floor(maxVisiblePages / 2) + 1; i <= currentPage + Math.floor(maxVisiblePages / 2) - 1; i++) {
        items.push(i);
      }
      items.push("...");
      items.push(length);
    }
  }

  return items;
});

const state = reactive<CurrentState>({
    selectedRows: [],
    currentPage: 1,
    totalPages: 3,
    totalData: 30,
});

const slicedData = computed(()=>{
    let curr = state.currentPage - 1;
    if(props.isAjax){
        return props.data;
    }
    return (props.data ?? []).slice(curr * props.perPage, (curr + 1) * props.perPage);
});

const showing = computed(() => {

    let start = (state.currentPage - 1) * props.perPage + 1;
    let end = (state.currentPage) * props.perPage;
    if(end > dataLength.value){
        end = dataLength.value;
    }
    if(start > dataLength.value){
        start = dataLength.value;
    }

    return {
        start: start,
        end: end,
        total: dataLength.value,
    } 
});

const gotoPage = function(page: Number|null = null, increment: Number|null = null){
    if(typeof page === 'number'){
        state.currentPage = page;
    } else if(typeof increment === 'number'){
        let target = state.currentPage + increment;
        if(target >= 1 && target <= paginations.value.length){
            state.currentPage = target;
        }
    }
    if(props.isAjax){
        emit('change:page', {
            page: page,
        });
    }
}

const selectRow = function(id: any){
    if(state.selectedRows.includes(id)){
        state.selectedRows.splice(state.selectedRows.indexOf(id), 1);
    } else {
        state.selectedRows.push(id);
    }
}

const toggleAllSelections = function(){
    if(state.selectedRows.length === dataLength.value){
        state.selectedRows = [];
    } else {
        state.selectedRows = props.data?.map(d => d.id) ?? [];
    }
}

const rowSpan = function(column: any, data: any = null){
    if(column === 'default'){
        return props.defaultRowSpanFunc?.(data) ?? 1;
    }
    if(column === 'index'){
        return props.defaultRowSpanFunc?.(data) ?? 1;
    }

    return column?.rowSpanFunc?.(data) ?? props.defaultRowSpanFunc?.(data) ?? 1;
}


// const extractRowSpanItems = function(index, column){
//     return slicedData[]
// }
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="table-container">
            <table id="datatable" class="table">
                <thead>
                    <tr class="basic-table-row bg-slate-100 dark:bg-slate-700">
                        <th v-if="selectable" class="basic-table-head text-center">
                            <BaseCheckbox theme="info" :model-value="state.selectedRows.length === dataLength" @click="toggleAllSelections" />
                        </th>
                        <th v-if="rowNumber" class="basic-table-head">No.</th>
                        <template v-for="column in columns" :key="column.name">
                            <th v-if="!column.hide" class="basic-table-head">
                                <div class="flex items-center justify-between">
                                    <p>{{ column.label }}</p>
                                </div>
                            </th>
                        </template>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(item, index) in slicedData" :key="item.id ?? index">
                        <tr class="basic-table-row">
                            <td v-if="selectable" :rowSpan="rowSpan('default', item)" class="basic-table-head text-center">
                            <BaseCheckbox theme="info" :model-value="state.selectedRows.includes(item.id)" @update:model-value="selectRow(item.id)" />
                        </td>
                        <td v-if="rowNumber" :rowSpan="rowSpan('index', item)" class="no basic-table-body">
                            {{ (index + 1) + ((state.currentPage - 1) * props.perPage) }}
                        </td>
                        <template v-for="column in columns" :key="column.name">
                            <td v-if="!column.hide" :rowSpan="rowSpan(column, item)" :class="'hidden ' + column.name">{{ item[column.name] ?? '-' }}</td>
                            <td v-if="!column.hide && !column.subRow" :rowSpan="rowSpan(column, item)" class="basic-table-body">        
                                <template v-if="column.type === 'number'">
                                    {{ Intl.NumberFormat('en-US', {
                                        
                                    }).format(Math.round(parseFloat(column.func? column.func(item): item[column.name] ?? 0) * 1000) / 1000) }}
                                </template>
                                <template v-else>
                                    {{ column.func? column.func(item): item[column.name] ?? '-'}}
                                </template>
                            </td>
                            <td v-if="!column.hide && column.subRow && ((column.rowSpanFunc?.(item, 0) ?? 1) !== 0)" :rowSpan="column.rowSpanFunc?.(item, 0) ?? 1" class="basic-table-body">
                                <template v-if="column.type === 'number'">
                                    {{ Intl.NumberFormat('en-US', {
                                        
                                    }).format(Math.round(parseFloat(column.subFunc? column.subFunc(item[props.subRowKey]?.[0], item, 0): item[column.name] ?? 0) * 1000) / 1000) }}
                                </template>
                                <template v-else>
                                    {{ column.subFunc? column.subFunc(item[props.subRowKey]?.[0], item): item[column.name] ?? '-'}}
                                </template>
                            </td>
                        </template>
                        </tr>
                        <template v-if="props.subRowKey">
                            <tr class="basic-table-row" v-for="(data, index) in item[props.subRowKey]?.slice(1)" :key="index">
                                <template v-for="column in columns" :key="column.name">
                                    <td v-if="!column.hide && column.subRow && ((column.rowSpanFunc?.(item, index + 1) ?? 1) !== 0)" :rowSpan="column.rowSpanFunc?.(item, index + 1) ?? 1" :class="'basic-table-body '">        
                                        <template v-if="column.type === 'number'">
                                            {{ Intl.NumberFormat('en-US', {
                                                
                                            }).format(Math.round(parseFloat(column.subFunc? column.subFunc(data, item, index + 1): data[column.name] ?? 0) * 1000) / 1000) }}
                                        </template>
                                        <template v-else>
                                            {{ column.subFunc? column.subFunc(data, item, index + 1): data[column.name] ?? '-'}}
                                        </template>
                                    </td>
                                </template>
                            </tr>
                        </template>
                    </template>
                </tbody>
            </table>
        </div>
        <div class="w-full flex flex-col items-center justify-between gap-y-4 md:flex-row">
            <div>
                <p class="text-sm text-slate-600 dark:text-slate-400">Showing {{showing.start}} to {{showing.end}} of {{showing.total}} entries</p>
            </div>
            <div class="btn-group">
                <button @click="gotoPage(1)" type="button" :disable="state.currentPage === 1? 'disabled': ''" class="btn btn-light-dark first-page-button">
                    <i class="i-ph-caret-double-left"></i>
                </button>
                <button @click="gotoPage(null, -1)" :disable="state.currentPage === 1? 'disabled': ''" type="button" class="btn btn-light-dark previous-page-button">
                    <i class="i-ph-caret-left"></i>
                </button>
                
                <button v-for="page in paginations" @click="typeof page === 'number'? gotoPage(page): ''" :key="page" type="button" class="page-number" :class="state.currentPage === page? ' active': ''">{{page}}</button>
                
                <button @click="gotoPage(null, 1)" :class="state.currentPage === paginations.length? 'disabled': ''" type="button" class="btn btn-light-dark next-page-button">
                    <i class="i-ph-caret-right"></i>
                </button>
                <button @click="gotoPage(paginations[paginations.length - 1] as number ?? 1)" :class="state.currentPage === paginations.length? 'disabled': ''" type="button" class="btn btn-light-dark last-page-button">
                    <i class="i-ph-caret-double-right"></i>
                </button>
            </div>
        </div>
    </div>
</template>