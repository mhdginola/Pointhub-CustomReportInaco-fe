<script setup lang="ts">
import { VDatatable } from '@/components';
import { customers } from '@/data/index';

const columns = [
    {name: 'productCode', label: 'Product Code', func: (d: any) => d.item?.code || '-'},
    {name: 'name', label: 'Name', func: (d: any) => d.item?.name || '-'},
    {name: 'subTotalPerPrinciple', label: 'Sub Total Per Principle', func: (d: any) => d.price || 0, type: 'number'},
    {name: 'invoiceNumber', label: 'Invoice'},
    {name: 'date', label: 'Invoice Date'},
    {name: 'description', label: 'Description'},
    {name: 'dpp', label: 'DPP'},
    {name: 'tax', label: 'PPN', type: 'number'},
    {name: 'quantity', label: 'Quantity', type: 'number'},
    {name: 'total', label: 'Total Invoice', type: 'number'},
    {name: 'payment', label: 'Payment', func: (d: any) => d.payment?.paid ?? 0, type: 'number'},
    // {name: 'debitMemo', label: 'Debit Memo'},
    // {name: 'cn', label: 'CN'},
    {name: 'remaining', label: 'Remaining', type: 'number'},
];

const filterFields = [
    {
        label: 'Date From',
        name: 'dateFrom',
        type: 'date',
        component: 'input',
        options: { date: true, delimiter: '-', datePattern: ['Y', 'm', 'd'] },
        placeholder: 'YYYY-MM-DD',
        defaultValue: '2023-05-01',
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
        options: customers,
        placeholder: 'Choose One',
    },
]

const templateData =  [
    { id: 1, productCode: 'wr1', invoiceNumber:'NB001', invoiceDate: '2023-01-01', customerWarehouse:'PO-001', customer: 'supplier1', name: '2023-01-01', invoiceAmount: 'NSJ-001', payment: 'nacme1', remaining: '1000' },
    { id: 2, productCode: 'wr2', invoiceNumber:'NB002', invoiceDate: '2022-01-01', customerWarehouse:'PO-002', customer: 'supplier2', name: '2022-01-01', invoiceAmount: 'NSJ-002', payment: 'nacme2', remaining: '2000' },
    { id: 3, productCode: 'wr3', invoiceNumber:'NB003', invoiceDate: '2022-06-01', customerWarehouse:'PO-003', customer: 'supplier3', name: '2022-06-01', invoiceAmount: 'NSJ-003', payment: 'nacme3', remaining: '3000' },
]
</script>
<template>
    <VDatatable 
        :filters="filterFields"
        :columns="columns"
        url="receivables"
        :template-data="templateData"
        custom-route="debts-aging-reports"
    />
</template>