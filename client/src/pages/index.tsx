import Head from "next/head";
import React, {KeyboardEvent, SyntheticEvent, useEffect, useState} from "react";


type TextOutput = {
    value: string;
    error: boolean;
};


type TokenType = {
    access_token: string;
    token_type: string;
    bearer: string;
}


type WpmType = {
    avg_wpm: number;
}

type LeaderBoardData = {
    username: string,
    avgwpm: number
}


const hostAddr = "http://localhost:8000";
const tokenDataStorageKey = "tokenData";
const defaultStartTime = 10;

const paragraphs = [
    "The quick brown fox jumped over the lazy dog. It landed gracefully on the other side, leaving the dog in awe of its agility and speed.",
    "As the sun set over the horizon, painting the sky in hues of pink and orange, people gathered on the beach to witness the breathtaking spectacle.",
    "In the bustling city, skyscrapers pierced the skyline, casting long shadows on the crowded streets below. A symphony of honking horns and distant chatter filled the air.",
    "She strolled through the quaint town, admiring the charming architecture and vibrant storefronts. Each corner seemed to tell a story of its own, inviting exploration.",
    "The ancient oak tree stood tall in the middle of the enchanted forest, its branches adorned with moss and leaves whispering secrets of centuries gone by.",
    "Amidst the laughter and clinking glasses, friends gathered to celebrate life's moments. The air was filled with joy and the promise of unforgettable memories.",
    "On the mountaintop, the air was crisp and thin, offering panoramic views of valleys and peaks. A sense of tranquility enveloped those who dared to venture so high.",
    "With a pen in hand, she wrote letters to faraway friends, capturing the essence of her adventures and the magic of the places she had visited.",
    "The scientist peered through the microscope, discovering a microscopic world teeming with life. Each cell and organism held the key to unlocking mysteries of the universe.",
    "In the meadow, wildflowers swayed in the gentle breeze, creating a colorful tapestry beneath the azure sky. Bees buzzed, contributing to nature's symphony.",
    "The detective carefully examined the clues, piecing together fragments of information. In the dimly lit room, a single lamp cast long shadows, adding to the mystery.",
    "Beneath the starry night, a campfire crackled, casting flickering shadows on the faces of storytellers. Tales of adventure and imagination danced in the warm glow.",
    "At the crossroads of decision, she pondered the paths that lay ahead. Each choice held the potential to shape her destiny, like diverging rivers on a map.",
    "In the hushed museum, artifacts from ancient civilizations whispered tales of bygone eras. Visitors marveled at the artifacts, connecting with history in a tangible way.",
    "The orchestra filled the concert hall with melodic tunes, captivating the audience. Each note was a brushstroke, painting a vivid auditory masterpiece in the minds of listeners.",
    "As the first drops of rain fell, the parched earth sighed in relief. Petrichor wafted through the air, signaling the beginning of a cleansing downpour.",
    "Under the canopy of stars, a solitary traveler navigated the desert, guided only by the celestial bodies above. The vast expanse echoed with the silence of the night.",
    "In the cozy library, bookshelves lined with literary treasures invited readers to embark on adventures within the pages. Each book was a portal to another world.",
    "The artist, with a palette of vibrant colors, transformed a blank canvas into a masterpiece. Each brushstroke was a deliberate expression of creativity and emotion.",
    "With a telescope aimed at the cosmos, astronomers unraveled the mysteries of distant galaxies. The universe, vast and infinite, beckoned exploration and discovery.",
    "On the riverbank, a fisherman cast his line, patiently waiting for a tug. The rhythmic flow of the water mirrored the steady passage of time.",
    "In the bustling market, vendors peddled their wares, creating a lively tapestry of sights and sounds. Aromas of spices and street food filled the air.",
    "A family gathered around the dinner table, sharing laughter and stories. The aroma of home-cooked meals created a sense of warmth and togetherness.",
    "As the seasons changed, leaves transformed from vibrant green to hues of red and gold. Nature's canvas displayed the passage of time in a breathtaking display.",
    "The scholar delved into ancient manuscripts, deciphering forgotten languages. Each page held the key to unlocking the wisdom of civilizations long gone.",
    "In the early morning, dew glistened on blades of grass as the world awakened. Birds chirped, heralding the start of a new day filled with possibilities.",
    "The architect envisioned a skyline that harmonized modernity with nature. Blueprints and designs were meticulous, creating structures that stood as testaments to human ingenuity.",
    "Beneath the twinkling city lights, a couple danced under the night sky. The cityscape became a backdrop to their love story, illuminated by the glow of street lamps.",
    "On the rocky cliff, a solitary lighthouse stood tall, guiding ships through treacherous waters. Its beacon pierced the darkness, a symbol of hope in the vast sea.",
    "As the sun dipped below the horizon, the city skyline transformed into a glittering panorama. Lights flickered to life, casting reflections on the calm waters below."
]


