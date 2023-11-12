#!/bin/bash
cd env
docker-compose up --build -d

sleep 100

cd ..
npx prisma migrate deploy