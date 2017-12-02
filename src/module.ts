import { dynamoDbClientFactory } from 'aws-client-factories';
import { DynamoDB } from 'aws-sdk';
import { ITableDefinition } from './interfaces';

export const createTable = ({ attributeDefinitions, globalSecondaryIndexes, keySchema, tableName }: ITableDefinition): Promise<void> => {
    const dynamoDbClient = dynamoDbClientFactory.create({
        params: {
            TableName: tableName
        }
    });
    const params: DynamoDB.CreateTableInput = {
        AttributeDefinitions: attributeDefinitions,
        KeySchema: keySchema,
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        },
        // @todo Specifying the tableName again is redudant, but the type definition currently requires it.
        TableName: tableName
    };

    if (globalSecondaryIndexes) {
        params.GlobalSecondaryIndexes = globalSecondaryIndexes.map((globalSecondaryIndex) => {
            globalSecondaryIndex.ProvisionedThroughput = {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            };

            return globalSecondaryIndex;
        });
    }

    return new Promise((resolve, reject) => {
        dynamoDbClient.createTable(params, (err) => {
            if (err === null || err.code === 'ResourceInUseException') {
                resolve();
            } else {
                reject(err);
            }
        });
    });
};

export const deleteTable = (tableName: string): Promise<void> => {
    const dynamoDbClient = dynamoDbClientFactory.create({
        params: {
            TableName: tableName
        }
    });

    return new Promise ((resolve, reject) => {
        dynamoDbClient.deleteTable({
            // @todo Specifying the tableName again is redudant, but the type definition currently requires it.
            TableName: tableName
        }, (err) => {
            if (err === null) {
                resolve();
            } else {
                reject(err);
            }
        });
    });
};
