FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y wget curl gnupg2

# Add Chainlink GPG key
RUN wget -O - https://raw.githubusercontent.com/chainlink/docker-chainlink/master/chainlink.gpg | gpg --dearmor -o /usr/share/keyrings/chainlink.gpg
RUN echo "deb [signed-by=/usr/share/keyrings/chainlink.gpg] https://chainlink.github.io/chainlink/stable/ubuntu/22.04 amd64 main" | tee /etc/apt/sources.list.d/chainlink.list

RUN apt-get update && apt-get install -y chainlink

# Create a Chainlink configuration file
RUN mkdir -p /etc/chainlink
COPY chainlink.config.yaml /etc/chainlink/chainlink.config.yaml

# Expose the Chainlink port (8080)
EXPOSE 8080

# Command to run the Chainlink node
CMD chainlink node run --config /etc/chainlink/chainlink.config.yaml
