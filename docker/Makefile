# protège les appels aux commandes make xxx
.PHONY: help init clean build start stop ps sbash rbash

# Récupération des commandes
include .env
export

help: ## Outputs this help screen
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

init: ## first command to run, will create networks, docker images, run composer/npm, etc.
	echo "Génération du projet ${DOCKER_PROJECT}"

SUBNET_FRONTEND_EXISTS=$(shell docker network list | grep frontend | wc -l)
SUBNET_BACKEND_EXISTS=$(shell docker network list | grep backend | wc -l)

ifeq ($(SUBNET_FRONTEND_EXISTS), 0)
	docker network create frontend
endif

ifeq ($(SUBNET_BACKEND_EXISTS), 0)
	docker network create backend
endif

clean:
	docker compose down --remove-orphans

build: stop ## (re)creates the containers
	docker compose up -d

start: ## starts the containers
	docker compose start

stop: ## stops the containers
	docker compose stop

ps: ## stops the containers
	docker compose ps --all

sbash: ## use bash inside the symfony container
	docker compose exec -ti symfony bash

rbash: ## use bash inside the react container
	docker compose exec -ti react bash

install-fixtures:
	docker compose exec symfony bin/console doctrine:fixtures:load --no-interraction