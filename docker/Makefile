# protège les appels aux commandes make xxx
.PHONY: clean restart start stop run init test build ps

# Récupération des commandes
include .env
export

help: ## Outputs this help screen
	@grep -E '(^[a-zA-Z0-9_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

init:
	echo "Génération du projet ${DOCKER_PROJECT}"

SUBNET_FRONTEND_EXISTS=$(shell docker network list | grep frontend | wc -l)
SUBNET_BACKEND_EXISTS=$(shell docker network list | grep backend | wc -l)

ifeq ($(SUBNET_FRONTEND_EXISTS), 0)
	docker network create frontend
endif

ifeq ($(SUBNET_BACKEND_EXISTS), 0)
	docker network create backend
endif


bash:
	docker compose exec -ti symfony bash
