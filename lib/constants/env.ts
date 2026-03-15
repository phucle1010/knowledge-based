export const ENV = {
  MILVUS_ADDRESS: process.env.NEXT_PUBLIC_MILVUS_ADDRESS!,
  MONGODB_URI: process.env.NEXT_PUBLIC_MONGODB_URI!,
} as const;
