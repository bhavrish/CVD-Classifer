import uvicorn
import pickle
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Basic API configurations
app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Retrieve and deserialize all models
kmeans_model = pickle.load(open('../Final Models/Kmeans.pkl', 'rb'))
cluster0_model = pickle.load(open('../Final Models/Cluster0_SVM.pkl', 'rb'))
cluster1_model = pickle.load(open('../Final Models/Cluster1_SVM.pkl', 'rb'))
cluster2_model = pickle.load(open('../Final Models/Cluster2_SVM.pkl', 'rb'))
cluster3_model = pickle.load(open('../Final Models/Cluster3_SVM.pkl', 'rb'))
cluster6_model = pickle.load(open('../Final Models/Cluster6_SVM.pkl', 'rb'))
cluster7_model = pickle.load(open('../Final Models/Cluster7_SVM.pkl', 'rb'))

# Defining the model input types
class Patient(BaseModel):
    age: int
    gender: int
    height: int
    weight: float
    ap_hi: int
    ap_low: int
    cholesterol: int
    gluc: int
    smoke: int
    alco: int
    active: int


# Setting up the home route
@app.get("/")
def home():
    return {"data": "Welcome to CVD classifier!"}

# Setting up the prediction route
@app.post("/predict/")
async def get_predict(data: Patient):
    health_history = [[
        data.age,
        data.gender,
        data.height,
        data.weight,
        data.ap_hi,
        data.ap_low,
        data.cholesterol,
        data.gluc,
        data.smoke,
        data.alco,
        data.active
    ]]

    descriptions = [
        "high cholesterol",
        "lowest cvd%, youngest; third largest cluster",
        "pure smokers (no alcohol)",
        "high glucose, high cholesterol",
        "highest cvd%, high blood pressure; smallest cluster",
        "alcoholics, some smokers",
        "more male; “majority” (second largest) cluster",
        "not active at all; fourth largest cluster",
        "more female; “majority” (largest) cluster"
    ]

    print("testing...")

    # Step 1) Figure out which cluster patient belongs to
    cluster = kmeans_model.predict(health_history).tolist()[0]

    # Step 2) Run prediction model based on which cluster patient belongs to
    atRisk = 0

    if cluster == 0:
        atRisk = cluster0_model.predict(health_history).tolist()[0]
    elif cluster == 1:
        atRisk = cluster1_model.predict(health_history).tolist()[0]
    elif cluster == 2:
        atRisk = cluster2_model.predict(health_history).tolist()[0]
    elif cluster == 3:
        atRisk = cluster3_model.predict(health_history).tolist()[0]
    elif cluster == 4:
        atRisk = cluster2_model.predict(health_history).tolist()[0] # TODO
    elif cluster == 5:
        atRisk = cluster2_model.predict(health_history).tolist()[0] # TODO
    elif cluster == 6:
        atRisk = cluster6_model.predict(health_history).tolist()[0]
    elif cluster == 7:
        atRisk = cluster7_model.predict(health_history).tolist()[0]
    elif cluster == 8:
        atRisk = cluster2_model.predict(health_history).tolist()[0] # TODO

    return {
        "data": {
            'cluster': cluster,
            'cluster_description': descriptions[cluster],
            'prediction': atRisk,
            'interpretation': 'Patient is at risk of CVD' if atRisk == 1 else 'Patient is safe.'
        }
    }

if __name__ == '__main__':
    uvicorn.run(app, port=8080, host='0.0.0.0')
