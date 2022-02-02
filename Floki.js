const CoinGecko = require('coingecko-api');
const Discord = require('discord.js');
const client = new Discord.Client({intents: ["GUILDS","GUILD_MESSAGES","GUILD_MESSAGE_TYPING"]});

const CoinGeckoClient = new CoinGecko();

async function getShibPrice(){
    let apiReq = await CoinGeckoClient.simple.price({
        ids: ['shiba-inu'],
        vs_currencies: ['usd'],
    });
    return await Promise.resolve(apiReq.data['shiba-inu'].usd);
}

function returnDateTime(){
    let dateTime = new Date().toLocaleString().replace(',','');
    return dateTime.toString();
}

async function main(){
    client.login('your_key_string_here');
    let currentShibPrice = await getShibPrice();
    client.on('ready', () => {
        console.log(`[${returnDateTime()}] Logged in as ${client.user.tag}!`)
    })
    
    client.on("message", async msg => {
      if (msg.author.bot) return
        
      if (msg.content === "$shib") {
        let tempShibPrice = "the current price of Shiba Inu is: $" + (await getShibPrice()).toFixed(8);
        msg.channel.send(tempShibPrice);
        console.log(`[${returnDateTime()}] User requested price via $shib command\n\t\t\tReturned '${tempShibPrice}'`);
      }
    })
    for (;;){
        await new Promise(r => setTimeout(r, 60000));
        let freshPrice = await getShibPrice();
        let changePercent = (freshPrice*100/currentShibPrice).toFixed(2)
        console.log(`[${returnDateTime()}] Latest Price: ${freshPrice.toFixed(8)}\t\t${changePercent}% of ${currentShibPrice.toFixed(8)}`);
        if (currentShibPrice * 1.05 < freshPrice){
            let increaseString = 'Price Increase! Current price of Shiba Inu is: ' + freshPrice.toFixed(8);
            client.channels.cache.get('your_channel_id_here').send(increaseString);
            currentShibPrice = freshPrice;
            console.log(`[${returnDateTime()}] price increase message sent to users.`);
        }else if (currentShibPrice * .95 > freshPrice){
            let decreaseString = 'Price Decrease. Current Price of Shiba Inu is: ' + freshPrice.toFixed(8);
            client.channels.cache.get('your_channel_id_here').send(decreaseString);
            currentShibPrice = freshPrice;
            console.log(`[${returnDateTime()}] price decrease message sent to users.`);
        }
    }
}
main();