<script setup lang="ts">
import { VDatatable } from '@/components';
import { warehouses, items } from '@/data/index';

const columns = [
    {name: 'warehouse', label: 'Warehouse'},
    {name: 'item', func: (d: any) => d.items?.map?.((c: any) => c.code).join(', ') || '-',label: 'Item'},
    {name: 'description', func: (d: any) => d.items?.map?.((c: any) => c.name).join(', ') || '-', label: 'Description'},
    {name: 'invoiceNumber', label: 'Invoice Number'},
    {name: 'customerName', func: (d: any) => d.customer?.name, label: 'Customer'},
    {name: 'productCode', label: 'Product Code'},
    {name: 'uomQty', label: 'Uom Quantity'},
    {name: 'pricePerQty', label: 'Price Per Quantity', type: 'number'},
    {name: 'totalPerPrincipal', label: 'Total Per Principal', type: 'number'},
    {name: 'total', label: 'Total Invoiced', type: 'number'},
    {name: 'totalBeforeDiscount', func: (d: any) => d.items?.reduce?.((p: number, c: any) => p + c.price, 0), label: 'Total Before Discount', type: 'number'},
    {name: 'totalDiscount', func: (d: any) => d.items?.reduce?.((p: number, c: any) => p + c.discount, 0), label: 'Total Discount', type: 'number'},
    {name: 'totalAfterDiscount', func: (d: any) => d.items?.reduce?.((p: number, c: any) => p + c.subtotal, 0),label: 'Total After Discount', type: 'number'},
    {name: 'tax', label: 'Total Tax', type: 'number'},
    {name: 'taxBase', label: 'Total After Tax', type: 'number'},
];

const filterFields = [
    {
        label: 'Date From',
        name: 'dateFrom',
        type: 'date',
        component: 'input',
        defaultValue: '2023-05-01',
        options: { date: true, delimiter: '-', datePattern: ['Y', 'm', 'd'] },
        placeholder: 'YYYY-MM-DD',
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
        label: 'Item',
        name: 'item',
        component: 'select',
        options: items,
        placeholder: 'Choose One',
    },
    {
        label: 'Warehouse',
        name: 'warehouse',
        component: 'select',
        options: warehouses,
        placeholder: 'Choose One',
    }
]

const templateData = [
    { id: 1, productCode:'NB001', warehouse: 'warehouse_test', description:'PO-001', principle: 'PT ABC', totalInvoiced: '2023-01-01', totalBeforeDiscount: 'NSJ-001', item: 'NFP-001', totalDiscount: '1000', totalAfterDiscount: '100', totalTax: '9000', totalAfterTax: '100',discount: '100' },
    { id: 2, productCode:'NB002', warehouse: 'warehouse_test2', description:'PO-002', principle: 'PT ABC', totalInvoiced: '2022-01-01', totalBeforeDiscount: 'NSJ-002', item: 'NFP-002', totalDiscount: '2000', totalAfterDiscount: '100', totalTax: '1900', totalAfterTax: '100',discount: '100' },
    { id: 3, productCode:'NB003', warehouse: 'warehouse_test', description:'PO-003', principle: 'PT CDE', totalInvoiced: '2022-06-01', totalBeforeDiscount: 'NSJ-003', item: 'NFP-003', totalDiscount: '3000', totalAfterDiscount: '100', totalTax: '2900', totalAfterTax: '100',discount: '100' },
]

</script>
<template>
    <VDatatable 
        :filters="filterFields"
        :columns="columns"
        :template-data="templateData"
        url="sales-recap-report"
        custom-route="sales-report"
    />
</template>