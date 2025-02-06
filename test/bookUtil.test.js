const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, server } = require('../index');
chai.use(chaiHttp);

let baseUrl;

describe('Book API', () => {
    before(async () => {
        const { address, port } = await server.address();
        baseUrl = `http://${address === '::' ? 'localhost' : address}:${port}`;
    });

    after(() => {
        return new Promise((resolve) => {
            server.close(() => resolve());
        });
    });

    let initialBookCount = 0;
    let newBookId;

    describe('GET /view-resources', () => {
        it('should return all books', (done) => {
            chai.request(baseUrl)
                .get('/view-resources')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('array');
                    initialBookCount = res.body.length;
                    done();
                });
        });
    });

    describe('POST /add-resource', () => {
        it('should return 400 for missing name', (done) => {
            const invalidPayload = {
                shelf_no: '111',
                category: 'Fiction',
                author: 'John'
            };

            chai.request(baseUrl)
                .post('/add-resource')
                .send(invalidPayload)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message').that.includes('Name');
                    done();
                });
        });

        it('should return 400 for invalid shelf number', (done) => {
            const invalidPayload = {
                name: 'Test Book',
                shelf_no: '', 
                category: 'Fiction',
                author: 'Invalid Author'
            };

            chai.request(baseUrl)
                .post('/add-resource')
                .send(invalidPayload)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message', 'Shelf number must be a valid number');
                    done();
                });
        });

        it('should return 400 for missing category', (done) => {
            const invalidPayload = {
                name: 'Test Book',
                shelf_no: '111',
                author: 'John'
            };

            chai.request(baseUrl)
                .post('/add-resource')
                .send(invalidPayload)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message').that.includes('Category');
                    done();
                });
        });

        it('should return 400 for missing author', (done) => {
            const invalidPayload = {
                name: 'Test Book',
                shelf_no: '111',
                category: 'Fiction'
            };

            chai.request(baseUrl)
                .post('/add-resource')
                .send(invalidPayload)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message').that.includes('Author');
                    done();
                });
        });

        it('should add a new book successfully', (done) => {
            const validPayload = {
                name: 'book111',
                shelf_no: '111',
                category: 'Fiction',
                author: 'John'
            };

            chai.request(baseUrl)
                .post('/add-resource')
                .send(validPayload)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.equal(initialBookCount + 1);

                    newBookId = res.body[res.body.length - 1].id;
                    done();
                });
        });

        it('should return 400 for duplicate book', (done) => {
            const duplicatePayload = {
                name: 'book111',
                shelf_no: '111',
                category: 'Fiction',
                author: 'John'
            };

            chai.request(baseUrl)
                .post('/add-resource')
                .send(duplicatePayload)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message').that.includes('already exists');
                    done();
                });
        });
    });
});