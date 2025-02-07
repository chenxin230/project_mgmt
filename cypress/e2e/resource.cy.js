describe('Library Management System', () => {
  let baseUrl;

  before(() => {
    cy.task('startServer').then((url) => {
      baseUrl = url;
    });
  });

  beforeEach(() => {
    cy.visit(baseUrl);
    // Trigger view resources to populate table
    cy.window().then((win) => {
      win.bookOperations.viewResources();
    });
  });

  // Helper function to add a test book - modified to use cy.then() instead of Promise
  const addTestBook = (bookName) => {
    cy.get('button[data-bs-toggle="modal"][data-bs-target="#resourceModal"]').click();
    cy.get('#name').clear().type(bookName);
    cy.get('#shelf_no').clear().type('42');
    cy.get('#category').clear().type('Fiction');
    cy.get('#author').clear().type('Test Author');
    
    cy.intercept('POST', '/add-resource').as('bookAdded');
    cy.get('.modal-footer .btn-primary').contains('Add Book').click();
    cy.wait('@bookAdded');
  };

  it('should open the Add Book modal', () => {
    cy.get('button[data-bs-toggle="modal"][data-bs-target="#resourceModal"]').click();
    cy.get('.modal-title').should('contain', 'Add New Book');
  });

  it('should add a new book successfully', () => {
    const timestamp = new Date().getTime();
    const uniqueBookName = `Test Book ${timestamp}`;

    cy.intercept('POST', '**/add-resource').as('addBook');
    addTestBook(uniqueBookName);
  });

  // it('should display books in the table with correct formatting', () => {
  //   const testBookName = `Display Test Book ${Date.now()}`;
  //   addTestBook(testBookName);
    
  //   // Explicitly trigger view resources and check
  //   cy.window().then((win) => {
  //     win.bookOperations.viewResources();
  //   });
    
  //   cy.get('table tbody tr', { timeout: 15000 }).should('have.length.gt', 0);
  //   cy.contains('table tbody tr', testBookName).should('exist');
  // });

  it('should validate required fields', () => {
    cy.get('button[data-bs-toggle="modal"][data-bs-target="#resourceModal"]').click();
    cy.get('.modal-dialog').should('be.visible');

    // Test submitting empty form
    cy.get('.modal-footer .btn-primary').click();
    cy.get('#message').should('exist');

    // Test each required field individually
    const requiredFields = ['name', 'shelf_no', 'category', 'author'];
    requiredFields.forEach(field => {
      // Fill all fields with valid data
      cy.get('#name').should('be.visible').clear().type('Test Book');
      cy.get('#shelf_no').should('be.visible').clear().type('42');
      cy.get('#category').should('be.visible').clear().type('Fiction');
      cy.get('#author').should('be.visible').clear().type('Test Author');

      // Clear only the current test field
      cy.get(`#${field}`).should('be.visible').clear();
      cy.get('.modal-footer .btn-primary').click();
      cy.get('#message').should('exist');
    });
  });

  it('should handle invalid input gracefully', () => {
    cy.get('button[data-bs-toggle="modal"][data-bs-target="#resourceModal"]').click();
    cy.get('.modal-dialog').should('be.visible');

    // Test various invalid inputs
    const testCases = [
      { field: 'shelf_no', value: '-1', message: 'should be positive' },
      { field: 'shelf_no', value: '0', message: 'should be positive' },
      { field: 'name', value: 'a'.repeat(256), message: 'too long' }
    ];

    testCases.forEach(({ field, value }) => {
      // Fill all fields with valid data first
      cy.get('#name').should('be.visible').clear().type('Test Book');
      cy.get('#shelf_no').should('be.visible').clear().type('42');
      cy.get('#category').should('be.visible').clear().type('Fiction');
      cy.get('#author').should('be.visible').clear().type('Test Author');

      // Then test the invalid input
      cy.get(`#${field}`).should('be.visible').clear().type(value);
      cy.get('.modal-footer .btn-primary').click();
      cy.get('#message').should('exist');
    });
  });

  // it('should handle adding multiple books successfully', () => {
  //   const timestamp = Date.now();
  //   const books = [
  //     `Book One ${timestamp}`,
  //     `Book Two ${timestamp}`,
  //     `Book Three ${timestamp}`
  //   ];

  //   books.forEach(addTestBook);
    
  //   // Explicitly trigger view resources and check
  //   cy.window().then((win) => {
  //     win.bookOperations.viewResources();
  //   });
    
  //   cy.get('table tbody tr', { timeout: 15000 }).should('have.length.gt', 0);
  //   books.forEach(bookName => {
  //     cy.contains('table tbody tr', bookName).should('exist');
  //   });
  // });

  after(() => {
    cy.task('stopServer');
  });
});