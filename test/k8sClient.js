const K8sClient = require('../k8sClient');
const client = new K8sClient();

let clusters = client.getClusters();

console.log('clusters found', clusters);


let firstCluster = clusters[0];

let nameSpaces = client.getNameSpaces({cluster : firstCluster});
console.log('namespaces', nameSpaces);
let firstNamespace = nameSpaces[0];

let podsOfNamespace = client.getPods({ cluster: firstCluster, namespace : firstNamespace});


console.log('', JSON.stringify(podsOfNamespace, null, 3));