function setEndOfContenteditable(contentEditableElement: any) {
    var range, selection;
    if (document.createRange) { // Firefox, Chrome, Opera, Safari, IE 9+
        range = document.createRange(); // Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement); // Select the entire contents of the element with the range
        range.collapse(false); // Collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection(); // Get the selection object (allows you to change selection)
        if (selection === null) {
            return;
        }
        selection.removeAllRanges(); // Remove any selections already made
        selection.addRange(range);// Make the range you have just created the visible selection
        // @ts-ignore
    } else if (document.selection) { //IE 8 and lower
        // @ts-ignore
        range = document.body.createTextRange(); // Create a range (a range is a like the selection but invisible)
        // @ts-ignore
        range.moveToElementText(contentEditableElement); // Select the entire contents of the element with the range
        range.collapse(false); // Collapse the range to the end point. false means collapse to end rather than the start
        range.select(); // Select the range (make it the visible selection
    }
}


function onKeyStart(event: KeyboardEvent, text: string) {
    var back = false;
    if (event.key.length != 1) {
        if (event.key !== "BackSpace") {
            event.preventDefault();
            return null;
        } else {
            back = true;
        }
    }

    var element;
    var textPlaceHolder;

    var eventDocument = event.currentTarget.ownerDocument;

    element = eventDocument.getElementById('textEntry');
    textPlaceHolder = eventDocument.getElementById('placeHolderText');

    if (element) {
        if (!element.textContent || !textPlaceHolder) {
            return null;
        }

        var ipt = element.textContent;

        if (back) {
            textPlaceHolder.textContent = text.substring(ipt.length, text.length);
            return null;
        } else {
            event.preventDefault();
        }

        setEndOfContenteditable(element);

        textPlaceHolder.textContent = text.substring(ipt.length + 1, text.length);
        let returnVal;

        if (text.at(ipt.length) === event.key) {
            returnVal = {value: event.key, error: false};
        } else {
            returnVal = {value: event.key, error: true}
        }
        return returnVal;
    }
    return null;
}


var tmpTxt = paragraphs[Math.floor(Math.random() * paragraphs.length)] ||
    "Cake or pie? I can tell a lot about you by which one you pick. " +
    "It may seem silly, but cake people and pie people are really different. " +
    "I know which one I hope you are, but that's not for me to decide. " +
    "So, what is it? Cake or pie?";


function setTokenData(token: TokenType) {
    localStorage.setItem(tokenDataStorageKey, JSON.stringify(token));
}


function getTokenData(): TokenType | null {
    var tokenData = localStorage.getItem(tokenDataStorageKey);
    if (tokenData) {
        return JSON.parse(tokenData);
    }

    return null;
}


async function getLeaderboard(): Promise<LeaderBoardData[] | undefined> {
    var resp = await fetch(hostAddr + "/", {
        method: "GET",
        headers: {
            "accept": "application/json"
        },
    });

    var leaderboard;
    var jsonResp = await resp.json();


    if (jsonResp) {
        leaderboard = jsonResp.leaderboard;
    }

    return leaderboard;
}


function doLogin(username: string, password: string) {
    fetch(hostAddr + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "accept": "application/json"
        },
        body: new URLSearchParams({
            'username': username,
            'password': password
        }),
    }).then((resp) => {
        resp.json().then(jsonData => {
            // console.log(jsonData);
            if (jsonData.access_token) {
                setTokenData(jsonData);
            }
        });
    });
}

