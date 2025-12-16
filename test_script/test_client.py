import requests
import json

import os

# 設定ファイル (config.json) の読み込み
base_dir = os.path.dirname(os.path.abspath(__file__))
config_path = os.path.join(base_dir, "config.json")

# デフォルト値
SERVER_IP = "192.168.11.18"
SERVER_PORT = "3000"

if os.path.exists(config_path):
    try:
        with open(config_path, "r") as f:
            config = json.load(f)
            SERVER_IP = config.get("SERVER_IP", SERVER_IP)
            SERVER_PORT = config.get("SERVER_PORT", SERVER_PORT)
    except Exception as e:
        print(f"Failed to load config: {e}")

# 1. 呼び出すNuxt APIのURL
nuxt_api_url = f"http://{SERVER_IP}:{SERVER_PORT}/api/members/status"

# 2. 送信するデータ (更新したいメンバーのID)
member_id_to_toggle = 584196026551  # <- ここをテストしたいIDに変更
data_to_send = {
    "id": member_id_to_toggle
}

print(f"Sending POST request to {nuxt_api_url} with ID: {member_id_to_toggle}")

try:
    # 3. POSTリクエストを送信
    response = requests.post(nuxt_api_url, json=data_to_send)

    # 4. サーバーからの応答を確認
    
    # HTTPステータスコードが 4xx や 5xx だった場合に例外を発生
    response.raise_for_status()

    # 成功した場合、JSONレスポンスを表示
    print("✅ Success!")
    print("Server response:", response.json())

except requests.exceptions.HTTPError as errh:
    print(f"❌ Http Error: {errh}")
    # Nuxt APIが返したエラーメッセージ（404 Not Foundなど）を表示
    print(f"Response body: {errh.response.text}")
except requests.exceptions.ConnectionError as errc:
    print(f"❌ Error Connecting: {errc}")
    print("Check if the Nuxt server is running on http://localhost:3000")
except requests.exceptions.RequestException as err:
    print(f"❌ Something else went wrong: {err}")