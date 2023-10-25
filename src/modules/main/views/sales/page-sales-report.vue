<script setup lang="ts">
import { VDatatable } from '@/components';
import { useSingularApi } from '@/config/connection';
import { ref, computed } from 'vue';

const warehouses = ref<any>([]);
const items = ref<any>([]);

useSingularApi('/sales/warehouse', warehouses);
useSingularApi('/sales/item?pageSize=100', items);

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
    {name: 'warehouse', label: 'Warehouse', func: (d: any) => d.warehouse.name},
    {name: 'invoiceNumber', label: 'Invoice Number'},
    {name: 'customerName', func: (d: any) => d.customer?.name, label: 'Customer'},
    {name: 'productCode', label: 'Product Code', subRow: true, subFunc: (d: any) => d.group, rowSpanFunc: (item: any, index: number) => getItemRowSpan(item, index)},
    {name: 'item', subRow: true, subFunc: (d: any) => d.code, label: 'Item', rowSpanFunc: () => 1},
    {name: 'description', subRow: true, subFunc: (d: any) => d.name, label: 'Description', rowSpanFunc: () => 1},
    {name: 'quantity', label: 'Total Invoiced', subRow: true, subFunc: (d: any) => d.quantity, type: 'number'},
    {name: 'uomQty', label: 'Uom Quantity', subRow: true, subFunc: (d: any) => d.unit},
    {name: 'pricePerQty', label: 'Price', type: 'number', subRow: true, subFunc: (d: any) => d.price},
    {name: 'totalBeforeDiscount', subRow: true, subFunc: (d: any) => d.subtotal, label: 'Total Before Discount', type: 'number'},
    {name: 'discount', label: 'Total Discount', type: 'number', subRow: true, subFunc: (d: any) => (d.discount ?? 0)},
    {name: 'totalAfterDiscount', subRow: true, subFunc: (d: any) => ((d.price  - (d.discount ?? 0)) * d.quantity), label: 'Total After Discount', type: 'number'},
    {name: 'totalPerPrincipal', subRow: true, subFunc: getItemTotalPerPrincipal, rowSpanFunc: (item: any, index: number) => getItemRowSpan(item, index), label: 'Total Per Principal', type: 'number'},
    {name: 'totalBeforeDiscountByInvoice', func: (d: any) => d.items?.reduce?.((p: number, c: any) => p + (c.price - (c.discount ?? 0)) * c.quantity, 0), label: 'Total Before Discount by Invoice', type: 'number'},
    {name: 'totalDiscountByInvoice', func: (d: any) => d.discount, label: 'Total Discount by Invoice', type: 'number'},
    {name: 'taxBase', label: 'Total After Discount by Invoice', type: 'number'},
    // {name: 'totalAfterDiscount', func: (d: any) => d.items?.reduce?.((p: number, c: any) => p + c.subtotal, 0),label: 'Total After Discount', type: 'number'},
    {name: 'tax', label: 'Total Tax', type: 'number'},
    {name: 'total', label: 'Total After Tax', type: 'number'},
];

const filterFields = computed(() => {
    return [
        {
            label: 'Date From',
            name: 'dateFrom',
            type: 'date',
            component: 'input',
            defaultValue: '01-05-2023',
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
            name: 'item_id',
            component: 'select',
            options: items.value.map((c: any) => ({id: c._id, label: c.code? c.code + ' (' + c.name?.trim() + ')': '-'})),
            placeholder: 'Choose One',
        },
        {
            label: 'Warehouse',
            name: 'warehouse_id',
            component: 'select',
            options: warehouses.value.map((c: any) => ({id: c._id, label: c.code? c.code + ' (' + c.name?.trim() + ')': '-'})),
            placeholder: 'Choose One',
        }
    ]
});

const templateData = [
    { id: 1, productCode:'NB001', warehouse: 'warehouse_test', description:'PO-001', principle: 'PT ABC', totalInvoiced: '2023-01-01', totalBeforeDiscount: 'NSJ-001', item: 'NFP-001', totalDiscount: '1000', totalAfterDiscount: '100', totalTax: '9000', totalAfterTax: '100',discount: '100' },
    { id: 2, productCode:'NB002', warehouse: 'warehouse_test2', description:'PO-002', principle: 'PT ABC', totalInvoiced: '2022-01-01', totalBeforeDiscount: 'NSJ-002', item: 'NFP-002', totalDiscount: '2000', totalAfterDiscount: '100', totalTax: '1900', totalAfterTax: '100',discount: '100' },
    { id: 3, productCode:'NB003', warehouse: 'warehouse_test', description:'PO-003', principle: 'PT CDE', totalInvoiced: '2022-06-01', totalBeforeDiscount: 'NSJ-003', item: 'NFP-003', totalDiscount: '3000', totalAfterDiscount: '100', totalTax: '2900', totalAfterTax: '100',discount: '100' },
]

</script>
<template>
    <VDatatable 
        :defaultRowSpanFunc="(data: any) => data?.items?.length ?? 1"
        :filters="filterFields"
        :columns="columns"
        :template-data="templateData"
        subRowKey="items"
        url="sales-recap-report"
        custom-route="sales-report"
    />
</template>