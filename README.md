## Supreme US Monitor ONLY!!!! - its out now

- uhh sorry guys supreme-monitor-2 won't be out until I finish my midterms + prepping for my internships soon...
  - I will still update this monitor if needed.

## Instruction

- Please install NodeJS before installing anything, once you install nodejs...
- Please install yarn, once you install yarn...
- Please install git, once you install git
- open your terminal, run => git clone https://github.com/ericz99/supreme-monitor.git
- cd into that folder => open your terminal or cmd => run yarn install => to install all package
- then run => yarn run start, if you want to run forever please run => pm2 start index.js
- please change config.example.json file to => config.json instead
  - in your config.json => for your discord if you want to customize it please input your stuff => input any proxies; FORMAT: ip:port:user:pass

## Features

- Restock Monitor
- Proxy Support
- Newly Added Item
- Database Configuration
- Quick Task Integrated (Implemented majority of the bot quick task)
- US ONLY

## Todo

- [x] Restock Monitor
- [x] Proxy Support
- [x] Newly Added Item \* DID NOT TEST THIS SEASON YET, BUT SHOULD WORK
- [ ] Database Configuration \* CURRENTLY NOT IMPLEMENTED
- [x] Quicktask - Only Cyber, PD, Aurora as of now
- [x] Supported - US ONLY

## Images

![1](https://i.imgur.com/SvubPRR.png)

## Quick Note

- Sorry, EU, JP does not work, they will both work on my other version that I will be uploading soon.
- No, I did not use the endpoint, because I feel that the front end store is much faster than loading thru backend.
  - I'll upload another version with endpoint implemented and it will probably be the exact same speed as the other version...
- I would recommend using proxies because you will get temp ban or ban from supreme during drop day.
  - You are able to only use user pass proxies, i'll add ip auth later.
- I added comments so people can use this for monitor references
- I also recommend not going lower than 1500 ms delay because you are bound to be banned during drop day. go for 2k - 3k delay.
- Fast proxies = lower delay.
- I will actively update monitor if site changes of course. But, feel free to use both implementation if yall want to.
- If proxies is banned it will rotate to the next proxy
- It's normal for monitor to spam the same item frequently. I tested it on my personal supreme monitor that I recently created, and both result the same thing.

## Bugs?

- submit an issue, and i'll look into it.

## License

```
The MIT License (MIT)

Copyright (c) 2019 Eric Zhang

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
