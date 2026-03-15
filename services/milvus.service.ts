import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

import { ENV } from "@/lib/constants/env";

export class MilvusService {
  private static client = new MilvusClient({ address: ENV.MILVUS_ADDRESS });

  static async initialize(): Promise<string | undefined> {
    const collectionName = "knowledge_based_vectors";

    const isExistedCollection = await this.client.hasCollection({
      collection_name: collectionName,
    });

    if (isExistedCollection.value) {
      return `Collection ${collectionName} is existed`;
    }

    try {
      await this.client.createCollection({
        collection_name: collectionName,
        fields: [
          {
            name: "id",
            data_type: DataType.Int64,
            is_primary_key: true,
            autoID: true,
          },
          {
            name: "vector",
            data_type: DataType.FloatVector,
            dim: 384,
          },
          {
            name: "metadata",
            data_type: DataType.JSON,
            description: "Storage for url, title, etc.",
          },
        ],
      });

      return `Collection ${collectionName} is created successfully`;
    } catch (error) {
      const message = `Failed to create collection ${collectionName}: ${JSON.stringify(error)}`;
      console.error(message);
      throw new Error(message);
    }
  }
}
