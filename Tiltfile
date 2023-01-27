# -*- mode: Python -*

#Sdocker_build('api-nest-image', '.')
k8s_yaml('k8s/deploy-dev.yaml')
k8s_yaml('k8s/deploy-dev-grafana.yaml')
k8s_yaml('k8s/deploy-dev-kafka.yaml')

local_resource(
  'deploy',
  'date +%s > start-time.txt'
)




k8s_resource('grafana', port_forwards=3000,
    resource_deps=['deploy']
)

k8s_resource('kafka-broker', port_forwards=9092,
    resource_deps=['deploy']
)


