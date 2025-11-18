import requests
import json

# 1. 呼び出すNuxt APIのURL
# (Nuxtが http://localhost:3000 で動いていると仮定)
nuxt_api_url = "http://localhost:3000/api/members/status"

# 2. 送信するデータ (更新したいメンバーのID)
member_id_to_toggle = 1  # <- ここをテストしたいIDに変更
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