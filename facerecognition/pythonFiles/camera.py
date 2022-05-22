from picamera import PiCamera
from time import sleep
import datetime as dt
import sys
import subprocess
import os
import boto3

#amazon s3
s3 = boto3.resource('s3')

BUCKET = "cst3990-2021-22-uploadpictures"
SRC_DIR = "/home/pi/Documents/FaceRecognition/Pictures/"
DEST = BUCKET + "UploadPictures/"
CURRENT_DATE = dt.datetime.now().strftime('%m/%d/%Y %H:%M:%S')
IMAGE_NAME = dt.datetime.now().strftime('%m%d%Y%H%M%S')

camera = PiCamera()

camera.resolution = (600,600)
camera.start_preview()
#camera.annotate_text = CURRENT_DATE
sleep(5)
camera.capture('/home/pi/Documents/FaceRecognition/Pictures/' + IMAGE_NAME + '.jpg')
print("PICTURE CLICKED.. " + IMAGE_NAME)
camera.stop_preview()

s3.meta.client.upload_file('/home/pi/Documents/FaceRecognition/Pictures/' + IMAGE_NAME + '.jpg',BUCKET,IMAGE_NAME)
print("PICTURE UPLOADED TO S3.. " + BUCKET)