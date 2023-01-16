import { MatrixClient } from 'matrix-bot-sdk';

import './utils/globals';
import { generateAndStartClient, onMessage } from './utils/client-setup';
import { handleMultiMessageCommand } from './utils/multimessagecommand';
import { changeAvatar, changeDisplayname } from './commands/customise';


async function onEvents(client : MatrixClient) {
    onMessage(client, 
        async (roomId, event, sender, content, body, requestEventId, isEdit, isHtml, mentioned) => {
        
        if (isHtml) {
            if (mentioned) {
                let command = mentioned.toLowerCase();

                handleMultiMessageCommand(client, roomId, event, 
                    (command.includes('picture') || command.includes('avatar')), 
                    true, 
                    {
                        description: 'avatar change',
                        messageType: 'm.image',
                        functionToExecute: changeAvatar
                    }, 
                    'Setting new avatar! If your next message is an image, I will update my avatar to that.');
                
                handleMultiMessageCommand(client, roomId, event,
                    (command.includes('name') || command.includes('handle')), 
                    true, 
                    {
                        description: 'display name change',
                        messageType: 'm.text',
                        functionToExecute: changeDisplayname
                    }, 
                    'Setting new display name! I\'ll set it to the contents of your next message.');
            }
        }
    });

}

generateAndStartClient().then((client : MatrixClient) => {
    onEvents(client);
});