CAPTAIN_AHAB.analyzeUrl = () => window.location.search.substr(1).split('&').reduce((acc, kv) => {
    let [key, value] = kv.split('=');

    acc[key] = value;

    return acc;
}, {});