import Head from "next/head";
import Link from "next/link";
import React, {KeyboardEvent, useEffect, useState} from "react";
// [#E4E4E4] to-[#05E0FC]


// const text = "0987654321";

const paragraphs =  [
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

// const randomElement = array[Math.floor(Math.random() * array.length)];

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


type TextOutput = {
  value: string;
  error: boolean;
};


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
        if (! element.textContent || !textPlaceHolder) {
            return null;
        }

       console.log(element.textContent);

        var ipt = element.textContent;

        if (back) {
            textPlaceHolder.textContent = text.substring(ipt.length, text.length);
            return null;
        } else {
            event.preventDefault();
        }

        setEndOfContenteditable(element);

        console.log(text);
        console.log(ipt);

        console.log(event.key);
        console.log(ipt.length)
        console.log(text.at(ipt.length));

        console.log();

        // console.log(text.at(ipt.length - 1));
        // console.log(last);

        textPlaceHolder.textContent = text.substring(ipt.length + 1, text.length);
        let returnVal;


        if (text.at(ipt.length) === event.key) {
            returnVal = {value: event.key, error: false};
        }
        else {
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

function TypingTest(): React.JSX.Element {
    let textInput: HTMLDivElement | null = null;
    const [text, setText] = useState<string>(tmpTxt);


    const [typingActive, setTypingActive] = useState(false);
    const [childEls, setChildEls] =
        useState<TextOutput[]>([{value: '', error: false}]);


    useEffect(() => {
        if (textInput) {
            textInput.focus();
        }
    });



    const onTextEdited = (event: KeyboardEvent) => {
        // @ts-ignore
        var x: TextOutput | null = onKeyStart(event, text);
        setTypingActive(true);
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
                console.log("aaaa");
                // @ts-ignore
                childEls.forEach(console.log);
                console.log(x);

                // @ts-ignore
                setChildEls((oldChildEls) => [...oldChildEls, x]);

                console.log("bbb");
                // @ts-ignore
                childEls.forEach(console.log);
                console.log(x);
            }


            // @ts-ignore
            // setChildEls([x]);
            // setChildEls((childEls) => [...childEls, x]);
        }
    }

    // @ts-ignore
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
                        <span suppressHydrationWarning className={el.error ? "outputText": "outputText"}>{el.value}</span>
                    ))
                }
            </div>
            <div suppressHydrationWarning id="placeHolderText" className="text-gray-400">
                {text}
            </div>
          </div>
    )
}



export default function Home() {
  return (
    <>
      <Head>
        <title>Typing Test</title>
        <meta name="description" content="Typing Test" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-normal bg-gradient-to-b from-[#E4E4E4] to-[#05E0FC]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Typing Test</span>
          </h1>

          <div tabIndex={1} className="gap-4 sm:grid-cols-2 md:gap-8">

            <Link
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                href="#"
            >
              <h3 className="text font-bold">Login →</h3>
            </Link>
          </div>

          <TypingTest />

        </div>
      </main>
    </>
  );
}
