import os, json, pika
from threading import Thread
import controller as cont
MQ_HOST = os.getenv("MQ_HOST")
MQ_PORT = os.getenv("MQ_PORT")

MQ_EXCHANGE = os.getenv("MQ_EXCHANGE")

print( MQ_PORT, MQ_HOST)

conn = pika.BlockingConnection(
    pika.ConnectionParameters(MQ_HOST,MQ_PORT)
)
channel = conn.channel()
channel.exchange_declare(MQ_EXCHANGE,exchange_type="direct",
                    )

channel.queue_declare("resnetQ")
channel.queue_bind("resnetQ",MQ_EXCHANGE,"resnet")

def resnet_consume(ch, method, props, body):
    print("consuming" + str(body))
    imageId, crpt=str(body.decode("utf-8")).split(" XX ")
    labels = cont.ResnetClassifyImageFromStorage(imageId, crpt)
    res = str(json.dumps({"ok":"true", "labels":labels}))
    ch.basic_publish("",  routing_key=props.reply_to,
                          properties=pika.BasicProperties(
                          correlation_id= props.correlation_id),
                          body=res)
    ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_consume("resnetQ",resnet_consume)
Thread(target=channel.start_consuming).start()
