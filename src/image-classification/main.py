import flask
import os
import controller as cont

#only for developmentest
os.environ["IMAGEDISK_HOST"] = "localhost"
os.environ["IMAGEDISK_PORT"] = "3000"
os.environ["PORT"] =3002 

app = flask.Flask(__name__)


@app.route("/resnet/<str:imageId>", methods=["GET"])
def resnetClassification(imageId):
    pred = cont.classification.ResnetClassifyImageFromStorage(
        imageId=imageId)
    return flask.make_response(flask.jsonify({
        ok: True, labels: pred,
    }))
    


if __name__ == "__main__":
    app.run(port = os.getenv("PORT"),
            debug=True, host="localhost")
