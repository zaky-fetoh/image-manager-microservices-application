import os
import pika
import controller as cont
MQ_HOST = os.getenv("MQ_HOST")
MQ_PORT = os.getenv("MQ_PORT")

MQ_EXCHANGE = os.getenv("MQ_EXCHANGE")

conn = pika.BlockingConnection(
    pika.ConnectionParameters(MQ_HOST,MQ_PORT)
)
channel = conn.channel()
channel.exchange_declare(MQ_EXCHANGE,type="direct")

channel.queue_declare("resnetQ",exclusive=True)
channel.queue_bind("resnetQ",MQ_EXCHANGE,"resnet")

def resnet_consume(ch, method, props, body):
    print("consuming" + body)
    imageId=body
    labels = cont.ResnetClassifyImageFromStorage(imageId)
    res = str({"ok":True, "labels":labels})
    ch.basic_publish("",  routing_key=props.reply_to,
                          properties=pika.BasicProperties(
                              correlation_id= props.correlation_id),
                          body=res)
    ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_consume("resnetQ",resnet_consume)