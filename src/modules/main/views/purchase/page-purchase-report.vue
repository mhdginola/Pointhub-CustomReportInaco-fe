<script setup lang="ts">
import { BaseInputMask, BaseSelect, BaseSelectMask, BaseModal, VTableFilters } from '@/components';
import VTable from '@/components/v-table.vue';
import { reactive, ref } from 'vue';
import { suppliers } from '@/data/index';

const columns = [
    {name: 'number', label: 'No'},
    {name: 'referenceNumber', label: 'No. Bukti'},
    {name: 'dateInvoice', label: 'Date Invoice'},
    {name: 'purchaseInvoice', label: 'Purchase Invoice'},
    {name: 'dataSupplier', label: 'Supplier'},
    {name: 'noInvoice', label: 'No. Faktur'},
    {name: 'no_surat_jalan', label: 'No. Surat Jalan'},
    {name: 'no_invoice_pajak', label: 'No. Faktur Pajak'},
    {name: 'dpp', label: 'DPP'},
    {name: 'ppn', label: 'PPN'},
    {name: 'total', label: 'Total'},
];

const data: Array<any> = [
    {
        id: 1,
        number: '212412',
        referenceNumber: '243242',
        dateInvoice: '2021-02-22',
        purchaseInvoice: 'INV_2023_02_22',
        total: 2354234
    },
    {
        id: 2,
        number: '212412',
        referenceNumber: '243242',
        dateInvoice: '2021-02-22',
        purchaseInvoice: 'INV_2023_02_22',
        total: 2354235
    }
];


const state = reactive({
    filters: {
        dateFrom: '',
        dateTo: '',
        supplier: '',
    },
    searchTerm: '',
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

const filterFields = [
    {
        label: 'Date From',
        name: 'dateFrom',
        type: 'date',
        component: 'input',
        options: { date: true, delimiter: '-', datePattern: ['d', 'm', 'Y'] },
        placeholder: 'DD-MM-YYYY',
    },
    {
        label: 'Date To',
        name: 'dateTo',
        type: 'date',
        component: 'input',
        options: { date: true, delimiter: '-', datePattern: ['d', 'm', 'Y'] },
        placeholder: 'DD-MM-YYYY',
    },
    {
        label: 'Supplier',
        name: 'supplier',
        component: 'select',
        options: suppliers,
        placeholder: 'Choose One',
    }
]

</script>
<template>
    <div class="flex flex-col gap-2">
        <div class="flex flex-row justify-end">
            <div>
                <button
                    @click="atoms.isPrintModalOpen = true;"
                    class="print-purchase-report btn-icon">
                    <i class="i-ph-printer"></i>
                </button>
                <button @click="initDownload()" class="download-purchase-report btn-icon">
                    <i class="i-ph-download"></i>
                </button>
            </div>
        </div>
        <VTableFilters :fields="filterFields" v-model="state.filters"/>
        <div class="card card-template mt-2">
            <div class="card-header">
                <div class="w-full flex">
                    <div class="flex-grow">
                        <component
                            :is="BaseInputMask"
                            v-model="state.searchTerm"
                            label="Search"
                            name="search"
                            placeholder="input a search term"
                        ></component>
                    </div>
                    <button id="search" class="btn-sm btn-primary h-fit mt-auto">Go</button>
                </div>
            </div>
        
            <VTable
                :selectable="true"
                :columns="columns"
                :data="data"
                :per-page="1"
            />
        
        </div>
        <BaseModal
            :is-open="atoms.isDownloadModalOpen"
            size="sm"
        >
            <template #content>
                <div class="modal-download-purchase-report-progress max-h-90vh overflow-auto p-4">
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
                <div class="modal-print-purchase-report-progress max-h-90vh overflow-auto p-4">
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