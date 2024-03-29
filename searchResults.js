import config from "./config.js"
const apiUrlget = config.apiUrlget;
const questionsList = document.querySelector(".questions_list")
const apiUrlgetUser = config.apiUrlgetUser;

AWS.config.update({
    region: config.region,
    accessKeyId: config.accessKet,
    secretAccessKey: config.secretKey,
});

document.addEventListener('click', function(e) {
    var clickedElement = (e.target)
    if (clickedElement.id == "text_box_question_content") {
        var alt = clickedElement.getAttribute('alt')
        window.location = `viewQuestion?questionId=${alt}`;
    }
    else if (clickedElement.id == "text_box_pfp") {
        var alt = clickedElement.getAttribute('alt')
        window.location = `profile?username=${alt}`;
    }
    else if (clickedElement.id == "asked_by_line") {
        var alt = clickedElement.getAttribute('alt')
        window.location = `profile?username=${alt}`;
    }
}, false);

const urlParams = new URLSearchParams(window.location.search)
async function getUser(username){ //getting user info from dynamo
    const url = new URL(`${apiUrlgetUser}?username=${username}`);
    const user = await fetch(url,  {
        mode: "cors",
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(response => response.json());
    return user
}
function getTimeDifference(timestamp) {
    const currentTime = new Date();
    const previousTime = new Date(timestamp);
    const timeDiff = currentTime.getTime() - previousTime.getTime();

    // Calculate time differences in seconds, minutes, hours, days, and weeks
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (weeks > 0) {
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }
}

var query = urlParams.get('query');

(async () => {
    const client = new MeiliSearch({
        host: config.searchHost,
        apiKey: config.searchKey,
    });

    const index = client.index('questionListIndex3')
    const search = await index.search(query);

    let idList = []
    for (const id of search.hits) {
        idList.push(id.id)
    }

    const dynamodb = new AWS.DynamoDB.DocumentClient();

    var table = "Freetutor-Question";

    const tableName = 'Freetutor-Question';
    const itemIds = idList;
    const params = {
        RequestItems: {
            [tableName]: {
                Keys: itemIds.map(questionId => ({ questionId })),
            },
        },
    };

    dynamodb.batchGet(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err,
                null, 2));
        } else {
            const items = data.Responses[tableName].map(item => item);

            items.sort((a, b) => {
                const indexA = idList.indexOf(a.questionId);
                const indexB = idList.indexOf(b.questionId);

                return indexA - indexB;
            });

            placeQuestionBoxes(items)
        }
    });

    async function placeQuestionBoxes(items) {
        for (const question of items) {
            const user = await getUser(question.author)
            const pfp = user.user[0].pfp
            var displayedImage = ""
            if (pfp == null){ //getting pfp, if pfp is none it will user default
                displayedImage = "placeholder_pfp.png"
            }
            else{
                displayedImage = `data:image/png;base64,${pfp}`
            }
            if (!question.answersInfo){
                var answers = 0

            }else{
                var answers = question.answersInfo.length
            }
            questionsList.innerHTML +=
                `<div class="box text_box">
             <img id="text_box_pfp" alt="${question.author}" src="${displayedImage}">
             <div id="text_box_question_content" alt="${question.questionId}">${question.title}</div>
             <div id="asked_by_line" alt="${question.author}">asked by ${question.author}, ${getTimeDifference(question.timestamp)}</div>
             <div id="answered_by_line">Be the first to answer!</div>
             <div class="question_stats">
             <div id="question_stats_items">${answers} Answers</div>
             <div id="question_stats_items">${question.views} views</div>
             <div id="question_stats_items">${question.rating} rating</div>
          </div>`
        }
    }


})();