function finishTyping(wpm: number) {
    fetch(hostAddr + `/new_round?wpm=${wpm}`, {
        method: "POST",
        headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${getTokenData()?.access_token}`
        }
    }).then((resp) => {
        resp.json().then(jsonData => {
            // console.log(jsonData);
            if (jsonData.access_token) {
                setTokenData(jsonData);
            }
        });
    });
}


function LoginForm(): React.JSX.Element {
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();

    const startLogin = (event: SyntheticEvent) => {
        event.preventDefault();
        if (username && password) {
            doLogin(username, password)
        }
    }

    return (
        <>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in
                        to your account</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6"
                    onSubmit={startLogin}>
                        <div>
                            <label htmlFor="username"
                                   className="block text-sm font-medium leading-6 text-gray-900">Username</label>
                            <div className="mt-2">
                                <input id="username" name="username" type="username" autoComplete="username" required
                                       onChange={(e) => setUsername(e.target.value)}
                                       className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password"
                                       className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                            </div>
                            <div className="mt-2">
                                <input id="password" name="password" type="password" autoComplete="current-password"
                                       required
                                       onChange={(e) => setPassword(e.target.value)}
                                       className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div>
                            <button type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign
                                in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}


function TypingTest(): React.JSX.Element {
    let textInput: HTMLDivElement | null = null;
    const [text, setText] = useState<string>(tmpTxt);
    const [currentWpm, setCurrentWpm] = useState<number>(-1);

    const [typingTime, setTypingTime] = useState<number>(defaultStartTime);
    const [typingActive, setTypingActive] = useState(false);
    const [childEls, setChildEls] =
        useState<TextOutput[]>([{value: '', error: false}]);

    useEffect(() => {
        if (textInput) {
            textInput.focus();
        }

        if (typingActive && typingTime > 0) {
            const timer = setTimeout(() => {
                // console.log("minus: ", typingTime);
                setTypingTime(typingTime - 1);
                if (typingTime == 1) {
                    // TODO Calculate WPM
                    var letterCount = 0;
                    childEls.forEach((el) => {
                        // console.log(el.value);

                        letterCount += el.value.length;
                    });
                    var wpm = (letterCount * 5) / ( 60 / defaultStartTime);
                    setCurrentWpm(wpm);
                    finishTyping(wpm)
                }
                },
                1000);

            return () => { // this runs as the clean up function for the useEffect
                clearInterval(timer)
            }
        }
    }, [typingTime, typingActive]);

    const onTextEdited = (event: KeyboardEvent) => {
        // @ts-ignore
        var x: TextOutput | null = onKeyStart(event, text);
        if (!typingActive) {
            setTypingActive(true);
        }

        if (typingTime <= 0) {
            return;
        }
        if (!childEls) {
            setChildEls([]);
        }

        if (x) {
            // @ts-ignore
            var lastEl = childEls.at(childEls.length - 1);

            if (lastEl && lastEl.error === x.error) {
                lastEl.value = lastEl.value + x.value;
                // or lastEl.value == x.value
            } else {
                // @ts-ignore
                setChildEls((oldChildEls) => [...oldChildEls, x]);
            }
        }
    }

    return (
        <div className="outline-none h-4 rounded-sm text-xl font-mono block" tabIndex={2}>
            <div
                id="textEntry"
                contentEditable={true}
                suppressContentEditableWarning={true}
                onKeyDown={onTextEdited}
                className="block"
                ref={(el) => textInput = el}
            >
                {
                    childEls.map(el => (
                        <span suppressHydrationWarning
                              className={el.error ? "outputText" : "outputText"}>{el.value}</span>
                    ))
                }
            </div>
            <div suppressHydrationWarning id="placeHolderText" className="text-gray-400">
                {text}
            </div>
            <br />
            <div className="text-red-600">
                {
                    typingActive ?
                        `Time left: ${typingTime}s`: ''
                }
            </div>
            <div className="text-purple-500">
                {
                    currentWpm >= 0 ? `WPM: ${currentWpm}` : ''
                }
            </div>
        </div>
    )
}


export default function Home() {
    const [token, setToken] = useState<string | null>()
    const [leaderboard, setLeaderboard] = useState<LeaderBoardData[] | undefined>();

    useEffect(() => {
        // console.log(getLeaderboard())
        async function s() {
            setLeaderboard(await getLeaderboard());
        }

        s();

        var tkData = getTokenData();
        if (tkData) {
            setToken(tkData.access_token);
        }
    }, []);

    return (
        <>
            <Head>
                <title>Typing Test</title>
                <meta name="description" content="Typing Test"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main
                className="flex min-h-screen flex-col items-center justify-normal bg-gradient-to-b from-[#E4E4E4] to-[#05E0FC]">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                        <span className="text-[hsl(280,100%,70%)]">Typing Test</span>
                    </h1>
                    {
                        token ?
                            <TypingTest/> :
                            <LoginForm/>
                    }
                    <br/>
                    <br/>
                    <br/>
                    {
                        leaderboard ?
                            <div>
                            <h2>Leaderboard</h2>
                            <div>
                                <table className="table-auto border-separate">
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>WPM</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        leaderboard.map(el => (
                                            <tr>
                                                <th>
                                                    {el.username}
                                                </th>
                                                <th>
                                                    {el.avgwpm}
                                                </th>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </table>
                            </div>
                </div>
                            : <></>
                    }
                </div>
            </main>
        </>
    );
}
