import { DynamoDB } from 'aws-sdk';

export interface ITableDefinition {

    attributeDefinitions: DynamoDB.AttributeDefinition[];

    globalSecondaryIndexes?: DynamoDB.GlobalSecondaryIndex[];

    keySchema: DynamoDB.KeySchemaElement[];

    tableName: string;

}
