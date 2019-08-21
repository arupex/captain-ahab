const  Icons = {
    kubernetes : 'fas fa-cloud',
    pod :'fas fa-seedling',
    network : 'fas fa-network-wired',
    docker:'fab fa-docker',
    log: 'fas fa-file-medical-alt',
    trash:'fas fa-trash-alt',
    trashAll:'fas fa-dumpster-fire',
    node : 'fas fa-fish',
    image: 'fas fa-images',
    container:'fas fa-box-open',
    boat : 'fas fa-ship',
    play : 'fas fa-play-circle',
    stop : 'far fa-stop-circle',
    refresh : 'fas fa-sync'
};

class Html {

    static Icons() { return Icons; }

    static getIcon(icon) {
        return `<i class="${icon}"></i>`;
    }

    static table(json) {
        return `<table>
            ${Object.keys(json).map((key) => {
                return `<tr><td>${json[key]}</td></tr>`;
        }).join('')}
        </table>`
    }

    static card(header, link, content, type = 'primary') {
        return `<div class="card text-white bg-${type}">
                <div class="card-heading text-white"><a class="text-white" href="${link}">${header}</a></div>
                <div class="card-body text-white">
                    ${content}
                </div>
            </div>`;
    }

    static cardGroup(cards) {
        return `<div class="card-group">${cards}</div>`;
    }

    static row(content) {
        return `<div class="row">${content}</div>`;
    }

    static rootCardGroup(breadcrumb = '', content) {
        return Html.root(breadcrumb, Html.cardGroup(content));
    }

    static breadcrumb(rawLink) {
    return `<div class="row">

            <div class="wizard">
            <div class="wizard-inner">
            <div class="connecting-line"></div>
            <ul class="nav nav-tabs" role="tablist">
            
            ${rawLink.split('/').reduce((acc, v) => { acc.push(v);acc.push('/');return acc;}, []).map((part, i, fullUrlParts) => `
            <li role="presentation" class="active">
            <a href="${fullUrlParts.slice(0,i+1).join('')}" title="${part}">
            <span class="round-tab">${part}</span>
            </a>
            </li>`).join('')}
            
            </ul>
            </div>
            </div>
            </div>`
    }

    static root(breadcrumb = '', content) {
        return `
        <!doctype html>
<html ng-app>
<head>
    <script src="//code.jquery.com/jquery-3.3.1.slim.min.js"
            integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
            crossorigin="anonymous"></script>
    <script src="//stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
            integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
            crossorigin="anonymous"></script>
    <link rel="stylesheet" href="//stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <script src="//use.fontawesome.com/releases/v5.10.1/js/all.js" data-auto-replace-svg="nest"></script>
<!--    <link rel="stylesheet" href="style.css">-->
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.7.8/angular.min.js"></script>
<!--    <script src="urlParser.js"></script>-->
<style>a.text-white{color:white} a.text-white:hover{color:black}</style>
</head>
<body>


<div class="container">
    <div class="row"><br><br></div>
    
    ${breadcrumb}
    <div class="row"><br><br></div>
    ${content}

</div>
</body>
</html>
`;
    }
}

module.exports = Html;