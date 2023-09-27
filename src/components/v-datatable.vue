<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { BaseInputMask, BaseModal, VTable, VTableFilters } from '@/components';
import { client } from '@/config';
import { Datum } from './v-table.vue';

type Column = any | {
    name: string,
    label: string,
    hide?: boolean,
    func?: Function
}

const page = ref<any>(1);

const props = defineProps({
    filters: {
        type: Array<Object>,
        default: []
    }, 
    columns: {
        type: Array<Column>,
        default: []
    },
    url: {
        type: String,
        default: '',
    },
    templateData: {
        type: Array<Object>,
        default: [],
    },
    customRoute: String,
    defaultRowSpanFunc: {
        type: Function,
        default: () => 1,
    },
    subRowKey: {
        type: String,
        default: null
    }
});

const state = reactive<any>({
    filters: {},
    searchTerm: '',
    data: [],
    pagination: {
        page: 1,
        pageSize: 10,
        pageCount: 1,
        totalDocument: props.templateData.length,
    },
});

const atoms = reactive({
    isPrintModalOpen: false,
    isDownloadModalOpen: false,
});

const initDownload = function(){
    atoms.isDownloadModalOpen = true;
    setTimeout(()=>{
        atoms.isDownloadModalOpen = false;
    }, 3000);
}

const compareDate = function(date1: string, date2: string){
    let d1 = new Date(date1);
    let d2 = new Date(date2);

    return d1.getTime() >= d2.getTime();
}

const changePage = function({page: newPage}: any){
    page.value = newPage
    search();
}

const updateSearch = function(){
    // @ts-ignore
    state.data = props.templateData.filter((t: any) => {
        if(state.filters){
            // @ts-ignore Column dateFrom and dateTo
            if(state.filters.dateFrom){
                let date = t.dateInvoice || t.invoiceDate || t.createDate;
                if(date){
                    if(!compareDate(date, state.filters.dateFrom)){
                        return false;
                    }
                }
            }
            if(state.filters.dateTo){
                let date = t.dateInvoice || t.invoiceDate;
                if(date){
                    if(!compareDate(state.filters.dateTo, date)){
                        return false;
                    }
                }
            }
            if(state.filters.item){
                if(t.item){
                    if(state.filters.item.id &&t.item !== state.filters.item?.id){
                        return false;
                    }
                }
            }
            if(state.filters.customer){
                let c = t.name || t.customer;
                if(c){
                    if(state.filters.customer.id &&c !== state.filters.customer?.id){
                        return false;
                    }
                }
            }
            if(state.filters.warehouse){
                if(t.warehouse){
                    if(state.filters.warehouse.id && t.warehouse !== state.filters.warehouse?.id){
                        return false;
                    }
                }
            }
            if(state.filters.supplier){
                if(t.supplier){
                    if(t.supplier !== state.filters.supplier){
                        return false;
                    }
                }
            }
        }

        if(state.searchTerm){
            if(!Object.values(t).some((i) => `${i}`?.toLowerCase().includes(state.searchTerm.toLowerCase()))){
                return false;
            }
        }
        return true;
    });
    state.pagination.totalDocument = state.data.length;
}

const serializeFilter = function(filters: any){
    return Object.keys(filters).reduce((p: any, key: any) => {
        if(props.filters.some((f: any) => f.type === 'date' && key === f.name)){
            return {
                ...p,
                [key]: filters[key].split('-').reverse().join('-')
            }
        }
            
        return {
            ...p,
            [key]: typeof filters[key] === 'object'? filters[key].id: filters[key]
        }
    }, {});
}

const search = function(){
    // updateSearch();
    // console.log(serializeFilter(state.filters));
    client.search(props.url, {
        // filter: serializeFilter(state.filters),
        ...serializeFilter(state.filters),
        page: page.value,
        search: state.searchTerm
    }).then(function({data, pagination}: any){
        state.data = data;
        state.pagination = pagination;
    }).catch(e => {
        // updateSearch();
    });
}

const updateSearchTerm = function(event: any){
    state.searchTerm = event.target.value;
    search();
}

onMounted(() => {
    for(let filter of props.filters){
        // @ts-ignore
        if(!state.filters[filter.name]){
            // @ts-ignore
            state.filters[filter.name] = filter.defaultValue ?? '';
        }
    }
    // @ts-ignore
    // state.data = props.templateData;
    search();
});
</script>
<template>
    <div class="flex flex-col gap-2">
        <div class="flex flex-row justify-end">
            <div>
                <button
                    @click="atoms.isPrintModalOpen = true;"
                    class="btn-print btn-icon" :class="'print-' + customRoute">
                    <i class="i-ph-printer"></i>
                </button>
                <button @click="initDownload()" class="btn-download btn-icon" :class="'download-' + customRoute">
                    <i class="i-ph-download"></i>
                </button>
            </div>
        </div>
        <VTableFilters :fields="props.filters" v-model="state.filters" @submit="search"/>
        <div class="card card-template mt-2">
            <div class="card-header">
                <div class="w-full flex">
                    <div class="flex-grow">
                        <component
                            :is="BaseInputMask"
                            :model-value="state.searchTerm"
                            label="Search"
                            name="search"
                            @change="updateSearchTerm"
                            placeholder="input a search term"
                        ></component>
                    </div>
                    <button class="fixed w-2 h-2 z-[10000] top-0 left-0 opacity-0" id="search"></button>
                </div>
            </div>
        
            <VTable
                @change:page="changePage"
                :sub-row-key="props.subRowKey"
                :defaultRowSpanFunc="props.defaultRowSpanFunc"
                :rowNumber="true"
                :columns="props.columns"
                :data="state.data"
                :per-page="10"
                :total="state.pagination.totalDocument"
            />
        
        </div>
        <BaseModal
            :is-open="atoms.isDownloadModalOpen"
            size="sm"
        >
            <template #content>
                <div class="modal-download-progress max-h-90vh overflow-auto p-4" :class="'modal-download-' + customRoute + '-progress'">
                    <div class="space-y-8 mx-auto text-center">
                        <p>
                            Downloading... please wait
                        </p>
                    </div>
                </div>
            </template>
        </BaseModal>
        <BaseModal
            :is-open="atoms.isPrintModalOpen"
            size="full"
        >
            <template #content>
                <div class="modal-print-progress max-h-90vh overflow-auto p-4" :class="'modal-print-' + customRoute + '-progress'">
                    <h2 class="py-4 text-2xl font-bold">Lorem Ipsum</h2>
                    <div class="space-y-8">
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. A accusantium provident,
                        blanditiis quam pariatur repellat? Animi ducimus fugit, similique libero et rem,
                        quod repellat sunt itaque voluptas nihil saepe laboriosam?
                    </p>
                    <button class="btn btn-primary btn-block" @click="atoms.isPrintModalOpen = false">Close</button>
                    </div>
                </div>
            </template>
        </BaseModal>
    </div>
</template>