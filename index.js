//Puppeteer and Node.js Web Scraping Project by Ilayda Ademoglu 

const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({headless: false, }, 
    );

    const page = await browser.newPage();
    await page.goto('https://cnet.com', {waitUntil: 'load'});
    await page.waitForSelector('.col-4');

    //Taking the last 5 latest news
    const grablatestNews = await page.evaluate(()=>{
        headersLatestNews = Array.from(document.querySelectorAll('.col-4 h3')).map((partner) => partner.innerText).slice(0,5);
        return headersLatestNews;
    })

    //Taking the last 5 latest new summary
    const grabshortSummary = await page.evaluate(()=>{
        shortSummaries = Array.from(document.querySelectorAll('.col-4 p a')).map((partner) => partner.innerText).slice(0,5);
        return shortSummaries;
    })

    //Taking the last 5 latest new URL
    const grabUrLStory = await page.evaluate(()=>{
        URLSummaries = Array.from(document.querySelectorAll('.col-4 p a')).map((partner) => partner.href).slice(0,5);
        return URLSummaries;
    })

    //Category section is from URL
    let categories = [];

    for (let i = 0; i < 5; i++) {

        //Category location is always fixed last 3rd '/'
        var parts = grabUrLStory[i].split('/');
        var answer = parts[parts.length - 3];
        categories.push(answer);

      }

    const startId = 6243352;
    const qty = 5;
  
    //Arrays for other information
    let authors = [];
    let tags = [];
    let dates = [];
    let imageRes = [];


    const jsonres = [];

    for (let i = 0; i < 5; i++) {
      try {
        //New browser for each story in order
        const page = await browser.newPage();
        await page.goto(grabUrLStory[i]); //Gets the URL
        await page.waitForSelector('.author');

        const nameAuthor = await page.$eval('.author', el => el.innerText);
        authors.push(nameAuthor);
        

        const getTheTags = await page.evaluate(()=>{
            categoriesGet = Array.from(document.getElementsByClassName('tag')).map((partner) => partner.innerText);
            return categoriesGet;
        });
        tags.push(getTheTags);

        const getTheDate = await page.evaluate(()=>{
            //datesGet = Array.from(document.getElementsByClassName('c-assetAuthor_date')).map((partner) => partner.innerText);
            datesGet = document.getElementsByClassName('c-assetAuthor_date')[0].innerText;

            return datesGet;
        });
        dates.push(getTheDate);

        const gettheResource = await page.evaluate(()=>{
            images = document.querySelectorAll('.imageContainer')[0].firstChild.children[0].currentSrc
            return images;
        });
        imageRes.push(gettheResource);

        res.push({
              title: grablatestNews[i],
              summary: grabshortSummary[i],
              categories: categories[i],
              tags: getTheTags,
              author: nameAuthor,
              time: getTheDate,
              URL: grabUrLStory[i],
              imageURL: gettheResource,


        });
      
      }
      catch (err) {}
    }

  
    console.log(grablatestNews);
    console.log(grabshortSummary);
    console.log(grabUrLStory);
    console.log(imageRes);
    console.log(authors);
    console.log(tags);
    console.log(dates);
    console.log(categories);

    //Mapping arrays for JSON Object
    const mapArrays = (grablatestNews, grabshortSummary,categories,grabUrLStory,imageRes,authors,tags,dates) => {
        const res = [];
        for(let i = 0; i < grablatestNews.length; i++){
           res.push({
              title: grablatestNews[i],
              summary: grabshortSummary[i],
              categories: categories[i],
              tags: tags[i],
              author: authors[i],
              time: dates[i],
              URL: grabUrLStory[i],
              imageURL: imageRes[i],


           });
        };
        return res;
     };


     console.log(mapArrays(grablatestNews,grabshortSummary,categories,grabUrLStory,imageRes,authors,tags,dates));
     var jsonObject = JSON.stringify(mapArrays(grablatestNews,grabshortSummary,categories,grabUrLStory,imageRes,authors,tags,dates));
    

     //Writing the JSON File so that server can access
     fs.writeFile("data2.json", jsonObject, (err) => {
        // Error checking
        if (err) throw err;
        console.log("New data added");
      });

})()

