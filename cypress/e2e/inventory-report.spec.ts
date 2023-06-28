describe('inventory report',() => {
  describe('user not login', () => {
    beforeEach(() => {
      cy.visit('/inventory-report')
    })
    it('redirect to login page', () => {
      cy.location('pathname').should('eq', '/login')
    })
  })
  describe('user login', () => {
    beforeEach(() => {
      cy.visit('/login')
      cy.get('button.login-google').click()
      cy.visit('/')
      cy.visit('/inventory-report')
    })

    it('show page inventory report', () => {
      cy.contains('th','No.')
      cy.contains('th','Warehouse')
      cy.contains('th','Item')
      cy.contains('th','Description')
      cy.contains('th','Qty In Stock')
      cy.contains('th','Receipts Quantity')
      cy.contains('th','Issues Quantity')
      cy.contains('th','Unit Cost')
      cy.contains('th','Start Balance Cost')
      cy.contains('th','Receipts Amount')
      cy.contains('th','Issues Amount')
    })
    it('show page inventory report, with filter', () => {
      const dateFrom = '2022-01-01'
      const dateTo = '2023-01-01'
      const item = 'item test'
      const warehouse = 'warehouse test'
      cy.intercept('GET', `/api/v1/inventoryReport?filter[dateFrom]=${dateFrom}&filter[dateTo]=${dateTo}&filter[item]=${item}&filter[warehouse]=${warehouse}`, {
        status: 200,
        body: [
          { id: 1, dateInvoice: '2023-01-01', item: item, warehouse: warehouse },
          { id: 2, dateInvoice: '2022-01-01', item: item, warehouse: warehouse },
          { id: 2, dateInvoice: '2022-06-01', item: item, warehouse: warehouse },
        ]
      }).as('getData');
      cy.get('input[name="dateFrom"]').type(dateFrom)
      cy.get('input[name="dateTo"]').type(dateTo)
      cy.get('select[name="item"]').select(item)
      cy.get('select[name="warehouse"]').select(warehouse)
      cy.get('button#filter').click()
      cy.wait('@getData')
      cy.get('td#dateInvoice').each(($td) => {
        expect(new Date($td.text())).to.be.gte(new Date(dateFrom));
        expect(new Date($td.text())).to.be.lte(new Date(dateTo));
      })
      cy.get('td#dataItem').each(($td) => {
        expect($td.text()).to.equal(item);
      })
      cy.get('td#dataWarehouse').each(($td) => {
        expect($td.text()).to.equal(warehouse);
      })
    })
    it('show page inventory report, with search', () => {
      const itemSearch = 'item test';
      cy.intercept('GET', `/api/v1/inventoryReport?search=${itemSearch}`, {
        status: 200,
        body: [
          { id: 1, item: itemSearch },
          { id: 2, item: itemSearch },
        ]
      }).as('getData');
      
      cy.get('input[name="search"]').type(itemSearch)
      cy.get('button#search').click()

      cy.wait('@getData')
      cy.get('td#dataItem').each(($td) => {
        expect($td.text()).to.contain(itemSearch);
      })
    })
    it('should navigate through pages correctly', () => {
      // Click next page button
      cy.get('.next-page-button').click();
      // Assert that the next page is displayed
      cy.get('.page-number').should('contain', '2'); // Assuming there is a page number element
  
      // Click previous page button
      cy.get('.previous-page-button').click();
      // Assert that the previous page is displayed again
      cy.get('.page-number').should('contain', '1');

      cy.get('.last-page-button').click();
      cy.get('.page-number').should('contain', '10'); // Assuming there are 10 pages in total
      // Verify that the next page button is disabled
      cy.get('.next-page-button').should('be.disabled');

      // Go back to the first page
      cy.get('.first-page-button').click();
      cy.get('.page-number').should('contain', '1');    
      // Verify that the previous page button is disabled
      cy.get('.previous-page-button').should('be.disabled');
    });
    it('download inventory report', () => {
      cy.get('button.download-inventory-report').click()
      cy.get('.modal-download-inventory-report-progress').should('be.visible')
      cy.contains('Downloading... please wait')
    })
    it('print inventory report', () => {
      cy.get('button.print-inventory-report').click()
      cy.get('.modal-print-inventory-report-progress').should('be.visible')
      cy.contains('th','No.')
      cy.contains('th','Warehouse')
      cy.contains('th','Item')
      cy.contains('th','Description')
      cy.contains('th','Qty In Stock')
      cy.contains('th','Receipts Quantity')
      cy.contains('th','Issues Quantity')
      cy.contains('th','Unit Cost')
      cy.contains('th','Start Balance Cost')
      cy.contains('th','Receipts Amount')
      cy.contains('th','Issues Amount')
    })
  })
})