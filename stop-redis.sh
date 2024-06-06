#!/bin/bash

# Specify the container name
name="redis"

# Check if the container exists
if docker container inspect "$name" &>/dev/null; then
    # Stop and remove the container
    docker stop "$name"
fi