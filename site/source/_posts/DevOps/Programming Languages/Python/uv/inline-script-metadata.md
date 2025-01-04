---
title: Inline Script Metadata
image: python
tags:
- Educational
---
## Description

Python recently added a standard format for inline script metadata. It allows for selecting Python versions and defining dependencies. 

## Usage[^1]


Use `uv init --script` to initialize scripts with the inline metadata.

```bash
uv init --script example.py --python 3.12
```

### Declaring script dependencies

The inline metadata format allows the dependencies for a script to be declared in the script itself.

uv supports adding and updating inline script metadata for you.

Use `uv add --script` to declare the dependencies for the script.

```bash
uv add --script example.py 'requests<3' 'rich'
```

This will add a script section at the top of the script declaring the dependencies using TOML:

`example.py`
```python
# /// script
# dependencies = [
#   "requests<3",
#   "rich",
# ]
# ///

import requests
from rich.pretty import pprint

resp = requests.get("https://peps.python.org/api/peps.json")
data = resp.json()
pprint([(k, v["title"]) for k, v in data.items()][:10])
```

uv will automatically create an environment with the dependencies necessary to run the script.

### Running the script

```bash
uv run example.py
```

When using inline script metadata, even if uv run is used in a project, the project's dependencies will be ignored.

uv also respects Python version requirements:

`example.py`
```python
# /// script
# requires-python = ">=3.12"
# dependencies = []
# ///

# Use some syntax added in Python 3.12
type Point = tuple[float, float]
print(Point)
```

The dependencies field must be provided even if empty.

- uv run will search for and use the required Python version.
- The Python version will download if it is not installed.


[^1]: https://docs.astral.sh/uv/guides/scripts/#creating-a-python-script
