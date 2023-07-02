describe('sales report customer',() => {
  describe('user not login', () => {
    beforeEach(() => {
      cy.visit('/sales/customer-report')
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
      cy.visit('/sales/customer-report')
    })

    it('show page sales report customer', () => {
      cy.contains('th','No.')
      cy.contains('th','Invoice')
      cy.contains('th','Invoice Date')
      cy.contains('th','No. Faktur Pajak')
      cy.contains('th','Sold To')
      cy.contains('th','Salesman')
      cy.contains('th','KD Salesman')
      cy.contains('th','Name')
      cy.contains('th','DPP')
      cy.contains('th','PPN')
      cy.contains('th','Total')
    })
    it('show page sales report, with filter', () => {
      const dateFrom = '2022-01-01'
      const dateTo = '2023-01-01'
      const customer = 'PT ABC'
      cy.intercept('GET', `/api/v1/salesReportCustomer?filter[dateFrom]=${dateFrom}&filter[dateTo]=${dateTo}&filter[customer]=${customer}`, {
        status: 200,
        body: [
          { id: 1, dateInvoice: '2023-01-01', customer: customer },
          { id: 2, dateInvoice: '2022-01-01', customer: customer },
          { id: 2, dateInvoice: '2022-06-01', customer: customer },
        ]
      }).as('getData');
      cy.get('input[name="dateFrom"]').type(dateFrom)
      cy.get('input[name="dateTo"]').type(dateTo)
      cy.get('select[name="customer"]').select(customer)
      cy.get('button#filter').click()
      cy.wait('@getData')
      cy.get('td#dateInvoice').each(($td) => {
        expect(new Date($td.text())).to.be.gte(new Date(dateFrom));
        expect(new Date($td.text())).to.be.lte(new Date(dateTo));
      })
      cy.get('td#dataCustomer').each(($td) => {
        expect($td.text()).to.equal(customer);
      })
    })
    it('show page sales report, with search', () => {
      const customerSearch = 'customer test';
      cy.intercept('GET', `/api/v1/salesReportCustomer?search=${customerSearch}`, {
        status: 200,
        body: [
          { id: 1, customer: customerSearch },
          { id: 2, customer: customerSearch },
        ]
      }).as('getData');
      
      cy.get('input[name="search"]').type(customerSearch)
      cy.get('button#search').click()

      cy.wait('@getData')
      cy.get('td#dataCustomer').each(($td) => {
        expect($td.text()).to.contain(customerSearch);
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
    it('download sales report customer', () => {
      cy.get('button.download-sales-report-customer').click()
      cy.get('.modal-download-sales-report-customer-progress').should('be.visible')
      cy.contains('Downloading... please wait')
    })
    it('print sales report customer', () => {
      cy.get('button.print-sales-report-customer').click()
      cy.get('.modal-print-sales-report-customer-progress').should('be.visible')
      cy.contains('th','No.')
      cy.contains('th','Invoice')
      cy.contains('th','Invoice Date')
      cy.contains('th','No. Faktur Pajak')
      cy.contains('th','Sold To')
      cy.contains('th','Salesman')
      cy.contains('th','KD Salesman')
      cy.contains('th','Name')
      cy.contains('th','DPP')
      cy.contains('th','PPN')
      cy.contains('th','Total')
    })
  })
})