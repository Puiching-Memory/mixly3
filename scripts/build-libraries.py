import ast
import sys
import json
import os
from os import path


def extract_imports(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        tree = ast.parse(file.read(), filename=file_path)

    imports = []

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                imports.append(alias.name)
        elif isinstance(node, ast.ImportFrom):
            imports.append(node.module)

    return imports


if __name__ == "__main__":
    working_path = os.getcwd()
    target_path = sys.argv[1]
    if not path.isabs(target_path):
        target_path = path.abspath(path.join(working_path, target_path))
    output = None
    if path.isfile(target_path):
        exit(0)
    output = {}
    content = os.listdir(target_path)
    for i in content:
        if i == "map.json":
            continue
        name = i[: i.find(".")]
        output[name] = {}
        extname = i[i.find(".") :]
        file_path = path.join(target_path, i)
        if path.isfile(file_path) and extname == ".py":
            output[name]["__require__"] = extract_imports(file_path)
            output[name]["__file__"] = True
        else:
            output[name]["__file__"] = False
        output[name]["__name__"] = i
    fw = open(path.join(target_path, "map.json"), "w", encoding="utf-8")
    json.dump(output, fw, indent=4, ensure_ascii=False)
    fw.close()
