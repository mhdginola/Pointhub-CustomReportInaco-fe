<script setup lang="ts">
import { VDatatable } from '@/components';
import { useSingularApi } from '@/config/connection';
import { computed, ref } from 'vue';

const customers = ref<any>([]);
useSingularApi('/customer', customers);

const columns = [
    {name: 'customerID', label: 'Cust ID', func: (d: any) => d.customer?.code || '-'},
    {name: 'name', label: 'Name', func: (d: any) => d.customer?.name || '-'},
    {name: 'warehouse', label: 'Warehouse', func: (d: any) => d.warehouse.name},
    {name: 'invoiceNumber', label: 'Invoice'},
    {name: 'date', label: 'Invoice Date'},
    // {name: 'productCode', label: 'Product Code', func: (d: any) => d.item?.code || '-'},
    // {name: 'name', label: 'Name', func: (d: any) => d.item?.name || '-'},
    // {name: 'subTotalPerPrinciple', label: 'Sub Total Per Principle', func: (d: any) => d.price || 0, type: 'number'},
    {name: 'notes', label: 'Description'},
    {name: 'dpp', label: 'DPP', func: (d: any) => d.price && d.quantity? d.price * d.quantity: d.taxBase, type: 'number'},
    {name: 'tax', label: 'PPN', type: 'number'},
    // {name: 'quantity', label: 'Quantity', type: 'number'},
    {name: 'total', label: 'Total Invoice', type: 'number'},
    {name: 'payment', label: 'Payment', func: (d: any) => d.payment?.paid ?? 0, type: 'number'},
    {name: 'debitMemo', label: 'Debit Memo', func: (d :any) => d.payment?.number},
    {name: 'creditNote', label: 'CN'},
    {name: 'remaining', label: 'Remaining', type: 'number'},
    // {name: 'customerID', label: 'Cust ID'},
    // {name: 'name', label: 'Name'},
    // {name: 'invoice', label: 'Invoice'},
    // {name: 'invoiceDate', label: 'Invoice Date'},
    // {name: 'description', label: 'Description'},
    // {name: 'dpp', label: 'DPP'},
    // {name: 'ppn', label: 'PPN'},
    // {name: 'totalInvoice', label: 'Total Invoice'},
    // {name: 'payment', label: 'Payment'},
    // {name: 'cn', label: 'CN'},
    // {name: 'remaining', label: 'Remaining', type: 'number'},
];

const filterFields = computed(() => {
    return [
        {
            label: 'Date From',
            name: 'dateFrom',
            type: 'date',
            component: 'input',
            options: { date: true, delimiter: '-', datePattern: ['Y', 'm', 'd'] },
            placeholder: 'YYYY-MM-DD',
            defaultValue: '01-05-2023',
        },
        {
            label: 'Date To',
            name: 'dateTo',
            type: 'date',
            component: 'input',
            options: { date: true, delimiter: '-', datePattern: ['Y', 'm', 'd'] },
            placeholder: 'YYYY-MM-DD',
        },
        {
            label: 'Customer',
            name: 'customer_id',
            component: 'select',
            options: customers.value.map((c: any) => ({id: c._id, label: c.code + ' (' + c.name?.trim() + ')'})),
            placeholder: 'Choose One',
        },
    ]
})

const templateData = [
    { id: 1, customerID: 'wr1', name:'NB001', invoice: 'in1', invoiceDate: '2023-01-01', description:'PO-001', dpp: 'supplier1', ppn: '2023-01-01', totalInvoice: 'NSJ-001', payment: 'nacme1', debitMemo: '1000', cn: 'nacme1', remaining: '1000' },
    { id: 2, customerID: 'wr2', name:'NB002', invoice: 'in2', invoiceDate: '2022-01-01', description:'PO-002', dpp: 'supplier2', ppn: '2022-01-01', totalInvoice: 'NSJ-002', payment: 'nacme2', debitMemo: '2000', cn: 'nacme2', remaining: '2000' },
    { id: 3, customerID: 'wr3', name:'NB003', invoice: 'in3', invoiceDate: '2022-06-01', description:'PO-003', dpp: 'supplier3', ppn: '2022-06-01', totalInvoice: 'NSJ-003', payment: 'nacme3', debitMemo: '3000', cn: 'nacme3', remaining: '3000' },
];
</script>
<template>
    <VDatatable 
        :filters="filterFields"
        :columns="columns"
        url="receivables"
        custom-route="debts-aging-customer-report"
        :template-data="templateData"
    />
</template>