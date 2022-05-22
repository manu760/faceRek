import json
import pyttsx3
import websocket

try:
    import thread
except ImportError:
    import _thread as thread
import time
import rel
from gpiozero import LED
from time import sleep
import sys

rel.safe_read()
engine = pyttsx3.init()
red = LED(17)


def on_message(ws, message):
    print(message)
    x = message.split("{")[1]
    y = x.split(":")[1]
    z = y.split(".")[0]
    engine.say(z)
    engine.runAndWait()
    red = LED(17)
    while True:
        red.on()
        sleep(1)
        red.off()
        sleep(1)
    sys.exit()


def on_error(ws, error):
    print(error)


def on_close(ws, close_status_code, close_msg):
    print("-------Connection Closed----------")


def on_open(ws):
    print("Connection Opened....")


if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("wss://9ekmfzaz8b.execute-api.us-east-1.amazonaws.com/prod",
                                on_open=on_open,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    ws.run_forever(dispatcher=rel)  # Set dispatcher to automatic reconnection
    rel.signal(2, rel.abort)  # Keyboard Interrupt
    rel.dispatch()


