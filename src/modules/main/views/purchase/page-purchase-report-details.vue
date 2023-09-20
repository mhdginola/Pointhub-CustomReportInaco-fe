<script setup lang="ts">
import { VDatatable } from '@/components';
import { suppliers, warehouses, items } from '@/data/index';

const columns = [
    {name: 'warehouse', label: 'Warehouse', func: (d: any) => d.warehouse?.code ?? '-'},
    {name: 'purchaseOrderNumber', label: 'Purchase Order Num', func: (d: any) => d.purchaseOrderNumber ?? '-'},
    {name: 'supplier', label: 'Vendor No.', func: (d: any) => d.supplier?.code},
    {name: 'supplierDescription', label: 'Vendor Name', func: (d: any) => d.supplier?.name},
    {name: 'date', label: 'Create Date'},
    {name: 'invoiceNumber', label: 'No. Invoice'},
    {name: 'item', label: 'Item', func: (d: any) => d.item.code},
    {name: 'itemDescription', label: 'Item Description', func: (d: any) => d.item.name},
    {name: 'quantity', label: 'Qty Voucher'},
    {name: 'price', label: 'Material Price'},
    {name: 'p', label: 'Material Price Conv', func: (d: any) => (parseFloat(d.price) * parseFloat(d.quantity)), type: 'number'},
    {name: 'discount', label: 'Discount', type: 'number', func:(d: any) =>  Math.round(parseFloat(d.discount) * 1000) / 1000},
    {name: 'afterDiscount', label: 'After Discount', type: 'number', func: (d: any) => d.total && d.tax? Math.round(parseFloat(d.total) - parseFloat(d.tax) * 1000) / 1000: 0},
    {name: 'tax', label: 'PPN', func:(d: any) =>  d.tax? Math.round(parseFloat(d.tax) * 1000) / 1000: 0},
    {name: 'total', label: 'Total', type: 'number', func:(d: any) =>  d.total? Math.round(parseFloat(d.total) * 1000) / 1000: 0},
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
        label: 'Supplier',
        name: 'supplier',
        component: 'select',
        options: suppliers,
        placeholder: 'Choose One',
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
    { id: 1, purchaseOrderNumber:'NB001', warehouse: 'warehouse_test', vendorNumber:'PO-001', vendorName: 'supplier1', createDate: '2023-01-01', noInvoice: 'NSJ-001', item: 'NFP-001', itemDescription: '1000', qtyVoucher: '100', materialPrice: '9000', materialPriceConversion: '100',discount: '100', afterDiscount: '100', ppn: '100', total: '100', },
    { id: 2, purchaseOrderNumber:'NB002', warehouse: 'warehouse_test2', vendorNumber:'PO-002', vendorName: 'supplier2', createDate: '2022-01-01', noInvoice: 'NSJ-002', item: 'NFP-002', itemDescription: '2000', qtyVoucher: '100', materialPrice: '1900', materialPriceConversion: '100',discount: '100', afterDiscount: '100', ppn: '100', total: '100', },
    { id: 3, purchaseOrderNumber:'NB003', warehouse: 'warehouse_test', vendorNumber:'PO-003', vendorName: 'supplier3', createDate: '2022-06-01', noInvoice: 'NSJ-003', item: 'NFP-003', itemDescription: '3000', qtyVoucher: '100', materialPrice: '2900', materialPriceConversion: '100',discount: '100', afterDiscount: '100', ppn: '100', total: '100', },
];

</script>
<template>
    <VDatatable 
        :filters="filterFields"
        :columns="columns"
        :template-data="templateData"
        custom-route="purchase-report-details"
        url="purchase-report"
    />
</template>