'use strict';
const html = require('./lib/html');
const K8S = (new (require('./k8sClient'))());
const Docker = (new (require('./dockerClient'))());
const getPort = require('./getPort');
module.exports = {

    '/' : {
        method : 'get',
        go : async ({}) => {
            return html.rootCardGroup('',
                html.card('Kubernetes', '/kubernetes/clusters', '', 'primary') +
                    html.card('Docker', '/docker', '', 'primary'));
        }
    },
    '/docker/containers' : {
        method : 'get',
        go : async ({}) => {

        }
    },
    '/docker/containers/:containerName' : {
        method : 'get',
        go : async ({}) => {

        }
    },
    '/kubernetes/clusters' : {
        method : 'get',
        go : async ({}, url) => {
            return html.rootCardGroup(html.breadcrumb(url) ,K8S.getClusters().map(cluster => html.card(cluster, `/kubernetes/clusters/${cluster}`, '', 'primary')).join(''));
        }
    },
    '/kubernetes/clusters/:cluster' : {
        method : 'get',
        go : async ({cluster}, url) => {
            return html.rootCardGroup(html.breadcrumb(url),
                html.card('Namespaces', `/kubernetes/clusters/${cluster}/namespaces`, '', 'primary') +
                    html.card('Nodes', `/kubernetes/clusters/${cluster}/nodes`, '', 'primary'));
        }
    },
    '/kubernetes/clusters/:cluster/namespaces' : {
        method : 'get',
        go : async ({cluster}, url) => {
            return html.rootCardGroup(html.breadcrumb(url) ,K8S.getNameSpaces({cluster}).map(({metadata : {name}}) => html.card(name, `/kubernetes/clusters/${cluster}/namespaces/${name}`, '', 'primary')));
        }
    },
    '/kubernetes/clusters/:cluster/namespaces/:namespace/' : {
        method : 'get',
        go : async ({cluster, namespace}, url) => {
            return html.rootCardGroup(html.breadcrumb(url) ,html.card('Pods', `/kubernetes/clusters/${cluster}/namespaces/${namespace}/pods`, '', 'primary'));
        }
    },
    '/kubernetes/clusters/:cluster/namespaces/:namespace/pods' : {
        method : 'get',
        go : async ({cluster, namespace}, url) => {
            return html.rootCardGroup(html.breadcrumb(url) ,K8S.getPods({cluster, namespace}).map(({metadata : {name}}) => html.card(`${name}`, `/kubernetes/clusters/${cluster}/namespaces/${namespace}/pods/${name}`, '', 'primary')).join(''));
        }
    },

    '/kubernetes/clusters/:cluster/namespaces/:namespace/pods/:pod' : {
        method : 'get',
        go : async ({cluster, namespace, pod}, url) => {
            let localPort = await getPort();

            return html.rootCardGroup(html.breadcrumb(url) ,
                    html.card(`Logs`, `/kubernetes/clusters/${cluster}/namespaces/${namespace}/pods/${pod}/logs`, '', 'primary') +

                    K8S.getPods({cluster, namespace}).filter(({metadata:{name}}) => pod === name).reduce((acc, {spec:{containers},metadata : {name}}) => {
                            Object.keys(containers.reduce((portAccumulator, { ports }) => {
                                ports.forEach(({containerPort}) => portAccumulator[containerPort] = true);
                                return portAccumulator;
                            }, {})).forEach((port) => {
                                return acc += html.card(`Connect Local ${localPort} to Remote ${port}`, `/kubernetes/clusters/${cluster}/namespaces/${namespace}/pods/${pod}/connect/${localPort}/${port}`, '', 'primary')
                            })
                        return acc;
                    }, '')
                );
        }
    },

    '/kubernetes/clusters/:cluster/namespaces/:namespace/pods/:pod/logs' : {
        method : 'get',
        go : async ({cluster, namespace, pod}, url) => {
            return html.rootCardGroup(html.breadcrumb(url) ,html.card(`Logs`, '', K8S.getPodLog({cluster, namespace, pod}), 'primary'));
        }
    },


    '/kubernetes/clusters/:cluster/namespaces/:namespace/pods/:pod/connect/:localPort/:remotePort' : {
        method : 'get',
        go : async ({cluster, namespace, pod, localPort, remotePort}, url) => {
            setTimeout(() => K8S.connect({cluster, namespace, pod, localPort, remotePort}), 1);
            return html.rootCardGroup(html.breadcrumb(url) , html.card(`Connected to pod remotely...`, '', `Connect on port ${localPort}`,'primary'));
        }
    },

    '/kubernetes/clusters/:cluster/nodes' : {
        method : 'get',
        go : async ({cluster}, url) => {
            return html.rootCardGroup(html.breadcrumb(url) , K8S.getNodes({cluster}).map((node) => html.card(`${node.name}`, '', html.table(node), 'primary')));
        }
    },
};