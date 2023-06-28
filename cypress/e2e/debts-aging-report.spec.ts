describe('debts aging report',() => {
  describe('user not login', () => {
    beforeEach(() => {
      cy.visit('/debts-aging-report')
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
      cy.visit('/debts-aging-report')
    })

    it('show page debts aging report', () => {
      cy.contains('th','Product Code')
      cy.contains('th','Name')
      cy.contains('th','Date Invoice')
      cy.contains('th','Sub Toral Per Principle')
      cy.contains('th','Invoice')
      cy.contains('th','Invoice Date')
      cy.contains('th','Description')
      cy.contains('th','DPP')
      cy.contains('th','PPN')
      cy.contains('th','Total Invoice')
      cy.contains('th','Payment')
      cy.contains('th','Debit Memo')
      cy.contains('th','CN')
      cy.contains('th','Remaining')
    })
    it('show page debt aging report, with filter', () => {
      const dateInvoice = '2022-01-01'
      const customer = 'PT ABC'
      cy.intercept('GET', `/api/v1/debtAgingReport?filter[date]=${dateInvoice}&filter[customer]=${customer}`, {
        status: 200,
        body: [
          { id: 1, dateInvoice: dateInvoice, customer: customer },
          { id: 2, dateInvoice: dateInvoice, customer: customer },
          { id: 2, dateInvoice: dateInvoice, customer: customer },
        ]
      }).as('getData');
      cy.get('input[name="date"]').type(dateInvoice)
      cy.get('select[name="customer"]').select(customer)
      cy.get('button#filter').click()
      cy.wait('@getData')
      cy.get('td#dateInvoice').each(($td) => {
        expect(new Date($td.text())).to.equal(new Date(dateInvoice));
      })
      cy.get('td#dataCustomer').each(($td) => {
        expect($td.text()).to.equal(customer);
      })
    })
    it('show page debt aging report, with search', () => {
      const customerSearch = 'customer test';
      cy.intercept('GET', `/api/v1/debtAgingReport?search=${customerSearch}`, {
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
    it('download debts aging report', () => {
      cy.get('button.download-debts-aging-report').click()
      cy.get('.modal-download-debts-aging-report-progress').should('be.visible')
      cy.contains('Downloading... please wait')
    })
    it('print debts aging report', () => {
      cy.get('button.print-debts-aging-report').click()
      cy.get('.modal-print-debts-aging-report-progress').should('be.visible')
      cy.contains('th','Product Code')
      cy.contains('th','Name')
      cy.contains('th','Date Invoice')
      cy.contains('th','Sub Toral Per Principle')
      cy.contains('th','Invoice')
      cy.contains('th','Invoice Date')
      cy.contains('th','Description')
      cy.contains('th','DPP')
      cy.contains('th','PPN')
      cy.contains('th','Total Invoice')
      cy.contains('th','Payment')
      cy.contains('th','Debit Memo')
      cy.contains('th','CN')
      cy.contains('th','Remaining')
    })
  })
})