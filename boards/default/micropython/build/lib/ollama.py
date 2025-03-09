import urequests
import time
import json


class Ollama():
    def __init__(self, url="", model=""):
        self._heads = {
            "Accept": "text/event-stream",
            # "Cache-Control": "no-cache",
            # "Connection": "keep-alive",
            "Content-Type": "application/json"
        }
        self._url = url
        self._max_retries = 1
        self._max_history_num = 0
        self._timeout = 10000
        self._messages = []
        self._data = {
            "stream": True,
            "model": model,
            "messages": self._messages
        }

    def set_timeout(self, timeout):
        self._timeout = timeout

    def set_max_retries(self, max_retries):
        self._max_retries = max_retries

    def set_custom_url(self, url):
        self._url = url

    def select_model(self, model_name):
        self._data["model"] = model_name

    def set_max_history_num(self, num):
        self._max_history_num = num

    def empty_history(self):
        self._messages = []

    def add_history(self, role, content):
        self._messages.append({
            "role": role,
            "content": content
        })

    def clear_user_history(self):
        if len(self._messages) < 2:
            return
        for i in range(1, len(self._messages)):
            del self._messages[i]

    def _post(self, content_callback=None):
        response = None
        data = json.dumps(self._data).encode('utf-8')
        for i in range(0, self._max_retries):
            response = urequests.post(
                self._url, headers=self._heads, data=data)
            if response.status_code == 200:
                break
            time.slee(1)

        output = ""

        if response.status_code != 200:
            output = response.text
            if content_callback:
                content_callback(output)
            return output

        if not content_callback:
            output = json.loads(response.text)["message"]["content"]
            response.close()
            return output

        try:
            while True:
                line = response.raw.readline()
                if line:
                    line = line.decode('utf-8').strip()
                    data = json.loads(line)
                    if data["done"]:
                        break
                    content = data["message"]["content"]
                    content_callback(content)
                    output += content
                else:
                    break
        finally:
            response.close()
        return output

    def chat(self, message, content_callback=None):
        self.add_history("user", message)
        self._data["stream"] = bool(content_callback)
        self._heads["Accept"] = "text/event-stream" if content_callback else "application/json"
        content = self._post(content_callback)
        if self._max_history_num:
            self.add_history("assistant", content)
            messages_len = len(self._messages)
            history_num = 2 * self._max_history_num
            while history_num < len(self._messages):
                del self._messages[0]
        else:
            self.clear_user_history()

        return content
