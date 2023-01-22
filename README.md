# K8s Basic demo using React and Python

_This is a basic demo that describes all the needed steps to implement a modern application using React, Python and Firestore on Google Kubernetes Engine (GKE)_

## Creating a cluster 🛠️

_First of all we need to create a kubernetes cluster on GKE, this to implement our app, you can use a standard cluster or an autopilot one,as you prefer, I'll leave you an example command to create one by running it on Cloud Shell_

**Create your env vars**

```bash
PROJECT_ID=XXXXXXX
CLUSTER_NAME=XXXXXXX
```

**Standard Cluster**

```bash
gcloud beta container --project $PROJECT_ID clusters create $CLUSTER_NAME --zone "us-central1-a" --no-enable-basic-auth --cluster-version "1.23.13-gke.900" --release-channel "stable" --machine-type "e2-medium" --image-type "COS_CONTAINERD" --disk-type "pd-standard" --disk-size "10" --metadata disable-legacy-endpoints=true --scopes "https://www.googleapis.com/auth/devstorage.read_only","https://www.googleapis.com/auth/logging.write","https://www.googleapis.com/auth/monitoring","https://www.googleapis.com/auth/servicecontrol","https://www.googleapis.com/auth/service.management.readonly","https://www.googleapis.com/auth/trace.append" --max-pods-per-node "110" --num-nodes "2" --logging=SYSTEM,WORKLOAD --monitoring=SYSTEM --enable-ip-alias --network "projects/kubernetes-demo-gdsc/global/networks/default" --subnetwork "projects/kubernetes-demo-gdsc/regions/us-central1/subnetworks/default" --no-enable-intra-node-visibility --default-max-pods-per-node "110" --no-enable-master-authorized-networks --addons HorizontalPodAutoscaling,HttpLoadBalancing,GcePersistentDiskCsiDriver --enable-autoupgrade --enable-autorepair --max-surge-upgrade 1 --max-unavailable-upgrade 0 --enable-shielded-nodes --node-locations "us-central1-a"
```

**Autopilot Cluster**

```bash
gcloud container --project $PROJECT_ID clusters create-auto $CLUSTER_NAME --region "us-central1" --release-channel "regular" --network "projects/kubernetes-demo-gdsc/global/networks/default" --subnetwork "projects/kubernetes-demo-gdsc/regions/us-central1/subnetworks/default" --cluster-ipv4-cidr "/17" --services-ipv4-cidr "/22"
```

## Enabling Firestore 📄

_On the [GCP Console](https://console.cloud.google.com/) search for Firestore and just click on **Enable Firestore in Native Mode**_

## Creating Service Accounts 🔒

_We'll need two service account for this demo, one is used to allow our k8s deployments to pull images from the container registry and the second one to connect with the Firestore database from our python API._

_You have to go to the IAM service and the [Service Accounts section](https://console.cloud.google.com/iam-admin/serviceaccounts), once there create the service accounts as follow:_

**Firestore Service account**

- For the **name** you can set it as you want, I recommend: **firestore_sa**
- For the **Role** you will select: **Firebase Admin**

**GCR Service account**

- For the **name** you can set it as you want, I recommend: **gcr-service-agent**
- For the **Role** you will select: **Container Registry Service Agent**

## Setting up Kubernetes environment 🖥️

1. To start running kubectl command we need to authenticate the tool with our cluster, to do it we need to run:

```bash
gcloud container clusters get-credentials $CLUSTER_NAME --zone us-central1-a --project $PROJECT_ID
```

2. Verify you can run kunectl commands

```bash
kubectl get all
```

3. Create a namespace for your workloads

```bash
kubectl create namespace demo-namespace
```

4. Set the namespace as default for the next kubectl commands

```bash
kubectl config set-context --current --namespace=demo-namespace
```

5. You need to authenticate Docker with GCP, there are [different ways](https://cloud.google.com/container-registry/docs/advanced-authentication) to do it but the easiest one is by runnig

```bash
gcloud auth configure-docker
```

## Create k8s secrets 🤫

_You'll need to create 2 secrets that matches the service accounts created, for that the first thing to do is download the JSON Keys and store them under the following routes:_

- **k8s/.secrets/firestore_sa.json**
- **k8s/.secrets/gcr-service-agent-sa.json**

_Once that is done:_

1. Go to the k8s folder

```bash
cd k8s
```

2. Create the GCR Secret

```bash
kubectl create secret docker-registry gcr-secret \
 --docker-server=us.gcr.io \
 --docker-username=_json_key \
 --docker-password="$(cat .secrets/gcr-service-agent-sa.json)" \
 --docker-email="$(cat .secrets/gcr-service-agent-sa.json | grep client_email | awk '{print substr($2, 2, length($2) - 3)}')"
```

3. Create Firestore SA Secret

```bash
kubectl create secret generic firestore-sa-credentials --from-file=firestore_sa.json=.secrets/firestore_sa.json
```

## Build and Publish the React App 🌐

1. Go to the web folder

```bash
cd web
```

2. Create your .env file with the API route

```bash
cat 'REACT_APP_API_BASE_URL=/api/' > .env
```

3. Build the app source code

```bash
yarn build
```

4. Set the env var for the image prefix following the [GCR convention](https://cloud.google.com/container-registry/docs/overview)

```bash
PROJECT_ID=XXXXXXX
IMG_PREFIX=us.gcr.io/${PROJECT_ID}/
```

5. Build the app image

```bash
docker build . -t ${IMG_PREFIX}demo-web:v1.0 -t ${IMG_PREFIX}demo-web:latest
```

6. Push the app image to GCR

```bash
docker push ${IMG_PREFIX}demo-web --all-tags
```

## Build and Publish the Python API 🕸️

1. Go to the api folder

```bash
cd api
```

2. Set the env var for the image prefix following the [GCR convention](https://cloud.google.com/container-registry/docs/overview)

```bash
PROJECT_ID=XXXXXXX
IMG_PREFIX=us.gcr.io/${PROJECT_ID}/
```

3. Build the app image

```bash
docker build . -t ${IMG_PREFIX}demo-api:v1.0 -t ${IMG_PREFIX}demo-api:latest
```

4. Push the app image to GCR

```bash
docker push ${IMG_PREFIX}demo-api --all-tags
```

## Deploy the system on K8s 🚀

_Now that you have everything ready to deploy, let's do it_

1. Go to the k8s route

```bash
cd k8s
```

2. Create the api deployment and services

```bash
cd api
kubectl create -f api.deployment.yml --save-config
kubectl create -f api.service.yml --save-config
kubectl create -f api.lb.yml --save-config
```

3. Create the web deployment and service

```bash
cd api
kubectl create -f web.deployment.yml --save-config
kubectl create -f web.service.yml --save-config
```

4. Test your app, run the next command to get the external IP for the Web Service, once it is ready test the connection between the app and api

```bash
kubectl get svc
```

**if no external IP is show wait and run the command again**
