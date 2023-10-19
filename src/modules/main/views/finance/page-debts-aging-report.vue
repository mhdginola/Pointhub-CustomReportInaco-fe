<script setup lang="ts">
import { VDatatable } from '@/components';
import { useSingularApi } from '@/config/connection';
import { computed, ref } from 'vue';

const customers = ref<any>([]);

useSingularApi('/customer', customers);

const getItemGroup = function(item: any, index: number){
    return (item.items ?? []).filter((subData: any) => subData.group === (item.items ?? [])[index]?.group)
}
const getItemRowSpan = function(item: any, index: number){
    let actualIndex = (item.items ?? []).findIndex((f: any) => f?.group === (item.items)[index]?.group);
    const totalIndices = getItemGroup(item, index)?.length;
    return actualIndex === index? totalIndices: 0;
}

const getItemTotalPerPrincipal = function(item: any, actualItem: any, index: number){
    const itemGroup = getItemGroup(actualItem, index);
    return itemGroup.reduce((p: any, c: any) => p + ((c.price  - (c.discount ?? 0)) * c.quantity), 0)
}

const columns = [
    {name: 'productCode', label: 'Product Code', subRow: true, subFunc: (d: any) => d.group, rowSpanFunc: (item: any, index: number) => getItemRowSpan(item, index)},
    {name: 'item', subRow: true, subFunc: (d: any) => d.code, label: 'Name', rowSpanFunc: () => 1},
    {name: 'quantity', subRow: true, subFunc: (d: any) => d.quantity, label: 'Quantity', rowSpanFunc: () => 1},
    {name: 'totalPerPrincipal', subRow: true, subFunc: getItemTotalPerPrincipal, rowSpanFunc: (item: any, index: number) => getItemRowSpan(item, index), label: 'Sub Total Per Principal', type: 'number'},
    {name: 'invoiceNumber', label: 'Invoice'},
    {name: 'date', label: 'Invoice Date'},
    {name: 'notes', label: 'Description'},
    {name: 'dpp', label: 'DPP', func: (d: any) => d.price && d.quantity? d.price * d.quantity: d.taxBase, type: 'number'},
    {name: 'tax', label: 'PPN', type: 'number'},
    {name: 'total', label: 'Total Invoice', type: 'number'},
    {name: 'payment', label: 'Payment', func: (d: any) => d.payment?.paid ?? 0, type: 'number'},
    {name: 'debitMemo', label: 'Debit Memo', func: (d :any) => d.payment?.number},
    {name: 'creditNote', label: 'CN'},
    {name: 'remaining', label: 'Remaining', type: 'number'},
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
});

const templateData =  [
    { id: 1, productCode: 'wr1', invoiceNumber:'NB001', invoiceDate: '2023-01-01', customerWarehouse:'PO-001', customer: 'supplier1', name: '2023-01-01', invoiceAmount: 'NSJ-001', payment: 'nacme1', remaining: '1000' },
    { id: 2, productCode: 'wr2', invoiceNumber:'NB002', invoiceDate: '2022-01-01', customerWarehouse:'PO-002', customer: 'supplier2', name: '2022-01-01', invoiceAmount: 'NSJ-002', payment: 'nacme2', remaining: '2000' },
    { id: 3, productCode: 'wr3', invoiceNumber:'NB003', invoiceDate: '2022-06-01', customerWarehouse:'PO-003', customer: 'supplier3', name: '2022-06-01', invoiceAmount: 'NSJ-003', payment: 'nacme3', remaining: '3000' },
]
</script>
<template>
    <VDatatable 
        :defaultRowSpanFunc="(data: any) => data?.items?.length ?? 1"
        :filters="filterFields"
        :columns="columns"
        url="receivables"
        sub-row-key="items"
        :template-data="templateData"
        custom-route="debts-aging-reports"
    />
</template>