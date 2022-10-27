import requests, os, model
import io, PIL.Image as Image

IS_HOST = os.getenv("IMAGEDISK_HOST")
IS_PORT = os.getenv("IMAGEDISK_PORT")

def ResnetClassifyImageFromStorage(imageId:str, crpt)->list:
    if crpt == "false": 
        url= "http://"+IS_HOST+":"+IS_PORT+\
        "/plain-image/" + imageId
    else :
        url= "http://"+IS_HOST+":"+IS_PORT+\
        "/cipher-image/" + imageId
    res = requests.get(url,stream=True)
    file = io.BytesIO(res.content)
    im = Image.open(file)
    pred = model.getPred(im)
    return pred


