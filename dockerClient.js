

const spawn = (cmd) => {
    console.log(cmd);
    return (require('child_process').execSync(cmd, { stderr : 'ignore'})).toString('utf8');
};

class DockerClient {

    getContainers () {
        return this.parseJson(spawn(`docker ps -a --format '{{json .}}'`));
    }

    startContainer(container) {
        return spawn(`docker container start ${container}`);
    }

    startContainer(container) {
        return spawn(`docker stop ${container}`);
    }


    parseJson(str) {
        return JSON.parse(str);
    }

}

module.exports = DockerClient;