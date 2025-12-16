# -*- coding: utf-8 -*-
import RPi.GPIO as GPIO
import time
import requests
from mfrc522 import SimpleMFRC522
from RPLCD.gpio import CharLCD

# ==========================================
# 設定エリア (環境に合わせて変更してください)
# ==========================================

import os
import json

# ==========================================
# 設定エリア (環境に合わせて変更してください)
# ==========================================

# 設定ファイル (config.json) の読み込み
# ファイルと同じディレクトリにある前提
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
            print("Config loaded from {}".format(config_path))
    except Exception as e:
        print("Failed to load config.json: {}".format(e))
else:
    print("config.json not found. Using default IP.")

SERVER_URL = "http://{}:{}/api/members/status".format(SERVER_IP, SERVER_PORT)

# 2. カードUIDとサーバー内ID(1, 2)の対応表
#    カードをかざしてコンソールに出た「読み取ったUID」を左側に書き込んでください。
#    テスト用に、どんなカードでも ID:1 (Kenta Uesugi) として送る機能を下に用意しています。
UID_MAP = {
    # 左: カードのUID (数値),  右: サーバーのID (1など)
    123456789012: 1, 
    987654321098: 2,
}

# テストモード: Trueにすると、どのカードをかざしても ID: 1 を送信します
FORCE_TEST_MODE = False 

# ==========================================

# ----------------------------
# GPIO設定
# ----------------------------
LED_PIN = 17
BUZZER_PIN = 27

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(LED_PIN, GPIO.OUT)
GPIO.setup(BUZZER_PIN, GPIO.OUT)

# ----------------------------
# RC522準備
# ----------------------------
reader = SimpleMFRC522()

# ----------------------------
# LCD準備
# ----------------------------
lcd = CharLCD(numbering_mode=GPIO.BCM,
              cols=16, rows=2,
              pin_rs=26, pin_e=20,
              pins_data=[5,6,13,19])

def feedback_ok():
    """成功時の演出"""
    GPIO.output(LED_PIN, True)
    GPIO.output(BUZZER_PIN, True)
    time.sleep(0.1)
    GPIO.output(LED_PIN, False)
    GPIO.output(BUZZER_PIN, False)
    time.sleep(0.1)
    GPIO.output(LED_PIN, True)
    GPIO.output(BUZZER_PIN, True)
    time.sleep(0.1)
    GPIO.output(LED_PIN, False)
    GPIO.output(BUZZER_PIN, False)

def feedback_error():
    """エラー時の演出（長音）"""
    GPIO.output(LED_PIN, True)
    GPIO.output(BUZZER_PIN, True)
    time.sleep(1.0)
    GPIO.output(LED_PIN, False)
    GPIO.output(BUZZER_PIN, False)

# ----------------------------
# メインループ
# ----------------------------
print("サーバーURL: {}".format(SERVER_URL))
print("待機中...")

try:
    while True:
        # LCD待機表示
        lcd.clear()
        lcd.write_string("Ready to scan...")
        
        # カード読み取り待機
        id, text = reader.read()
        raw_uid = int(id) # 明示的に数値型にする

        print("\n--- カード検知 ---")
        print("読み取ったUID: {}".format(raw_uid))

        # 送信するIDの決定
        target_id = None

        if FORCE_TEST_MODE:
            print("★テストモード: 強制的に ID: 1 を送信します")
            target_id = 1
        elif raw_uid in UID_MAP:
            target_id = UID_MAP[raw_uid]
            print("登録済みカードです。 ID: {} として送信します".format(target_id))
        else:
            print("未登録のカードです。送信しません。")
            lcd.clear()
            lcd.write_string("Unknown Card\n{}".format(raw_uid))
            feedback_error()
            time.sleep(2)
            continue

        # LCD表示更新
        lcd.clear()
        lcd.write_string("Sending ID: {}...".format(target_id))

        # サーバへ送信
        try:
            # タイムアウトを設けてフリーズ防止 (3秒)
            response = requests.post(SERVER_URL, json={"id": target_id}, timeout=3.0)
            
            print("ステータスコード: {}".format(response.status_code))
            print("レスポンス: {}".format(response.text))

            if response.status_code == 200:
                # 成功
                data = response.json()
                new_status = data.get("newStatus", "OK")
                
                lcd.clear()
                lcd.write_string("Success!\nStatus: {}".format(new_status))
                feedback_ok()
            else:
                # サーバー側エラー (404, 500等)
                lcd.clear()
                lcd.write_string("Server Error\nCode: {}".format(response.status_code))
                feedback_error()

        except requests.exceptions.ConnectionError:
            print("接続エラー: サーバーが見つかりません")
            lcd.clear()
            lcd.write_string("Connect Error\nCheck Server IP")
            feedback_error()
        except Exception as e:
            print("エラー発生: {}".format(e))
            lcd.clear()
            lcd.write_string("Error Occurred")
            feedback_error()

        time.sleep(2) # 連続読み取り防止

except KeyboardInterrupt:
    print("\n終了します。")
    GPIO.cleanup()
    lcd.clear()