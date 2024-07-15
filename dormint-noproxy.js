// Making by Topgod1st (Tloc)
// github: https://github.com/locthy/Dormint

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { get } = require('http');

const tokenFilePath = path.join(__dirname, 'tokens.txt');
const proxyFilePath = path.join(__dirname, 'proxy.txt');
const tokenData = fs.readFileSync(tokenFilePath, 'utf8').trim().split('\n').map(token => token.trim());


const animatedLoading = (durationInMilliseconds) => {
    const frames = ["|", "/", "-", "\\"];
    const endTime = Date.now() + durationInMilliseconds;
    return new Promise(resolve => {
        const interval = setInterval(() => {
            const remainingTime = Math.floor((endTime - Date.now()) / 1000);
            const frame = frames[Math.floor(Date.now() / 250) % frames.length];
            process.stdout.write(`\rChờ đợi lần yêu cầu tiếp theo ${frame} - Còn lại ${remainingTime} giây...`);
            if (Date.now() >= endTime) {
                clearInterval(interval);
                process.stdout.write("\rĐang chờ yêu cầu tiếp theo được hoàn thành.\n");
                resolve();
            }
        }, 250);
    });
};


const processAuth = async (token, proxy, count) => {
   

    const payload = {
        "auth_token": token
    };

   

    const config = {
        method: 'post',
        url: 'https://api.dormint.io/tg/farming/status',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
            'Origin': 'https://web.dormint.io',
            'Referer': 'https://web.dormint.io/',
            'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
            'Sec-Ch-Ua-Mobile': '?1',
            'Sec-Ch-Ua-Platform': '"Android"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
        },
        data: payload,
        
    };

    const claimFriends = async () => {
        const claimFriendsConfig = {
            method: 'post',
            url: 'https://api.dormint.io/tg/frens/claimed',
            headers: config.headers,
            data: payload,
           
        };

        try {
            await axios(claimFriendsConfig);
            console.log('Claiming friends....');
        } catch (error) {
            console.error('Cannot claim friends');
        }
    };

    let idTask = 0;
    const doTask = async () => {
        for (idTask; idTask < 11; idTask++) {
            const taskPayload = {
                "auth_token": token,
                "quest_id": idTask
            };

            const taskConfig = {
                method: 'post',
                url: 'https://api.dormint.io/tg/quests/start',
                headers: config.headers,
                data: taskPayload,
               
            };

            try {
                await axios(taskConfig);
                console.log('Performing task number: ', idTask, 'success');
            } catch (error) {
                console.error('Cannot perform task number', idTask);
            }
        }
        if (idTask === 10) idTask = 0;
    };

    const claimFarm = async () => {
        const claimFarmConfig = {
            method: 'post',
            url: 'https://api.dormint.io/tg/farming/claimed',
            headers: config.headers,
            data: payload,
            
        };

        try {
            await axios(claimFarmConfig);
            console.log('Claiming farm....');
        } catch (error) {
            console.error('Not the right time for claiming');
        }
    };

    const startFarm = async () => {
        const startFarmConfig = {
            method: 'post',
            url: 'https://api.dormint.io/tg/farming/start',
            headers: config.headers,
            data: payload,
          
        };

        try {
            await axios(startFarmConfig);
            console.log('Starting farm....');
        } catch (error) {
            console.error('Cannot start farm');
        }
    };

    try {
        const res = await axios(config);
        

        const { health_rate, sleepcoin_balance, status } = res.data;

        console.log('===============Account number', count, '====================');
        console.log('[Health_rate]: ', health_rate);
        console.log('[sleepcoin_balance]: ', sleepcoin_balance);
        console.log('[Claim Status]: ', status);

        await claimFarm();
        await startFarm();
        await claimFriends();
        await doTask();
        await getBalanceAfterClaim(token);
    } catch (error) {
        console.log('Error while posting requests:', error);
    }
    count++;
    if (count > tokenData.length) count = 1;
};

const getBalanceAfterClaim = async (token) =>{
    

    const payload = {
        "auth_token": token
    };


    const config = {
        method: 'post',
        url: 'https://api.dormint.io/tg/farming/status',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
            'Origin': 'https://web.dormint.io',
            'Referer': 'https://web.dormint.io/',
            'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
            'Sec-Ch-Ua-Mobile': '?1',
            'Sec-Ch-Ua-Platform': '"Android"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
       
        },
        data: payload,
        
    };
    try {
        const res = await axios(config);
        const {sleepcoin_balance } = res.data;
        console.log('[Balance after claim]: ', sleepcoin_balance);
    } catch(error){
        console.log('Can not get Balnce. Error code: ', error);
    }
};

const run = async () => {
    
    while (true) {
        console.log('Tloc github: https://github.com/locthy/Dormint ');
        for (let i = 0; i < tokenData.length; i++) {
            await processAuth(tokenData[i], i + 1);
        }
        await animatedLoading(8 * 60 * 60 * 1000 + 10 * 60 * 1000);
        console.log('Tloc github: https://github.com/locthy/Dormint ');
    }
};

run();
