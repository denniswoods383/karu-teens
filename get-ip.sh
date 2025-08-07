#!/bin/bash

# Get current IP address
IP=$(ip route get 1.1.1.1 | awk '{print $7}' | head -1)

if [ -z "$IP" ]; then
    IP="localhost"
fi

echo $IP