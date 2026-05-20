#!/bin/bash

# Script pour créer un tunnel SSH vers le service gRPC distant
# Usage: ./grpc-tunnel.sh

EC2_HOST="15.237.187.80"
REMOTE_PORT="50051"
LOCAL_PORT="50051"

echo "=== Tunnel SSH vers gRPC ==="
echo ""

# Demander le nom d'utilisateur
read -p "Nom d'utilisateur SSH (ex: ec2-user): " SSH_USER

if [ -z "$SSH_USER" ]; then
    echo "Erreur: Le nom d'utilisateur est requis"
    exit 1
fi

# Demander le chemin vers la clé PEM
read -p "Chemin vers le fichier PEM: " PEM_PATH

if [ -z "$PEM_PATH" ]; then
    echo "Erreur: Le chemin vers le fichier PEM est requis"
    exit 1
fi

# Vérifier que le fichier PEM existe
if [ ! -f "$PEM_PATH" ]; then
    echo "Erreur: Le fichier PEM n'existe pas: $PEM_PATH"
    exit 1
fi

echo ""
echo "Configuration:"
echo "  - Utilisateur: $SSH_USER"
echo "  - Clé PEM: $PEM_PATH"
echo "  - Host distant: $EC2_HOST"
echo "  - Port distant: $REMOTE_PORT"
echo "  - Port local: $LOCAL_PORT"
echo ""
echo "Connexion en cours..."
echo "Une fois connecté, le gRPC sera accessible sur localhost:$LOCAL_PORT"
echo "Appuyez sur Ctrl+C pour fermer le tunnel"
echo ""

# Créer le tunnel SSH
ssh -i "$PEM_PATH" -L ${LOCAL_PORT}:127.0.0.1:${REMOTE_PORT} -N ${SSH_USER}@${EC2_HOST}
