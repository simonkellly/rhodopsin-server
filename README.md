# rhodopsin-server
This is a utilty to be able to use the MacOS only Rhodosin auto image occlusion tool from my Windows computer.  

Some modifications will need to be made to Image Occlusion source to make this work:
```python
# logic from is_platform_supported copied to new method: is_platform_actually_supported
# is_platform_supported and is_auto_occlude_available made to just return True

# Add this method
def parse_over_network(
        self,
        image_path: str,
        line_height: Optional[float] = None,
        languages: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        import base64
        import json
        import requests

        url = 'http://X.Y.Z.W:5423' # Replace with your server IP and port
        with open(image_path, "rb") as f:
            image_bytes = f.read()        
        image_b64 = base64.b64encode(image_bytes).decode("utf8")

        headers = {
        'Content-type': 'application/json', 
        'Accept': 'text/plain'
        }
        
        payload = json.dumps({
        "name": image_path,
        "lineHeight": line_height,
        "languages": languages,
        "image": image_b64, 
        "other_key": "value"}

        )
        response = requests.post(url, data=payload, headers=headers)
        data = response.text
        return json.loads(data)

# Modify auto_occlude to use this code
if not self.is_platform_actually_supported():
    data = self.parse_over_network(
        image_path=image_path, line_height=line_height, languages=languages
    )
else:
    data = self._image_parser.parse_image(
        image_path=image_path, line_height=line_height, languages=languages
    )
```

---

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

This project was created using `bun init` in bun v0.1.10. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
