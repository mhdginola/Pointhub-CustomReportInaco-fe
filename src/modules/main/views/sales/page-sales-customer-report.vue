<script setup lang="ts">
import { BaseInputMask, BaseSelect, BaseSelectMask, BaseModal, VTableFilters } from '@/components';
import VTable from '@/components/v-table.vue';
import { reactive, ref } from 'vue';
import { customers } from '@/data/index';

const columns = [
    {name: 'number', label: 'No.'},
    {name: 'invoice', label: 'Invoice'},
    {name: 'dateInvoice', label: 'Invoice Date'},
    {name: 'noFakturPajak', label: 'No. Faktur Pajak'},
    {name: 'soldTo', label: 'Sold To'},
    {name: 'salesman', label: 'Salesman'},
    {name: 'kdSalesman', label: 'KD Salesman'},
    {name: 'dataCustomer', label: 'Name'},
    {name: 'dpp', label: 'DPP'},
    {name: 'ppn', label: 'PPN'},
    {name: 'total', label: 'Total'},
];

const data: Array<any> = [
    {
        id: 1,
        number: '212412',
        referenceNumber: '243242',
        dateInvoice: '2022-02-22',
        dataCustomer: 'PT ABC',
        total: 2354234
    },
    {
        id: 2,
        number: '212412',
        referenceNumber: '243242',
        dateInvoice: '2022-02-22',
        dataCustomer: 'PT ABC',
        total: 2354235
    }
];


const state = reactive({
    filters: {
        dateFrom: '',
        dateTo: '',
        customer: '',
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
        label: 'Customer',
        name: 'customer',
        component: 'select',
        options: customers,
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
                    class="print-sales-customer-report btn-icon">
                    <i class="i-ph-printer"></i>
                </button>
                <button @click="initDownload()" class="download-sales-customer-report btn-icon">
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
                <div class="modal-download-sales-customer-report-progress max-h-90vh overflow-auto p-4">
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
                <div class="modal-print-sales-customer-report-progress max-h-90vh overflow-auto p-4">
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