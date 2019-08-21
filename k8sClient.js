const spawn = (cmd) => {
    console.log(cmd);
    return (require('child_process').execSync(cmd, { stderr : 'ignore'})).toString('utf8');
};

const spawnAsync = (cmd) => {
    console.log(cmd);
    return (require('child_process').exec(cmd, { stderr : 'ignore'})).toString('utf8');
};

class K8SClient {

    getClusters () {
        return spawn(`kubectx`).split('\n').filter(e=>e);
    }

    getClusterContext({cluster}) {
        return spawn(`kubectx ${cluster}`);
    }

    getNameSpaces ({cluster}) {
        this.getClusterContext({cluster});

        return this.parseJson(spawn(`kubectl get namespaces -o json`)).items;
    }

    getPods ({cluster, namespace}) {
        this.getClusterContext({cluster});
        return this.parseJson(spawn(`kubectl get pods -o json --namespace ${namespace}`)).items;
    }

    getNodes({cluster}) {
        this.getClusterContext({cluster});
        return this.parseTable(spawn(`kubectl get nodes`));
    }

    connect({cluster, namespace, pod, localPort, remotePort}) {
        this.getClusterContext({cluster});
        return (spawnAsync(`kubectl port-forward -n ${namespace} ${pod} ${localPort}:${remotePort}`));
    }

    parseJson(str) {
        return JSON.parse(str);
    }

    parseTable(tableLines) {
        let firstLine = [];

        return tableLines.split('\n').filter(e=>e).reduce((acc, line, i) => {
            const trimmedLine = line.split(' ').filter(e=>e);

            if(i !== 0) {
                acc.push(trimmedLine.reduce((inneracc, segment, i) => {
                    inneracc[firstLine[i]] = segment;
                    return inneracc;
                }, {}));
            }
            else {
                firstLine = trimmedLine.map(key => key.toLowerCase());
            }
            return acc;
        }, []);
    }

    deletePod ({cluster, namespace, pod}) {

    }

    getPodLog({cluster, namespace, pod}) {
        const namespaceName = namespace;
        const podName = pod;

        this.getClusterContext({cluster});
        return spawn(`kubectl logs --namespace ${namespaceName} ${podName}`)
    }



}

module.exports = K8SClient;