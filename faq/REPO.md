## JSON File Structure

A repository is a JSON file with the following structure:

```json
{
  "name": "Repository name",
  "version": "1.0.0",
  "description": "Repository description",
  "author": "Author name"
  "items": [
    {
      "title": "Item title",
      "hash": "TORRENT_HASH",
      "tracker": "http://tracker.url/announce",
      "poster": "http://example.com/poster.jpg",
      "size": 679597169,
      "published_date": 1579910280
    }
  ]
}
```

### Field Descriptions

**Repository fields:**

- `name` - repository name (required)
- `version` - repository version (required)
- `description` - repository description (optional)
- `author` - repository author name (optional)
- `items` - array of items (required)

**Item fields:**

- `title` - item title (required)
- `hash` - torrent INFO HASH (required)
- `tracker` - tracker URL for magnet link (required)
- `poster` - poster image URL (required)

  **Recommended params: Size 400x640 pixels, format webp, quality 50**

- `size` - size in bytes (required)
- `published_date` - publication date in Unix timestamp (optional)

### How to get INFO HASH?

INFO HASH is a unique torrent identifier (40 characters in HEX format). You can get it from a torrent file or from a magnet link (after `btih:`).

### Adding Methods

- Host the JSON file on any web hosting and add it by URL
- Upload the JSON file directly via "Upload JSON file" button

### CORS and Caching

- If the repository is located on a remote server, CORS and caching must be configured correctly.
- If CORS is misconfigured, the application will display the error: **Failed to load repository from URL. Possible CORS or network issue.**
- If caching is misconfigured, automatic repository updates may not work correctly.
- The server must send the correct `Access-Control-Allow-Origin` and `Cache-Control` headers.
