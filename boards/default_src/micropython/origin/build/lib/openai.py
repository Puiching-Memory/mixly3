import urequests
import time
import json
import ollama


class OpenAI(ollama.Ollama):
    def __init__(self, url="", api_key="", model="", max_history_num=0, max_tokens=1024):
        super().__init__(url, model, max_history_num)
        self._heads["Authorization"] = "Bearer {}".format(api_key)
        self._data["max_tokens"] = max_tokens
        self._chat_url = "{}/chat/completions".format(self._url)

    def _post(self, content_callback=None):
        response = None
        data = json.dumps(self._data).encode('utf-8')
        for i in range(0, self._max_retries):
            response = urequests.post(
                self._chat_url, headers=self._heads, data=data)
            if response.status_code == 200:
                break
            time.sleep(1)

        output = ""

        if response.status_code != 200:
            output = response.text
            if content_callback:
                content_callback(output)
            return output

        if not content_callback:
            output = json.loads(response.text)[
                "choices"][0]["message"]["content"]
            response.close()
            return output

        try:
            while True:
                line = response.raw.readline()
                if line[:5] != b"data:":
                    continue
                if line[-7:-1] == b"[DONE]":
                    break
                line = line[6:-1]
                line = line.decode('utf-8').strip()
                data = json.loads(line)
                content = data["choices"][0]["delta"]["content"]
                content_callback(content)
                output += content
        finally:
            response.close()
        return output
