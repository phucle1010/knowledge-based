## Milvus

### Run by Docker

1. Start Milvus Standalone

```bash
curl -sfL https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh -o standalone_embed.sh
```

```bash
bash standalone_embed.sh start
```

2. Run Attu to track data

```bash
docker run -p 8000:3000 -e MILVUS_URL=YOUR_MILVUS_IP:19530 zilliz/attu:latest
```

3. Connect Attu

- Provide connection information:

```bash
Milvus Address: host.docker.internal:19530
Username: root
Password: Milvus
```
