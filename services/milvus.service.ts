import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

import { ENV } from "@/lib/constants/env";
import { logger } from "@/lib/utils/logger";

interface VectorMetadata {
    type: "question" | "answer";
    sessionId: string;
    questionId?: string;
    userId: string;
    content: string;
    level: string;
    language: string;
    timestamp: Date;
    // For answers only
    score?: number;
    feedback?: string;
    strengths?: string[];
    weaknesses?: string[];
}

export class MilvusService {
    private static client: MilvusClient | null = null;
    private static readonly COLLECTION_NAME = "interview_vectors";

    private static getClient(): MilvusClient {
        if (!this.client) {
            try {
                this.client = new MilvusClient({ address: ENV.MILVUS_ADDRESS });
            } catch (error) {
                logger.error("Failed to initialize Milvus client:", error);
                throw new Error("Milvus service unavailable");
            }
        }
        return this.client;
    }

    static async initialize(): Promise<string | undefined> {
        const isExistedCollection = await this.getClient().hasCollection({
            collection_name: this.COLLECTION_NAME,
        });

        if (isExistedCollection.value) {
            return `Collection ${this.COLLECTION_NAME} is existed`;
        }

        try {
            await this.getClient().createCollection({
                collection_name: this.COLLECTION_NAME,
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
                        description: "Storage for interview data",
                    },
                ],
            });

            // Create index for vector field
            await this.getClient().createIndex({
                collection_name: this.COLLECTION_NAME,
                field_name: "vector",
                index_type: "FLAT",
                metric_type: "COSINE",
                params: { nlist: 1024 },
            });

            // Load collection
            await this.getClient().loadCollection({
                collection_name: this.COLLECTION_NAME,
            });

            return `Collection ${this.COLLECTION_NAME} is created successfully`;
        } catch (error) {
            const message = `Failed to create collection ${this.COLLECTION_NAME}: ${JSON.stringify(error)}`;
            logger.error(message);
            throw new Error(message);
        }
    }

    /**
     * Generate embedding vector from text using a simple hash-based approach
     * In production, this should use a proper embedding service like OpenAI embeddings
     */
    private static async generateEmbedding(text: string): Promise<number[]> {
        // Simple hash-based embedding for demo purposes
        // In production, replace with actual embedding service
        const hash = text.split("").reduce((a, b) => {
            a = (a << 5) - a + b.charCodeAt(0);
            return a & a;
        }, 0);

        // Generate 384-dimensional vector using hash
        const vector: number[] = [];
        for (let i = 0; i < 384; i++) {
            vector.push((Math.sin(hash + i) + 1) / 2); // Normalize to 0-1
        }

        return vector;
    }

    static async insertVector(metadata: VectorMetadata): Promise<void> {
        try {
            const vector = await this.generateEmbedding(metadata.content);

            await this.getClient().insert({
                collection_name: this.COLLECTION_NAME,
                fields_data: [
                    {
                        vector,
                        metadata,
                    },
                ],
            });
        } catch (error) {
            logger.error("Failed to insert vector:", error);
            throw new Error(`Failed to insert vector: ${error}`);
        }
    }

    static async searchVectors(
        query: string,
        type: "question" | "answer",
        sessionId: string,
        limit: number = 5
    ): Promise<Array<{ score: number; metadata: VectorMetadata }>> {
        try {
            const queryVector = await this.generateEmbedding(query);

            const searchResults = await this.getClient().search({
                collection_name: this.COLLECTION_NAME,
                vector: queryVector,
                search_params: {
                    anns_field: "vector",
                    topk: limit,
                    metric_type: "COSINE",
                    params: JSON.stringify({ nprobe: 10 }),
                },
                output_fields: ["metadata"],
                filter: `metadata["type"] == "${type}" and metadata["sessionId"] == "${sessionId}"`,
            });

            return searchResults.results.map((result) => ({
                score: result.score,
                metadata: result.entity.metadata,
            }));
        } catch (error) {
            logger.error("Failed to search vectors:", error);
            throw new Error(`Failed to search vectors: ${error}`);
        }
    }

    static async findSimilarAnswer(question: string, sessionId: string, threshold: number = 0.8): Promise<VectorMetadata | null> {
        try {
            const results = await this.searchVectors(question, "answer", sessionId, 1);

            if (results.length > 0 && results[0].score >= threshold) {
                return results[0].metadata;
            }

            return null;
        } catch (error) {
            logger.error("Failed to find similar answer:", error);
            return null;
        }
    }
}
