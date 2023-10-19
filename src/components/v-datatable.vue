<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { BaseInputMask, BaseModal, VTable, VTableFilters } from '@/components';
import { client } from '@/config';
import ExcelJS from 'exceljs';

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

const initDownload = async function(){
    atoms.isDownloadModalOpen = true;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(props.customRoute ?? 'Sheet 1');

    const documents = await searchAllPages();
    const columns = props.columns;
    const subRowKey = props.subRowKey;
    const defaultRowSpanFunc = (data: any) => props.defaultRowSpanFunc?.(data) ?? 1;
    
    const normalizedData = [];
    for(let doc of documents){
        let rawData = [];
        for(let col of columns){
            if(col.subRow){
                // rawData.push({
                //     value: col.func(doc),
                //     rowSpan: defaultRowSpanFunc(doc),
                // })
                rawData.push({
                    value: col.subFunc?.(doc[subRowKey]?.[0], doc, 0),
                    rowSpan: col.rowSpanFunc?.(doc, 0) ?? 1,
                    label: col.label,
                });
            } else {
                rawData.push({
                    value: col.func? (col.func(doc) ?? '-'): (doc[col.name] ?? '-'),
                    rowSpan: defaultRowSpanFunc(doc),
                    label: col.label,
                })
            }
        }
        normalizedData.push(rawData);
        
        for(let i = 1; i < doc[subRowKey]?.length ?? 0; i++){
            let item = doc[subRowKey][i];
            let delayedData = [];
            for(let col of columns){
                if(!col.subRow){
                    delayedData.push({
                        value: '',
                        rowSpan: 0,
                        label: col.label
                    });
                } else {
                    const span = col.rowSpanFunc?.(doc, i) ?? 1
                    const cell = col.subFunc(item, doc, i)
                    delayedData.push({
                        value: cell,
                        rowSpan: span,
                        label: col.label
                    })
                }
            }
            normalizedData.push(delayedData);
        }
    }

    worksheet.addRow(columns.map(c => c.label));
    normalizedData.forEach((rowData) => {
        worksheet.addRow(rowData.map(r => r.value));
    });
    
    worksheet.getRow(1).eachCell((cell) => {
       cell.font = { bold: true } 
       cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    normalizedData.forEach((rowData, i: number) => {
        const row = worksheet.getRow(i + 2);

        row.eachCell((cell, colNumber) => {
            if (rowData[colNumber - 1] && rowData[colNumber - 1].rowSpan > 1) {
                const rowspan = rowData[colNumber - 1].rowSpan;
                try {
                    worksheet.mergeCells(row.number, colNumber, row.number + rowspan - 1, colNumber);
                } catch (e){ /* empty */ }
            }
            
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
    });

    worksheet.columns.forEach(function (column) {
        let maxLength = 0;
        column?.["eachCell"]?.({ includeEmpty: true }, function (cell) {
            var columnLength = cell.value ? cell.value.toString().length * 1.6 : 10;
            if (columnLength > maxLength ) {
                maxLength = columnLength;
            }
        });
        column.width = maxLength < 10 ? 10 : maxLength;
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);

        // Create a link element and trigger the download
        const a = document.createElement('a');
        a.setAttribute('id', 'download-link');
        a.href = url;
        a.download = props.customRoute + '.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        atoms.isDownloadModalOpen = false;
        a.remove();
    });
}

const changePage = function({page: newPage}: any){
    page.value = newPage
    search();
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
        supplier: state.searchTerm,
        customer: state.searchTerm,
        search: state.searchTerm
    }).then(function({data, pagination}: any){
        state.data = data;
        state.pagination = pagination;
    }).catch(() => {
        // updateSearch();
    });
}

const searchAllPages = async function(){
    return (await client.search(props.url, {
        ...serializeFilter(state.filters),
        supplier: state.searchTerm,
        customer: state.searchTerm,
        search: state.searchTerm,
        pageSize: state.pagination.totalDocument,
    }) as any).data;
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

const printData = function(){
    const divToPrint = document.getElementById("datatable");
    const lastBreadCrumbs = Array.of(...(document.getElementsByClassName('breadcrumb-item')));
    // const showingText = document.getElementById("table_showing")?.textContent ?? '';
    const mywindow = window.open("", 'PRINT', 'height=400,width=600');
    if(divToPrint && mywindow){
        mywindow.document.write('<html><head><title>' + document.title  + '</title>');
        mywindow.document.write('<style>th, td {border: 1px solid black; padding-left: 8px; padding-right: 8px;} table {border-collapse: collapse;} .hidden {display: none}</style>');
        mywindow.document.write('</head><body>');
        mywindow.document.write('<h1>' + ((lastBreadCrumbs[lastBreadCrumbs.length - 1])?.textContent ?? '')  + '</h1>');
        // mywindow.document.write('<p>' + showingText  + '</p>');
        mywindow.document.write(divToPrint.outerHTML);
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/

        mywindow.print();
        // mywindow.close();
        // window.print();
    }    
}
</script>
<template>
    <div class="flex flex-col gap-2">
        <div class="flex flex-row justify-end">
            <div>
                <button
                    @click="printData"
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
                    <button class="fixed left-0 top-0 z-[10000] h-2 w-2 opacity-0" id="search"></button>
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
                    <div class="mx-auto text-center space-y-8">
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