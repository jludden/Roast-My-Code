import React, { useState, useRef, useContext } from 'react';
import { Emoji, Picker, EmojiData, emojiIndex } from 'emoji-mart';
import data from 'emoji-mart/data/twitter.json';
import 'emoji-mart/css/emoji-mart.css';

export const EmojiReactionsBar = ({ reactions }: { reactions: { [emojiKey: string]: number } }) => {
    const [pickedEmoji, setPickedEmoji] = useState<EmojiData | string>(':santa::skin-tone-3:');
    const handleEmojiPicked = (emoji: EmojiData, event: any) => {
        setPickedEmoji(emoji);
    };

    return (
        <>
            <div className="float-emoji-pane">
                {typeof pickedEmoji === 'string' ? pickedEmoji : `${pickedEmoji.id}: ${pickedEmoji.name}`}
                <Emoji emoji={pickedEmoji} size={16} />
            </div>
            <div className="float-emoji-pane">
                {reactions &&
                    Object.entries(reactions).map(([emojiKey, numReactions]) => (
                        <div>
                            <Emoji emoji={emojiKey} size={32} />
                            <span>{numReactions}</span>
                        </div>
                    ))}

                {/* <NimblePicker set='twitter' data={data} /> */}
                <Picker
                    set="twitter"
                    onClick={handleEmojiPicked}
                    recent={['+1', 'joy', 'heart_eyes', 'nauseated_face']}
                    showPreview={false}
                    emojiTooltip={true}
                    exclude={['places']}
                />
            </div>
        </>
    );
};