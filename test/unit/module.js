import { createTable, deleteTable } from '../../build/node/module';
import { dynamoDbClientFactory } from 'aws-client-factories';
import { stub } from 'sinon';

describe('dynamo-db-provisioner', () => {

    let dynamoDbClient;

    beforeEach(() => {
        dynamoDbClientFactory.create = stub();
        dynamoDbClient = { createTable: stub(), deleteTable: stub() };

        dynamoDbClientFactory.create.returns(dynamoDbClient);
    });

    describe('createTable()', () => {

        let attributeDefinitions;
        let keySchema;
        let tableName;

        beforeEach(() => {
            attributeDefinitions = 'fake attribute definitions';
            keySchema = 'a fake key schema';
            tableName = 'a fake table name';
        });

        describe('without globalSecondaryIndexes', () => {

            it('should call createTable() with the given parameters', () => {
                createTable({ attributeDefinitions, keySchema, tableName });

                expect(dynamoDbClient.createTable).to.have.been.calledOnce;
                expect(dynamoDbClient.createTable).to.have.been.calledWith({
                    AttributeDefinitions: attributeDefinitions,
                    KeySchema: keySchema,
                    ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
                    TableName: tableName
                });
            });

        });

        describe('with globalSecondaryIndexes', () => {

            let globalSecondaryIndexes;

            beforeEach(() => {
                globalSecondaryIndexes = [
                    { a: 'fake', global: 'secondary index' }
                ];
            });

            it('should call createTable() with the given parameters', () => {
                createTable({ attributeDefinitions, globalSecondaryIndexes, keySchema, tableName });

                expect(dynamoDbClient.createTable).to.have.been.calledOnce;
                expect(dynamoDbClient.createTable).to.have.been.calledWith({
                    AttributeDefinitions: attributeDefinitions,
                    GlobalSecondaryIndexes: [
                        {
                            ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
                            a: 'fake',
                            global: 'secondary index'
                        }
                    ],
                    KeySchema: keySchema,
                    ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
                    TableName: tableName
                });
            });

        });

        describe('with a successfully created table', () => {

            beforeEach(() => {
                dynamoDbClient.createTable.callsArgWith(1, null);
            });

            it('should return a resolving promise', () => {
                return createTable({ attributeDefinitions, keySchema, tableName });
            });

        });

        describe('with a unsuccessfully created table', () => {

            let error;

            beforeEach(() => {
                error = 'a fake error';

                dynamoDbClient.createTable.callsArgWith(1, error);
            });

            it('should return a rejecting promise', (done) => {
                createTable({ attributeDefinitions, keySchema, tableName })
                    .catch((err) => {
                        expect(err).to.equal(error);

                        done();
                    });
            });

        });

    });

    describe('deleteTable()', () => {

        let tableName;

        beforeEach(() => {
            tableName = 'a fake table name';
        });

        it('should call deleteTable() with the given tableName', () => {
            deleteTable(tableName);

            expect(dynamoDbClient.deleteTable).to.have.been.calledOnce;
            expect(dynamoDbClient.deleteTable).to.have.been.calledWith({
                TableName: tableName
            });
        });

        describe('with a successfully deleted table', () => {

            beforeEach(() => {
                dynamoDbClient.deleteTable.callsArgWith(1, null);
            });

            it('should return a resolving promise', () => {
                return deleteTable(tableName);
            });

        });

        describe('with a unsuccessfully deleted table', () => {

            let error;

            beforeEach(() => {
                error = 'a fake error';

                dynamoDbClient.deleteTable.callsArgWith(1, error);
            });

            it('should return a rejecting promise', (done) => {
                deleteTable(tableName)
                    .catch((err) => {
                        expect(err).to.equal(error);

                        done();
                    });
            });

        });

    });

});
