# 🧠 Looq

Looq is a smart image ingestion and retrieval system that tags, embeds, and stores visual content for rapid similarity search and categorization, specializing in visual shopping. Designed to serve as a backend foundation for visual discovery platforms, as a shopping assistant utilising AI tools.

---

## 🚀 Features

- ✅ Upload and process image files from local storage
- ✅ Automatic image tagging via Google Vision API
- ✅ Upload to Cloudinary with optional cropping/resizing
- ✅ Vector embedding generation for each image
- ✅ MongoDB storage with `tag`, `url`, and `embedding`
- ✅ Query system to retrieve documents based on tag
- ✅ Batch pipeline architecture with stage-wise parallelism (the maintainance script)
- ✅ Dynamic frontend image rendering
- ✅ Tag-based filtering on the client side

---
## 🧠 Technologies Used

| Purpose | Stack |
|--------|-------|
| Backend | Node.js, Express.js |
| Cloud Storage | Cloudinary |
| Image Tagging | Google Vision API |
| Vector Embeddings | Google's multimodal embedding generation using Vertex AI |
| Database | MongoDB |
| Frontend | Vanilla JS / HTML / CSS |

---


