# Malstream

This project represents my master thesis in Computer Engineering.
It aims to attribute and to contextualize large file stream using a rule based approach.

It supports the most 3 popular attribution rules:
- [Sigma](https://github.com/SigmaHQ/sigma)
- [Yara](https://yara.readthedocs.io/en/stable/writingrules.html)
- [Suricata](https://suricata.readthedocs.io/en/suricata-6.0.0/what-is-suricata.html)

The goal of the project is to provide a complete framework to ingest and attribute malware samples based on the previous rules.

It is based on the following open-source projects for the static and dynamic malware analysis:
- [IntelOwl](https://github.com/intelowlproject/IntelOwl)
- [CAPEv2](https://github.com/kevoreilly/CAPEv2)
- [Mquery](https://github.com/CERT-Polska/mquery)

It supports various kinds of analysis:
- Static and enrichment with IntelOwl
- Dynamic analysis with CAPEv2 and Elasticsearch Agent
- Retrohunt analys with Mquery and Elasticsearch

## Architecture

The framework architecture is shown in the following picture.

![implementazione drawio](https://user-images.githubusercontent.com/11561782/229914250-6c081420-5e19-4534-83e0-284d1a2decaa.png)

It is composed by several modules:
- __Connectors__: Python3 scripts that periodically take data from external feeds and upload into Malstream. There is a module for each source (currently MalwareBaazar and Tria.ge are supported).
- __Backend__: FastAPI framework with Celery for the asynchronous tasks that manage the analysis steps. Celery is based on RabbitMQ, that implements three priority queues to distribute the analysis workload.
- __Dynamic Analysis module__: custom version of [CAPEv2](https://github.com/CorraMatte/CAPEv2), that supports the analysis of Sigma rules with the Elasticsearch agent installed on the Virtual Machine. It also contains API to synchronize the Suricata and YARA rules present in CAPEv2.
- __Static Analysis and Enrichmet module__: custom version of [IntelOwl](https://github.com/CorraMatte/IntelOwl), configured to enable only the YARA and hash analysis. It also contains API to synchronize the YARA rules present in IntelOwl.
- __Retrohunt Analysis module__: custom version of [Mquery](https://github.com/CorraMatte/mquery), with additional endpoint to upload and download malware sample.
- __Frontend__: developed with ReactJS to manage the rules and the results.

## Evaluate SIGMA rule

The process to dynamically evaluate the SIGMA rule is shown in the following picture.

![sistema_proposta-implementazione-2-Implemetation-SIGMA-3-SIGMA-3 drawio](https://user-images.githubusercontent.com/11561782/234222197-02d9b432-9632-4ccd-af3d-2569f2e3ae8f.png)

## Installation
First, install the services from the customized repositories. They contain the changes that allows malstream to synchronize the rules inside each analyzers. To install this services, follow the official project manual.
- [IntelOwl](https://github.com/CorraMatte/IntelOwl). The configuration can be found in this project, under `configs/analyzer_config.json`. Only a subset of the exist0ing analyzers are enabled, and a custom analzyer is created.
- [Mquery](https://github.com/CorraMatte/mquery).
- [CAPEv2](https://github.com/CorraMatte/CAPEv2). After installing the framework and at least a working virtual machine, configure the snapshot in the following manner:
  - Install the Elastic Agent without enable it.
  - Install sysmon and use you favorite configuration. A very verbose setting can be found ad `configs/sysmonconfig-export.xml`.
  - Place the Elastic agent configuration template inside the system installation folder. The configuration ca be found at `configs/elastic-agent.yml`. The CAPEv2 agent will searh the template configuration under `%PROGRAMW6432%/Elastic/Agent/elastic-agent.yml`.
  - Create a snapshot that will be used to run the analysis.
  
 To intall the Malstream frontend, just:
 - install `node` (currently tested on v20.1.0)
 - go in the frontend folder;
 - run `npm install` and `npm run start`;
 
 To install the Malstrea backend:
- Install [Poetry](https://python-poetry.org/), currently tested on 1.3.2.
- Install [RabbitMQ](https://www.rabbitmq.com/) also from Docker. Currently tested on RabbitMQ 3.11.15.
- Run `poetry install`.
- Run the Celery workers. These are the commands with the proper workload distribution.
```
poetry run celery -A backend worker -c 1 --loglevel=info -Q retrohunt,sandbox -n retrohunt_node
poetry run celery -A backend worker -c 2 --loglevel=info -Q enrichment,sandbox -n enrichment_node
poetry run celery -A backend worker -c 6 --loglevel=info -Q sandbox -n sandbox_node
```

These configuration are tested on a host with 4 CPUs and 8GB of RAM.
2 VMs are configured in CAPEv2 framework.

### Authors
- Matteo Corradini (corra.matteo@gmail.com)


### Aknowledge
A special thanks to the mantainers of IntelOwl, CAPEv2 and Mquery.
