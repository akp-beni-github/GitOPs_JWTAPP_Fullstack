# Pipeline/ Branches management

<img width="300" alt="Screenshot 2567-08-22 at 15 19 14" src="https://github.com/user-attachments/assets/1e077a6a-4c0d-444d-a015-19e27376ad68"> 

<img width="300" alt="Screenshot 2567-08-23 at 01 44 45" src="https://github.com/user-attachments/assets/327bb4fc-25e6-4755-9bd5-13c24476719f">

# AWS infra

<img width="600" alt="Screenshot 2567-08-23 at 14 00 51" src="https://github.com/user-attachments/assets/36ab0f35-fa7f-4280-9462-f498fd4df155">

# Fullstack Web Application 

<img width="871" alt="Screenshot 2567-08-23 at 02 09 16" src="https://github.com/user-attachments/assets/a496787e-87d2-439d-8d3d-059414b91ebd">

<img width="1440" alt="Screenshot 2567-08-23 at 02 33 41" src="https://github.com/user-attachments/assets/2ea22b09-bc0c-48eb-b6f7-c0fb93f35c81">

# Set up CMD


📌Deploy Service

aws ecs create-service --service-name frontend-service \
--cli-input-json file://servicedef-front.json \
--enable-execute-command

aws ecs create-service --service-name backend-service \
--cli-input-json file://servicedef-back.json \
--enable-execute-command

📌configure service discovery manually

📌EXEC (opt)

aws ecs execute-command --cluster jwt-cluster \
--task <taskid> \
--container frontend-service  \
--command "/bin/bash" \
--interactive

aws ecs execute-command --cluster jwt-cluster \
--task<taskid> \
--container backend-service  \
--command "/bin/bash" \
--interactive

📌MySQL create database: mydatabase

mysql -h <rds-endpoint> -u username -p

aws ecs describe-services --cluster jwt-cluster --services frontend-service

aws ecs update-service --cluster jwt-cluster \
--service backend-service \
--enable-execute-command \
--force-new-deployment

## result
[infra result.pdf](https://github.com/user-attachments/files/16726161/infra.result.pdf)
