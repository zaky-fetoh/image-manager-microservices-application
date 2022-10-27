import flask
import os


# only for developmentest
os.environ["IMAGEDISK_HOST"] = "localhost"
os.environ["IMAGEDISK_PORT"] = "3000"

os.environ["MQ_HOST"] = "localhost"
os.environ["MQ_PORT"] = "5672"
os.environ["MQ_EXCHANGE"] = "deepModel"


os.environ["PORT"] = "3002"

import controller as cont


app = flask.Flask(__name__)


@app.route("/resnet/<string:imageId>", methods=["GET"])
def resnetClassification(imageId):
    try:
        pred = cont.classification.ResnetClassifyImageFromStorage(
            imageId=imageId)
        return flask.make_response(flask.jsonify({
            "ok": True, "labels": pred,
        })), 200
    except:
        return flask.make_response(flask.jsonify({
            "ok": False, })), 500


if __name__ == "__main__":
    app.run(port=os.getenv("PORT"),
            debug=True, host="localhost")
