import PIL.Image as Image
import requests as req
import model as model
import flask
import io 
import os

#for only developmentest
os.environ["IMAGEDISK_HOST"] = "localhost"
os.environ["IMAGEDISK_PORT"] = "3000"

IS_HOST = os.getenv("IMAGEDISK_HOST")
IS_PORT = os.getenv("IMAGEDISK_PORT")

url= "http://"+IS_HOST+":"+IS_PORT+\
    "/plain-image/e416c158-1862-4670-b477-3e9fbdf0d0c1.jpeg"

res = req.get(url,stream=True)


file = io.BytesIO(res.content)

im = Image.open(file)
pred = model.getPred(im)

print( pred ); 

# flask.Flask(__name__).run(debug=True)
