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
kmeans_model = pickle.load(open('../Final Models/Kmeans_pipeline.pkl', 'rb'))
cluster0_model = pickle.load(open('../Final Models/Cluster_0_logreg_pipeline.pkl', 'rb'))
cluster1_model = pickle.load(open('../Final Models/Cluster_2_RF_pipeline.pkl', 'rb')) # TODO
cluster2_model = pickle.load(open('../Final Models/Cluster_2_RF_pipeline.pkl', 'rb'))
cluster3_model = pickle.load(open('../Final Models/Cluster_2_RF_pipeline.pkl', 'rb')) # TODO
cluster4_model = pickle.load(open('../Final Models/Cluster_4_logreg_pipeline.pkl', 'rb'))
cluster5_model = pickle.load(open('../Final Models/Cluster_5_RF_pipeline.pkl', 'rb'))

# Defining the model input types
class Patient(BaseModel):
    age: int
    gender: int
    height: float
    weight: float
    ap_hi: int
    ap_low: int
    cholesterol: int
    gluc: int
    smoke: int
    alco: int
    active: int

# Map cluster to previous arrangement
def map_cluster(cluster):
    if cluster == 0:
        return 0
    elif cluster == 1:
        return 3
    elif cluster == 2:
        return 4
    elif cluster == 3:
        return 5
    elif cluster == 4:
        return 1
    elif cluster == 5:
        return 2
    

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
        "high blood pressure, older crowd, majority female, shortest",
        "high glucose, high cholesterol, older crowd",
        "alcoholics, some smokers; smallest cluster",
        "smokers, majority male",
        "majority male, tallest",
        "almost completely female, shortest, lightest; largest cluster"
    ]

    # Step 1) Figure out which cluster patient belongs to
    cluster = kmeans_model.predict(health_history).tolist()[0]

    # Step 2) Perform cluster mappings
    cluster = map_cluster(cluster)

    # Step 3) Run prediction model based on which cluster patient belongs to
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
