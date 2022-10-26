import requests, os, model
import io, PIL.Image as Image

IS_HOST = os.getenv("IMAGEDISK_HOST")
IS_PORT = os.getenv("IMAGEDISK_PORT")

def ResnetClassifyImageFromStorage(imageId:str)->list:
    url= "http://"+IS_HOST+":"+IS_PORT+\
    "/plain-image/e416c158-1862-4670-b477-3e9fbdf0d0c1.jpeg"
    res = requests.get(url,stream=True)
    file = io.BytesIO(res.content)
    im = Image.open(file)
    pred = model.getPred(im)
    return pred


