import React, { useState, useRef, useContext } from 'react';
import { Emoji, Picker, EmojiData, emojiIndex } from 'emoji-mart';
import { Message, Box, Textarea, Button, Card, Content, Icon, Delete, Dropdown } from 'rbx';
import { FaSmile } from 'react-icons/fa';
import data from 'emoji-mart/data/twitter.json';
import 'emoji-mart/css/emoji-mart.css';

export const EmojiReactionsBar = ({ reactions }: { reactions: { [emojiKey: string]: number } }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedReactions, setSelectedReactions] = useState<string[]>([]);

    const addPickedEmoji = (emoji: string | undefined) => {
        if (emoji) {
            setSelectedReactions([...selectedReactions, emoji]);
            setIsOpen(false);
        }
    };

    const removeEmoji = (emoji: string) => {
        setSelectedReactions(selectedReactions.filter(e => e !== emoji));
    };

    return (
        <>           
            <div className="float-emoji-pane">
                {selectedReactions.map((pickedEmoji) => (
                  <Button size="small"
                    onClick={() => removeEmoji(pickedEmoji)}>
                    <Emoji key={pickedEmoji} emoji={pickedEmoji} size={16} />
                </Button>
                ))}
                <Button size="small" onClick={() => setIsOpen(!isOpen)}>
                    <FaSmile />
                </Button>
            </div>
            
            {isOpen && <EmojiReactionsBarInner addPickedEmoji={addPickedEmoji} reactions={reactions} />}
        </>
    );
};

const EmojiReactionsBarInner = ({
    reactions,
    addPickedEmoji,
}: {
    reactions: { [emojiKey: string]: number };
    addPickedEmoji: (emoji: string | undefined) => void;
}) => {
    const [pickedEmoji, setPickedEmoji] = useState<EmojiData | string>(':santa::skin-tone-3:');
    const handleEmojiPicked = (emoji: EmojiData, event: any) => {
        setPickedEmoji(emoji);
        addPickedEmoji(emoji.colons);
    };

    return (
        <>
            {/* <div className="float-emoji-pane">
                {typeof pickedEmoji === 'string' ? pickedEmoji : `${pickedEmoji.id}: ${pickedEmoji.name}`}
                <Emoji emoji={pickedEmoji} size={16} />
            </div> */}
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
