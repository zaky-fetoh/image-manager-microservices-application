import torch.utils.data as data
import torchvision.models as models
import torchvision.transforms as transforms
import torch as t
import os.path as path

class_labels = eval(open("model/imageNetLabel.txt").read())

if not path.exists("rescript.pt"):
    resnet = models.resnet18(pretrained=True)
    resnet_script = t.jit.script(resnet)
    resnet_script.save("rescript.pt")
resnet_script = t.jit.load("rescript.pt")

preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    lambda x: x[:3],
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225])
])


def getPred(im, top=4):
    im = preprocess(im).unsqueeze_(0)
    cls_pred = resnet_script(im)
    _, inds = t.sort(cls_pred, dim=-1, descending=True)
    return [class_labels[inds[0, i].item()]for i in range(top)]
