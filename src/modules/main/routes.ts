export const routes = {
  path: '/',
  meta: {
    label: 'Menu',
  },
  component: () => import('@/layouts/app/app-index.vue'),
  children: [
    {
      path: '',
      meta: {
        label: 'Index',
      },
      component: () => import('./views/page-index.vue'),
    },
    {
      path: 'dashboard',
      component: () => import('./views/page-dashboard.vue'),
    },
    {
      path: 'page-1',
      component: () => import('./views/page-1.vue'),
    },
    {
      path: 'page-2',
      component: () => import('./views/page-2.vue'),
    },
    {
      path: 'nested',
      children: [
        {
          path: 'page-nested-1',
          component: () => import('./views/nested/page-nested-1.vue'),
        },
        {
          path: 'page-nested-2',
          component: () => import('./views/nested/page-nested-2.vue'),
        },
      ],
    },
    {
      path: 'sales',
      meta: {
        label: 'Sales',
      },
      children: [
        {
          path: 'report',
          meta: {
            label: 'Sales Report',
          },
          component: () => import('./views/sales/page-sales-report.vue'),
        },
        {
          path: 'customer-report',
          meta: {
            label: 'Sales Report per Customer',
          },
          component: () => import('./views/sales/page-sales-customer-report.vue'),
        },
      ],
    },
    {
      meta: {
        label: 'Purchase',
      },
      path: 'purchase',
      children: [
        {
          meta: {
            label: 'Purchase Report',
          },
          path: 'report',
          component: () => import('./views/purchase/page-purchase-report.vue'),
        },
        {
          meta: {
            label: 'Purchase Report Details',
          },
          path: 'report-details',
          component: () => import('./views/purchase/page-purchase-report-details.vue'),
        },
      ],
    },
    {
      meta: {
        label: 'Finance',
      },
      path: 'finance',
      children: [
        {
          meta: {
            label: 'Debts Aging Report',
          },
          path: 'debts-aging-report',
          component: () => import('./views/finance/page-debts-aging-report.vue'),
        },
        {
          meta: {
            label: 'Debts Aging Report per Customer',
          },
          path: 'debts-aging-customer-report',
          component: () => import('./views/finance/page-debts-aging-customer-report.vue'),
        },
      ],
    },
    {
      path: 'inventory',
      children: [
        {
          meta: {
            label: 'Inventory Report',
          },
          path: 'report',
          component: () => import('./views/inventory/page-inventory-report.vue'),
        },
      ],
    },
    {
      path: 'login',
      component: () => import('./views/page-login.vue'),
    },
  ],
};
