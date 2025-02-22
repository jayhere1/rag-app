import weaviate
import json
from typing import List, Dict, Optional
from weaviate.collections import Collection
from .config import settings


class VectorStore:
    def __init__(self):
        try:
            self.client = weaviate.WeaviateClient(
                connection_params=weaviate.connect.ConnectionParams.from_url(
                    url=settings.WEAVIATE_URL,
                    grpc_port=50051
                )
            )
            self.client.connect()
        except Exception as e:
            print(f"Error connecting to Weaviate: {type(e).__name__}: {str(e)}")
            raise

    def __del__(self):
        """Cleanup when the instance is destroyed."""
        try:
            if hasattr(self, 'client'):
                self.client.close()
        except Exception as e:
            print(f"Error closing Weaviate client: {type(e).__name__}: {str(e)}")

    def ensure_connected(self):
        """Ensure the client is connected."""
        try:
            if not self.client.is_connected():
                self.client.connect()
        except Exception as e:
            print(f"Error reconnecting to Weaviate: {type(e).__name__}: {str(e)}")
            raise

    def create_collection(self, collection_name: str, description: str = ""):
        """Create a new collection in Weaviate."""
        try:
            self.ensure_connected()
            self.client.collections.create(
                name=collection_name,
                description=description,
                vectorizer_config=weaviate.config.Configure.Vectorizer.none(),
                vector_index_config=weaviate.config.Configure.VectorIndex.hnsw(
                    distance_metric=weaviate.config.Configure.VectorDistance.cosine
                ),
                vector_dimensions=1536,  # OpenAI embedding dimensions
                properties=[
                    weaviate.properties.Property(
                        name="text",
                        data_type=weaviate.properties.DataType.TEXT,
                        description="The text content"
                    ),
                    weaviate.properties.Property(
                        name="metadata",
                        data_type=weaviate.properties.DataType.TEXT,
                        description="Document metadata (stored as JSON string)"
                    ),
                ]
            )
            return True
        except Exception as e:
            if "already exists" in str(e):
                return False
            raise e

    def delete_collection(self, collection_name: str):
        """Delete a collection and all its data."""
        try:
            self.ensure_connected()
            self.client.collections.delete(collection_name)
            return True
        except Exception:
            return False

    def add_documents(
        self, collection_name: str, documents: List[Dict], vectors: List[List[float]]
    ):
        """Add documents with their vectors to a collection."""
        self.ensure_connected()
        collection: Collection = self.client.collections.get(collection_name)
        
        with collection.batch.dynamic() as batch:
            for doc, vector in zip(documents, vectors):
                properties = {
                    "text": doc["text"],
                    "metadata": json.dumps(doc["metadata"]),
                }
                batch.add_object(
                    properties=properties,
                    vector=vector
                )

    def search(
        self,
        collection_name: str,
        query_vector: List[float],
        filters: Optional[Dict] = None,
        limit: int = 5,
    ) -> List[Dict]:
        """Search for similar documents in a collection."""
        self.ensure_connected()
        collection: Collection = self.client.collections.get(collection_name)
        
        query = collection.query.near_vector(
            vector=query_vector,
            limit=limit,
            return_properties=["text", "metadata"],
            return_metadata=["vector"]
        )

        if filters:
            filter_conditions = [
                collection.query.filter.equal(f"metadata.{k}", v)
                for k, v in filters.items()
            ]
            if filter_conditions:
                query = query.with_where(
                    collection.query.filter.and_(*filter_conditions)
                )

        try:
            results = query.objects
            processed_results = []
            for obj in results:
                if hasattr(obj, "properties"):
                    processed_results.append({
                        "text": obj.properties.get("text"),
                        "metadata": obj.properties.get("metadata")
                    })
            return processed_results
        except Exception as e:
            print(f"Error in vector store search: {type(e).__name__}: {str(e)}")
            return []

    def list_collections(self) -> List[str]:
        """List all available collections."""
        try:
            self.ensure_connected()
            collections = self.client.collections.list_all()
            return [collection.name for collection in collections]
        except Exception as e:
            print(f"Error listing collections: {type(e).__name__}: {str(e)}")
            return []

    def get_collection_info(self, collection_name: str) -> Dict:
        """Get information about a specific collection."""
        try:
            self.ensure_connected()
            collection = self.client.collections.get(collection_name)
            return {
                "name": collection.name,
                "description": collection.description,
                "properties": [
                    {
                        "name": prop.name,
                        "dataType": prop.data_type.value,
                        "description": prop.description
                    }
                    for prop in collection.properties
                ]
            }
        except Exception:
            return None
