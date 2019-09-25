import sys
from PIL import Image
import torch
from facenet_pytorch import MTCNN, InceptionResnetV1

def get_vector(resnet, mtcnn, img_path):
    img = Image.open(img_path)
    img_cropped = mtcnn(img)
    with torch.no_grad():
        img_embedding = resnet(img_cropped.unsqueeze(0))
    return img_embedding, img_cropped

if __name__ == "__main__":
    img_path = sys.argv[1]

    resnet = InceptionResnetV1(pretrained='vggface2').eval()
    mtcnn = MTCNN()

    temp_vector, temp_img = get_vector(resnet, mtcnn, img_path)
    print(temp_vector[0])




